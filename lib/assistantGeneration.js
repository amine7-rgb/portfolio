import { generateProjectBrief } from "../src/projectAssistant.js";

const DEFAULT_MODEL = "gpt-5-mini";

const briefSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "projectType",
    "overview",
    "businessGoal",
    "targetUsers",
    "coreFeatures",
    "pagesModules",
    "adminBackoffice",
    "aiAutomation",
    "suggestedStack",
    "deployment",
    "complexity",
    "openQuestions",
    "requirementSummary"
  ],
  properties: {
    projectType: { type: "string" },
    overview: { type: "string" },
    businessGoal: { type: "string" },
    targetUsers: { type: "string" },
    coreFeatures: { type: "array", items: { type: "string" } },
    pagesModules: { type: "array", items: { type: "string" } },
    adminBackoffice: { type: "string" },
    aiAutomation: { type: "string" },
    suggestedStack: { type: "array", items: { type: "string" } },
    deployment: { type: "string" },
    complexity: { type: "string" },
    openQuestions: { type: "array", items: { type: "string" } },
    requirementSummary: { type: "array", items: { type: "string" } }
  }
};

const normalizeArray = (value, fallback = []) =>
  Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : fallback;

const normalizeText = (value, fallback = "") => String(value || "").trim() || fallback;

const getOutputText = (data) => {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  const firstMessage = data?.output?.find((item) => item.type === "message");
  const firstText = firstMessage?.content?.find((item) => item.type === "output_text");
  return firstText?.text || "";
};

const normalizeBrief = (candidate, fallback) => ({
  projectType: normalizeText(candidate?.projectType, fallback.projectType),
  overview: normalizeText(candidate?.overview, fallback.overview),
  businessGoal: normalizeText(candidate?.businessGoal, fallback.businessGoal),
  targetUsers: normalizeText(candidate?.targetUsers, fallback.targetUsers),
  coreFeatures: normalizeArray(candidate?.coreFeatures, fallback.coreFeatures),
  pagesModules: normalizeArray(candidate?.pagesModules, fallback.pagesModules),
  adminBackoffice: normalizeText(candidate?.adminBackoffice, fallback.adminBackoffice),
  aiAutomation: normalizeText(candidate?.aiAutomation, fallback.aiAutomation),
  suggestedStack: normalizeArray(candidate?.suggestedStack, fallback.suggestedStack),
  deployment: normalizeText(candidate?.deployment, fallback.deployment),
  complexity: normalizeText(candidate?.complexity, fallback.complexity),
  openQuestions: normalizeArray(candidate?.openQuestions, fallback.openQuestions),
  requirementSummary: normalizeArray(candidate?.requirementSummary, fallback.requirementSummary),
  requirements: fallback.requirements || []
});

const buildSystemPrompt = (language) => `You are an expert freelance software discovery assistant.
Turn rough client ideas into concise, professional project briefs.
Focus on projects related to websites, dashboards, booking flows, e-commerce, AI chatbots, automation, backend systems, and deployment workflows.
Write the brief in ${language === "ar" ? "Arabic" : "English"}.
Keep the tone polished, practical, and client-facing.
Avoid hype, filler, and vague promises.
Do not mention that this was AI-generated.
Keep each field specific and useful for project scoping.
For arrays, use short concrete items, not paragraphs.`;

const buildUserPrompt = ({ draft, fallbackBrief, language }) => {
  const requirements = (draft.requirements || []).join(", ") || "None selected";

  return `Create a refined project brief from this discovery data.

Current site language: ${language}
Project type selection: ${draft.projectType || "custom"}
Raw idea:
${draft.rawIdea || "Not provided"}

Audience:
${draft.audience || "Not provided"}

First important user action:
${draft.firstAction || "Not provided"}

Selected requirements:
${requirements}

Timeline:
${draft.timeline || "Not provided"}

Use this structured baseline as supporting context, but improve the writing naturally:
${JSON.stringify(fallbackBrief, null, 2)}

Return only the structured brief in the requested schema.`;
};

export const generateAssistantBrief = async ({
  draft,
  language = "en",
  apiKey = "",
  model = DEFAULT_MODEL
}) => {
  const fallbackBrief = generateProjectBrief(draft);

  if (!apiKey) {
    return {
      brief: fallbackBrief,
      mode: "fallback",
      reason: "missing_api_key",
      model: "local-structured"
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        reasoning: { effort: "low" },
        max_output_tokens: 1400,
        instructions: buildSystemPrompt(language),
        input: buildUserPrompt({ draft, fallbackBrief, language }),
        text: {
          format: {
            type: "json_schema",
            name: "project_brief",
            description: "A structured professional project brief for a freelance web project lead.",
            strict: true,
            schema: briefSchema
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const outputText = getOutputText(data);

    if (!outputText) {
      throw new Error("OpenAI response did not contain structured output text.");
    }

    const parsed = JSON.parse(outputText);

    return {
      brief: normalizeBrief(parsed, fallbackBrief),
      mode: "openai",
      reason: "openai_success",
      model
    };
  } catch (error) {
    console.error("OpenAI assistant generation failed", error);
    return {
      brief: fallbackBrief,
      mode: "fallback",
      reason: "openai_error",
      model: "local-structured"
    };
  }
};
