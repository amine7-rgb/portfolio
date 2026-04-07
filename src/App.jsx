import { useEffect, useMemo, useState } from "react";
import { translations } from "./i18n.js";

const heroImages = [
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80"
];

const profileLinks = {
  email: "amed14170@gmail.com",
  github: "https://github.com/amine7-rgb",
  linkedin: "https://www.linkedin.com/in/mohamedamine-eloudi-aa47b6198/"
};

const stacks = [
  "Node.js",
  "React.js",
  "MongoDB",
  "Angular",
  "Spring Boot",
  "Laravel",
  "WordPress",
  "SQL",
  "CI/CD",
  "AI Models",
  "Chatbots"
];

const footerLinks = [
  { key: "email", href: `mailto:${profileLinks.email}`, icon: "mail", value: profileLinks.email },
  { key: "linkedin", href: profileLinks.linkedin, icon: "linkedin", value: "mohamedamine-eloudi" },
  { key: "github", href: profileLinks.github, icon: "github", value: "amine7-rgb" }
];

function useTyping(words, speed = 70, pause = 1200) {
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const isComplete = letterCount === word.length;
    const isEmpty = letterCount === 0;
    const delay = isComplete && !deleting ? pause : deleting ? speed / 1.8 : speed;

    const timer = setTimeout(() => {
      if (isComplete && !deleting) {
        setDeleting(true);
        return;
      }

      if (isEmpty && deleting) {
        setDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
        return;
      }

      setLetterCount((current) => current + (deleting ? -1 : 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [deleting, letterCount, pause, speed, wordIndex, words]);

  return words[wordIndex].slice(0, letterCount);
}

function App() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [contactDockOpen, setContactDockOpen] = useState(false);
  const t = translations[language];
  const typedRole = useTyping(t.hero.roles);
  const isRtl = language === "ar";

  const currentHeroImage = heroImages[slide];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [isRtl, language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((current) => (current + 1) % heroImages.length);
    }, 5200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sectionIds = ["home", ...t.nav.links.map((link) => link.href.replace("#", ""))];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    sections.forEach((section) => observer.observe(section));
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    return () => {
      observer.disconnect();
      revealObserver.disconnect();
    };
  }, [t.nav.links]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  const projectCards = useMemo(() => t.projects.items, [t.projects.items]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setToast({ type: "info", message: t.contact.sending });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setForm({ name: "", email: "", company: "", budget: "", message: "" });
      setToast({ type: "success", message: t.contact.success });
    } catch {
      setToast({ type: "error", message: t.contact.error });
    }
  };

  return (
    <div className={`site ${theme}`} dir={isRtl ? "rtl" : "ltr"}>
      <header className="nav">
        <a href="#home" className="brand" aria-label="Amine portfolio home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-code">&lt;/&gt;</span>
            <span className="brand-dot" />
          </span>
          <span className="brand-text">
            Amine
          </span>
        </a>
        <nav className="nav-links" aria-label={t.nav.label}>
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={activeSection === link.href.replace("#", "") ? "active" : ""}
              aria-current={activeSection === link.href.replace("#", "") ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="language-switch"
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            aria-label="Switch language"
          >
            <span className={language === "en" ? "active" : ""}>EN</span>
            <span className={language === "ar" ? "active" : ""}>AR</span>
          </button>
          <button
            className={`theme-switch ${theme}`}
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? t.nav.light : t.nav.dark}
          >
            <span className="theme-track">
              <span className="theme-icon sun" aria-hidden="true" />
              <span className="theme-icon moon" aria-hidden="true" />
              <span className="theme-knob" />
            </span>
            <span className="theme-label">{theme === "dark" ? t.nav.light : t.nav.dark}</span>
          </button>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="hero"
          style={{ "--hero-image": `url(${currentHeroImage})` }}
          aria-label={t.hero.aria}
        >
          <div className="hero-overlay reveal is-visible">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>
              {t.hero.title}
              <span>{typedRole}</span>
            </h1>
            <p className="hero-copy">{t.hero.copy}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#contact">
                {t.hero.primary}
              </a>
              <a className="secondary-button" href="#projects">
                {t.hero.secondary}
              </a>
            </div>
            <div className="hero-proof" aria-label={t.hero.metricsLabel}>
              {t.hero.metrics.map((metric) => (
                <strong key={metric.value}>
                  {metric.value}
                  <span>{metric.label}</span>
                </strong>
              ))}
            </div>
            <div className="slider-dots" aria-label={t.hero.slider}>
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={index === slide ? "active" : ""}
                  type="button"
                  aria-label={`${t.hero.slide} ${index + 1}`}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section reveal">
          <div className="section-heading">
            <p className="eyebrow">{t.services.eyebrow}</p>
            <h2>{t.services.title}</h2>
            <p>{t.services.copy}</p>
          </div>
          <div className="service-grid">
            {t.services.items.map((item) => (
              <article className="panel" key={item.title}>
                <span>{item.kicker}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="section compact reveal">
          <div className="section-heading">
            <p className="eyebrow">{t.stack.eyebrow}</p>
            <h2>{t.stack.title}</h2>
          </div>
          <div className="stack-list">
            {stacks.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </section>

        <section id="projects" className="section reveal">
          <div className="section-heading">
            <p className="eyebrow">{t.projects.eyebrow}</p>
            <h2>{t.projects.title}</h2>
            <p>{t.projects.copy}</p>
          </div>
          <div className="project-grid">
            {projectCards.map((project) => (
              <article className="project-card" key={project.title}>
                <img src={project.image} alt="" loading="lazy" />
                <div>
                  <p>{project.type}</p>
                  <h3>{project.title}</h3>
                  <span>{project.stack}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section compact reveal">
          <div className="section-heading">
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2>{t.process.title}</h2>
          </div>
          <div className="workflow-road">
            <svg className="workflow-path" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="workflowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00c2a8" stopOpacity="0.12" />
                  <stop offset="38%" stopColor="#54f0d8" stopOpacity="0.95" />
                  <stop offset="72%" stopColor="#00a6c8" stopOpacity="0.88" />
                  <stop offset="100%" stopColor="#00c2a8" stopOpacity="0.16" />
                </linearGradient>
              </defs>
              <path className="workflow-path-glow" d="M40 150 C170 40 270 40 400 150 S630 260 760 150 S900 40 960 118" />
              <path className="workflow-path-line" d="M40 150 C170 40 270 40 400 150 S630 260 760 150 S900 40 960 118" />
              <circle className="workflow-orb orb-one" cx="78" cy="126" r="6" />
              <circle className="workflow-orb orb-two" cx="492" cy="218" r="6" />
              <circle className="workflow-orb orb-three" cx="900" cy="74" r="6" />
            </svg>
            {t.process.steps.map((step, index) => (
              <article className="workflow-step" key={step.title} style={{ "--step-index": index }}>
                <span className="workflow-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section reveal">
          <div className="contact-copy">
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2>{t.contact.title}</h2>
            <p>{t.contact.copy}</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              {t.contact.name}
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              {t.contact.email}
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              {t.contact.company}
              <input name="company" value={form.company} onChange={handleChange} />
            </label>
            <label>
              {t.contact.budget}
              <select name="budget" value={form.budget} onChange={handleChange}>
                <option value="">{t.contact.budgetPlaceholder}</option>
                {t.contact.budgetOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="wide">
              {t.contact.message}
              <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
            </label>
            <div className="form-actions wide">
              <button className="primary-button contact-submit" type="submit">
                {t.contact.submit}
              </button>
            </div>
          </form>
        </section>
      </main>
      <footer className="footer reveal">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" className="footer-logo" aria-label="Mohamed Amine Oudi home">
              <span className="brand-mark brand-mark-large" aria-hidden="true">
                <span className="brand-code">&lt;/&gt;</span>
                <span className="brand-dot" />
              </span>
            </a>
            <div>
              <h2>{t.footer.name}</h2>
              <p>{t.footer.copy}</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
      <div
        className={`contact-dock ${contactDockOpen ? "open" : ""}`}
        onMouseLeave={() => setContactDockOpen(false)}
        aria-label={t.footer.linksLabel}
      >
        <div className="dock-links">
          {footerLinks.map((link, index) => (
            <a
              key={link.key}
              className={`dock-link ${link.icon}`}
              href={link.href}
              style={{ "--dock-index": index }}
              target={link.key === "email" ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={t.footer.links[link.key]}
            >
              <span aria-hidden="true" />
              <small>{t.footer.links[link.key]}</small>
            </a>
          ))}
        </div>
        <button
          className="dock-toggle"
          type="button"
          aria-label={t.footer.linksLabel}
          aria-expanded={contactDockOpen}
          onClick={() => setContactDockOpen((current) => !current)}
          onFocus={() => setContactDockOpen(true)}
        >
          <svg className="dock-face" viewBox="0 0 84 84" aria-hidden="true">
            <defs>
              <radialGradient id="faceAura" cx="34%" cy="24%" r="78%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.44" />
                <stop offset="48%" stopColor="#54f0d8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#041014" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className="face-glow" cx="42" cy="42" r="37" />
            <circle className="face-aura" cx="42" cy="42" r="31" fill="url(#faceAura)" />
            <g className="face-sad">
              <path className="face-brow" d="M23 23L36 27" />
              <path className="face-brow" d="M61 23L48 27" />
              <path className="face-eye" d="M22 34C27 30 32 30 37 34" />
              <path className="face-eye" d="M47 34C52 30 57 30 62 34" />
              <path className="face-mouth" d="M28 61C34 50 50 50 56 61" />
            </g>
            <g className="face-happy">
              <path className="face-spark" d="M17 25L17 17" />
              <path className="face-spark" d="M13 21L21 21" />
              <path className="face-eye" d="M23 31C28 36 33 36 38 31" />
              <path className="face-eye" d="M46 31C51 36 56 36 61 31" />
              <path className="face-mouth" d="M25 50C31 66 53 66 59 50" />
              <path className="face-smile-shine" d="M33 56C38 60 46 60 51 56" />
              <circle className="face-cheek" cx="20" cy="48" r="4" />
              <circle className="face-cheek" cx="64" cy="48" r="4" />
            </g>
          </svg>
          <span className="dock-code-badge" aria-hidden="true">
            &lt;/&gt;
          </span>
        </button>
      </div>
      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <span />
          <p>{toast.message}</p>
          <button type="button" aria-label={t.contact.closeToast || "Close notification"} onClick={() => setToast(null)}>
            x
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
