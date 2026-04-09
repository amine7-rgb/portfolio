import { useEffect, useMemo, useRef, useState } from "react";
import { translations } from "./i18n.js";
import {
  assistantProjectTypes,
  assistantRequirementOptions,
  assistantTimelineOptions,
  generateProjectBrief
} from "./projectAssistant.js";

const TEASER_STORAGE_KEY = "amine-idea-assistant-muted-until";
const teaserDelayMs = 7000;
const teaserVisibleMs = 5200;
const teaserReminderMs = 45 * 60 * 1000;
const teaserOpenMuteMs = 6 * 60 * 60 * 1000;

const initialDraft = {
  projectType: "custom",
  rawIdea: "",
  audience: "",
  firstAction: "",
  requirements: [],
  timeline: ""
};

const initialLead = {
  name: "",
  email: "",
  company: "",
  budget: "",
  notes: ""
};

const AssistantAvatar = ({ alt }) => <img src="/assistant-avatar.svg" alt={alt} loading="lazy" />;

function ProjectAssistant({ language, budgetOptions, onToast }) {
  const copy = translations[language]?.assistant || translations.en.assistant;
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [lead, setLead] = useState(initialLead);
  const [brief, setBrief] = useState(null);
  const [generationMode, setGenerationMode] = useState("fallback");
  const [generationModel, setGenerationModel] = useState("local-structured");
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const ideaInputRef = useRef(null);

  const canGenerate = draft.rawIdea.trim().length > 0;
  const previewBrief = useMemo(() => (canGenerate ? generateProjectBrief(draft) : null), [canGenerate, draft]);
  const selectedType = assistantProjectTypes.find((item) => item.id === draft.projectType) || assistantProjectTypes.at(-1);
  const generationKey = useMemo(() => JSON.stringify({ language, draft }), [draft, language]);

  useEffect(() => {
    if (open) {
      setTeaserVisible(false);
      localStorage.setItem(TEASER_STORAGE_KEY, String(Date.now() + teaserOpenMuteMs));
      return undefined;
    }

    const mutedUntil = Number(localStorage.getItem(TEASER_STORAGE_KEY) || 0);

    if (mutedUntil > Date.now()) {
      return undefined;
    }

    let hideTimer;

    const showTimer = setTimeout(() => {
      setTeaserVisible(true);

      hideTimer = setTimeout(() => {
        setTeaserVisible(false);
        localStorage.setItem(TEASER_STORAGE_KEY, String(Date.now() + teaserReminderMs));
      }, teaserVisibleMs);
    }, teaserDelayMs);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timer = setTimeout(() => {
      ideaInputRef.current?.focus();
    }, 180);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (step < 5 || !canGenerate) {
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsGenerating(true);

      try {
        const response = await fetch("/api/assistant-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, draft })
        });

        if (!response.ok) {
          throw new Error("Assistant generation failed");
        }

        const data = await response.json();

        if (cancelled) {
          return;
        }

        setBrief(data.brief || previewBrief);
        setGenerationMode(data.mode || "fallback");
        setGenerationModel(data.model || "local-structured");
      } catch {
        if (cancelled) {
          return;
        }

        setBrief(previewBrief);
        setGenerationMode("fallback");
        setGenerationModel("local-structured");
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [canGenerate, draft, generationKey, language, previewBrief, step]);

  const resetAssistant = () => {
    setDraft(initialDraft);
    setLead(initialLead);
    setBrief(null);
    setGenerationMode("fallback");
    setGenerationModel("local-structured");
    setIsGenerating(false);
    setStep(0);
    setSubmitted(false);
    setSubmitting(false);
  };

  const openAssistant = () => {
    setOpen(true);
    setTeaserVisible(false);
  };

  const closeAssistant = () => {
    setOpen(false);
    localStorage.setItem(TEASER_STORAGE_KEY, String(Date.now() + teaserReminderMs));
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  const toggleRequirement = (value) => {
    setDraft((current) => ({
      ...current,
      requirements: current.requirements.includes(value)
        ? current.requirements.filter((item) => item !== value)
        : [...current.requirements, value]
    }));
    setSubmitted(false);
  };

  const handleLeadChange = (event) => {
    setLead((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitBrief = async (event) => {
    event.preventDefault();

    if (!lead.name || !lead.email || !brief || isGenerating) {
      onToast?.({ type: "error", message: copy.submitError });
      return;
    }

    setSubmitting(true);
    onToast?.({ type: "info", message: copy.sending });

    try {
      const response = await fetch("/api/assistant-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          draft,
          lead,
          brief,
          source: "idea-assistant"
        })
      });

      if (!response.ok) {
        throw new Error("Assistant brief submission failed");
      }

      setSubmitted(true);
      onToast?.({ type: "success", message: copy.submitSuccess });
    } catch {
      onToast?.({ type: "error", message: copy.submitError });
    } finally {
      setSubmitting(false);
    }
  };

  const questionCards = [
    {
      key: "audience",
      title: copy.audienceTitle,
      prompt: copy.audiencePrompt,
      placeholder: copy.audiencePlaceholder
    },
    {
      key: "firstAction",
      title: copy.firstActionTitle,
      prompt: copy.firstActionPrompt,
      placeholder: copy.firstActionPlaceholder
    }
  ];

  const renderQuestionStep = (question, index) => (
    <div className="assistant-step-card">
      <p className="assistant-step-index">{copy.stepLabel} {index + 2}</p>
      <h4>{question.title}</h4>
      <p>{question.prompt}</p>
      <textarea
        rows="4"
        value={draft[question.key]}
        placeholder={question.placeholder}
        onChange={(event) => updateDraft(question.key, event.target.value)}
      />
      <div className="assistant-step-actions">
        <button className="secondary-button" type="button" onClick={() => setStep((current) => current + 1)}>
          {copy.skip}
        </button>
        <button className="primary-button" type="button" onClick={() => setStep((current) => current + 1)}>
          {copy.continue}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`assistant-widget ${open ? "open" : ""}`}>
      {teaserVisible && !open ? (
        <div className="assistant-teaser" role="status" aria-live="polite">
          <button className="assistant-teaser-close" type="button" onClick={() => setTeaserVisible(false)} aria-label={copy.dismissTeaser}>
            x
          </button>
          <p className="assistant-teaser-label">{copy.teaserEyebrow}</p>
          <strong>{copy.teaserTitle}</strong>
          <p>{copy.teaserCopy}</p>
          <button className="assistant-teaser-cta" type="button" onClick={openAssistant}>
            {copy.openAssistant}
          </button>
        </div>
      ) : null}

      <button className="assistant-trigger" type="button" onClick={openAssistant} aria-label={copy.openAssistant}>
        <span className="assistant-status-dot" aria-hidden="true" />
        <span className="assistant-trigger-ring" aria-hidden="true" />
        <span className="assistant-trigger-avatar">
          <AssistantAvatar alt={copy.avatarAlt} />
        </span>
      </button>

      {open ? (
        <aside className="assistant-panel" role="dialog" aria-label={copy.panelTitle}>
          <div className="assistant-panel-header">
            <div className="assistant-panel-title">
              <span className="assistant-panel-avatar">
                <AssistantAvatar alt={copy.avatarAlt} />
              </span>
              <div>
                <p>{copy.panelEyebrow}</p>
                <h3>{copy.panelTitle}</h3>
              </div>
            </div>
            <button className="assistant-close" type="button" onClick={closeAssistant} aria-label={copy.closeAssistant}>
              x
            </button>
          </div>

          <div className="assistant-panel-body">
            <div className="assistant-message">
              <span className="assistant-bubble assistant-bubble-brand">{copy.welcomeTitle}</span>
              <p>{copy.welcomeCopy}</p>
            </div>

            <div className="assistant-quick-types" aria-label={copy.projectTypeLabel}>
              {assistantProjectTypes.map((item) => (
                <button
                  key={item.id}
                  className={draft.projectType === item.id ? "active" : ""}
                  type="button"
                  onClick={() => updateDraft("projectType", item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="assistant-thread">
              <div className="assistant-step-card">
                <p className="assistant-step-index">{copy.stepLabel} 1</p>
                <h4>{copy.ideaTitle}</h4>
                <p>{copy.ideaPrompt}</p>
                <textarea
                  ref={ideaInputRef}
                  autoFocus
                  rows="5"
                  value={draft.rawIdea}
                  placeholder={copy.ideaPlaceholder}
                  onChange={(event) => updateDraft("rawIdea", event.target.value)}
                />
                <div className="assistant-step-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={!draft.rawIdea.trim()}
                  >
                    {copy.startBrief}
                  </button>
                </div>
              </div>

              {step >= 1 && draft.rawIdea ? (
                <div className="assistant-user-reply">
                  <span>{copy.ideaCaptured}</span>
                  <p>{draft.rawIdea}</p>
                </div>
              ) : null}

              {step === 1 ? renderQuestionStep(questionCards[0], 0) : null}
              {step >= 2 ? (
                <div className="assistant-user-reply">
                  <span>{copy.audienceTitle}</span>
                  <p>{draft.audience || copy.skippedAnswer}</p>
                </div>
              ) : null}

              {step === 2 ? renderQuestionStep(questionCards[1], 1) : null}
              {step >= 3 ? (
                <div className="assistant-user-reply">
                  <span>{copy.firstActionTitle}</span>
                  <p>{draft.firstAction || copy.skippedAnswer}</p>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="assistant-step-card">
                  <p className="assistant-step-index">{copy.stepLabel} 4</p>
                  <h4>{copy.requirementsTitle}</h4>
                  <p>{copy.requirementsPrompt}</p>
                  <div className="assistant-chip-grid">
                    {assistantRequirementOptions.map((item) => (
                      <button
                        key={item.id}
                        className={draft.requirements.includes(item.id) ? "active" : ""}
                        type="button"
                        onClick={() => toggleRequirement(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="assistant-step-actions">
                    <button className="primary-button" type="button" onClick={() => setStep(4)}>
                      {copy.continue}
                    </button>
                  </div>
                </div>
              ) : null}

              {step >= 4 ? (
                <div className="assistant-user-reply">
                  <span>{copy.requirementsTitle}</span>
                  <p>{(brief?.requirementSummary || previewBrief?.requirementSummary || []).join(" / ") || copy.noSpecialRequirements}</p>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="assistant-step-card">
                  <p className="assistant-step-index">{copy.stepLabel} 5</p>
                  <h4>{copy.timelineTitle}</h4>
                  <p>{copy.timelinePrompt}</p>
                  <div className="assistant-chip-grid">
                    {assistantTimelineOptions.map((item) => (
                      <button
                        key={item}
                        className={draft.timeline === item ? "active" : ""}
                        type="button"
                        onClick={() => updateDraft("timeline", item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="assistant-step-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => {
                        updateDraft("timeline", draft.timeline || assistantTimelineOptions.at(-1));
                        setStep(5);
                      }}
                    >
                      {copy.skip}
                    </button>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => {
                        updateDraft("timeline", draft.timeline || assistantTimelineOptions.at(-1));
                        setStep(5);
                      }}
                    >
                      {copy.generateBrief}
                    </button>
                  </div>
                </div>
              ) : null}

              {step >= 5 ? (
                <>
                  <div className="assistant-message">
                    <span className="assistant-bubble">{isGenerating ? copy.generatingTitle : copy.generatedTitle}</span>
                    <p>{isGenerating ? copy.generatingCopy : copy.generatedCopy}</p>
                  </div>

                  {brief ? (
                    <>
                      <div className="assistant-summary-grid">
                        <article>
                          <span>{copy.summaryLabels.projectType}</span>
                          <strong>{selectedType.label}</strong>
                        </article>
                        <article>
                          <span>{copy.summaryLabels.timeline}</span>
                          <strong>{draft.timeline || assistantTimelineOptions.at(-1)}</strong>
                        </article>
                        <article>
                          <span>{copy.summaryLabels.complexity}</span>
                          <strong>{brief.complexity}</strong>
                        </article>
                        <article>
                          <span>{copy.summaryLabels.engine}</span>
                          <strong>{generationMode === "openai" ? copy.aiMode : copy.backupMode}</strong>
                        </article>
                      </div>

                      <div className="assistant-engine-note">
                        <span>{copy.engineLabel}</span>
                        <p>{generationMode === "openai" ? `${copy.engineAiCopy} ${generationModel}.` : copy.engineFallbackCopy}</p>
                      </div>

                      <div className="assistant-brief">
                        <article>
                          <span>{copy.sections.overview}</span>
                          <p>{brief.overview}</p>
                        </article>
                        <article>
                          <span>{copy.sections.goal}</span>
                          <p>{brief.businessGoal}</p>
                        </article>
                        <article>
                          <span>{copy.sections.users}</span>
                          <p>{brief.targetUsers}</p>
                        </article>
                        <article>
                          <span>{copy.sections.features}</span>
                          <ul>
                            {brief.coreFeatures.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </article>
                        <article>
                          <span>{copy.sections.modules}</span>
                          <ul>
                            {brief.pagesModules.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </article>
                        <article>
                          <span>{copy.sections.admin}</span>
                          <p>{brief.adminBackoffice}</p>
                        </article>
                        <article>
                          <span>{copy.sections.ai}</span>
                          <p>{brief.aiAutomation}</p>
                        </article>
                        <article>
                          <span>{copy.sections.stack}</span>
                          <div className="assistant-brief-tags">
                            {brief.suggestedStack.map((item) => (
                              <strong key={item}>{item}</strong>
                            ))}
                          </div>
                        </article>
                        <article>
                          <span>{copy.sections.deployment}</span>
                          <p>{brief.deployment}</p>
                        </article>
                        <article>
                          <span>{copy.sections.questions}</span>
                          <ul>
                            {brief.openQuestions.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </article>
                      </div>

                      <div className="assistant-refine">
                        <p>{copy.refineLabel}</p>
                        <div className="assistant-chip-grid">
                          {assistantRequirementOptions.map((item) => (
                            <button
                              key={item.id}
                              className={draft.requirements.includes(item.id) ? "active" : ""}
                              type="button"
                              onClick={() => toggleRequirement(item.id)}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {brief ? submitted ? (
                    <div className="assistant-success">
                      <span className="assistant-bubble assistant-bubble-brand">{copy.successTitle}</span>
                      <p>{copy.successCopy}</p>
                      <button className="primary-button" type="button" onClick={resetAssistant}>
                        {copy.startAnother}
                      </button>
                    </div>
                  ) : (
                    <form className="assistant-lead-form" onSubmit={submitBrief}>
                      <div className="assistant-form-heading">
                        <p>{copy.sendTitle}</p>
                        <span>{copy.sendCopy}</span>
                      </div>
                      <label>
                        {copy.form.name}
                        <input name="name" value={lead.name} onChange={handleLeadChange} required />
                      </label>
                      <label>
                        {copy.form.email}
                        <input name="email" type="email" value={lead.email} onChange={handleLeadChange} required />
                      </label>
                      <label>
                        {copy.form.company}
                        <input name="company" value={lead.company} onChange={handleLeadChange} />
                      </label>
                      <label>
                        {copy.form.budget}
                        <select name="budget" value={lead.budget} onChange={handleLeadChange}>
                          <option value="">{copy.form.budgetPlaceholder}</option>
                          {budgetOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="assistant-form-wide">
                        {copy.form.notes}
                        <textarea name="notes" rows="4" value={lead.notes} onChange={handleLeadChange} />
                      </label>
                      <div className="assistant-form-actions assistant-form-wide">
                        <button className="secondary-button" type="button" onClick={resetAssistant}>
                          {copy.startOver}
                        </button>
                        <button className="primary-button" type="submit" disabled={submitting || isGenerating}>
                          {submitting ? copy.sending : copy.sendBrief}
                        </button>
                      </div>
                    </form>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export default ProjectAssistant;
