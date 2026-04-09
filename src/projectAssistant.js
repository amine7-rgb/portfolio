const projectTypePresets = {
  website: {
    label: "Business website",
    goal: "present the business clearly, build trust quickly, and convert visitors into qualified leads",
    features: ["Clear service presentation", "Lead capture", "Trust and proof sections", "Responsive experience"],
    pages: ["Home", "About", "Services", "Portfolio or case studies", "Contact"],
    stack: ["React.js", "Node.js", "MongoDB", "Responsive UI"],
    admin:
      "A lightweight content area or admin dashboard can be added if the client wants to update services, testimonials, or case studies without developer help.",
    ai:
      "An AI chatbot or discovery assistant can be added to answer common questions, pre-qualify leads, or guide visitors to the right service.",
    deployment:
      "Deploy with CI/CD from GitHub, a staging preview flow, environment management, and production monitoring for fast and reliable releases."
  },
  dashboard: {
    label: "Dashboard / admin panel",
    goal: "centralize operations, make reporting clearer, and give the client a cleaner way to manage day-to-day business activity",
    features: ["Role-based dashboard", "Operational reporting", "Filtering and search", "Data management workflows"],
    pages: ["Authentication", "Dashboard home", "Data tables", "Reports", "Settings"],
    stack: ["React.js", "Node.js", "MongoDB", "REST API"],
    admin:
      "The platform should include role management, protected routes, CRUD workflows, and a clean back-office experience for internal teams.",
    ai:
      "AI can be used for anomaly detection, smart summaries, assistant prompts, or recommendation flows depending on the business data available.",
    deployment:
      "Use CI/CD with testing, protected environment variables, backup strategy, and a deployment flow that separates staging from production."
  },
  booking: {
    label: "Booking platform",
    goal: "make reservations easy, reduce manual coordination, and automate as much of the confirmation flow as possible",
    features: ["Reservation flow", "Availability management", "Confirmation emails", "Client and admin workflows"],
    pages: ["Landing page", "Booking flow", "Calendar or availability", "User account", "Admin dashboard"],
    stack: ["React.js", "Node.js", "MongoDB", "Calendar integrations"],
    admin:
      "The admin side should make it easy to manage schedules, approve or update reservations, and keep the workflow organized from first booking to final confirmation.",
    ai:
      "AI can support guided booking, appointment recommendations, and a chatbot that helps clients choose the right service faster.",
    deployment:
      "Deploy with CI/CD, transactional email setup, calendar integrations, and environment-specific configuration for production reliability."
  },
  ecommerce: {
    label: "E-commerce or paid service platform",
    goal: "present products or services clearly and give users a secure path to buy, book, or request a quote",
    features: ["Catalog or offers", "Checkout or payment flow", "Email confirmations", "Admin product management"],
    pages: ["Catalog", "Offer details", "Checkout", "Order confirmation", "Admin management"],
    stack: ["React.js", "Node.js", "MongoDB", "Payment integration"],
    admin:
      "The admin area should support product, order, offer, and status management with clear visibility into transactions and customer activity.",
    ai:
      "AI can support smarter product discovery, chatbot recommendations, personalized assistance, or automated follow-up sequences.",
    deployment:
      "Use CI/CD, payment webhook monitoring, secure secrets management, and rollback-friendly deployment practices."
  },
  ai: {
    label: "AI chatbot / automation",
    goal: "reduce repetitive manual work and give users a faster, more guided experience through smart automation",
    features: ["Assistant or chatbot flow", "Knowledge or prompt layer", "Lead capture or workflow automation", "Operational integration"],
    pages: ["Assistant entry point", "Conversation flow", "Admin or prompt control", "Analytics or logs"],
    stack: ["React.js", "Node.js", "MongoDB", "AI model integration"],
    admin:
      "The back-office should let the client monitor conversations, update prompts or content, and track the impact of automation over time.",
    ai:
      "This project is naturally AI-led, so the brief should define the assistant scope, business data access, escalation rules, and expected outcomes clearly.",
    deployment:
      "Deploy with protected API keys, observability, prompt/version management, and CI/CD checks for safe iteration."
  },
  devops: {
    label: "Deployment / CI/CD workflow",
    goal: "make releases safer, faster, and more repeatable with a clean delivery pipeline and a production-ready environment",
    features: ["Pipeline automation", "Environment setup", "Quality gates", "Deployment visibility"],
    pages: ["System overview", "Admin or monitoring page", "Logs or status views", "Documentation surface"],
    stack: ["CI/CD pipelines", "GitHub", "Docker or VPS setup", "Monitoring"],
    admin:
      "The focus here is less about user-facing pages and more about deployment workflow, environment separation, logs, alerts, and operational control.",
    ai:
      "AI can still help through smart log summaries, deployment assistant flows, and automated release notes or incident guidance.",
    deployment:
      "The delivery layer is the product focus: structured CI/CD, secrets handling, monitoring, backups, rollback strategy, and clear documentation."
  },
  custom: {
    label: "Custom web product",
    goal: "translate the raw idea into a clear, focused product scope with the right business and technical priorities",
    features: ["Clear user journey", "Core feature set", "Responsive UI", "Stable backend logic"],
    pages: ["Marketing or entry page", "Core user flow", "Protected area if needed", "Contact or support"],
    stack: ["React.js", "Node.js", "MongoDB", "API integrations"],
    admin:
      "An admin or content area can be designed if the client needs internal control over data, users, offers, or workflow status.",
    ai:
      "AI opportunities should only be added where they create clear value, such as guided support, automation, categorization, or recommendation.",
    deployment:
      "Recommend a deployment flow with CI/CD, preview environments, protected secrets, and a production setup that matches the project scale."
  }
};

const keywordSignals = [
  { test: ["admin", "dashboard", "back office", "back-office"], tag: "admin" },
  { test: ["pay", "payment", "paypal", "stripe", "checkout"], tag: "payment" },
  { test: ["book", "booking", "reservation", "appointment"], tag: "booking" },
  { test: ["arabic", "english", "french", "multi language", "multilingual", "bilingual"], tag: "multilingual" },
  { test: ["chatbot", "assistant", "ai", "automation"], tag: "chatbot" },
  { test: ["analytics", "report", "statistics", "tracking"], tag: "analytics" },
  { test: ["api", "integration", "webhook"], tag: "integrations" },
  { test: ["email", "notification", "confirmation"], tag: "notifications" },
  { test: ["marketplace", "catalog", "store"], tag: "catalog" },
  { test: ["calendar", "schedule", "meet"], tag: "calendar" },
  { test: ["login", "auth", "authentication", "role"], tag: "auth" },
  { test: ["pipeline", "ci/cd", "deploy", "deployment", "devops"], tag: "cicd" }
];

export const assistantProjectTypes = [
  { id: "website", label: "Business Website" },
  { id: "dashboard", label: "Dashboard / Admin" },
  { id: "booking", label: "Booking Platform" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "ai", label: "AI Chatbot / Automation" },
  { id: "devops", label: "Deployment / CI/CD" },
  { id: "custom", label: "I already have an idea" }
];

export const assistantRequirementOptions = [
  { id: "admin", label: "Admin dashboard" },
  { id: "payment", label: "Online payment" },
  { id: "booking", label: "Booking flow" },
  { id: "multilingual", label: "Arabic / English" },
  { id: "chatbot", label: "AI chatbot" },
  { id: "analytics", label: "Analytics" },
  { id: "integrations", label: "Integrations / APIs" },
  { id: "notifications", label: "Email notifications" },
  { id: "calendar", label: "Calendar / scheduling" },
  { id: "auth", label: "Authentication" },
  { id: "cicd", label: "CI/CD and deployment" }
];

export const assistantTimelineOptions = [
  "As soon as possible",
  "2 to 4 weeks",
  "1 to 2 months",
  "Flexible timeline"
];

const requirementDescriptions = {
  admin: "Admin dashboard for internal management",
  payment: "Secure online payment flow",
  booking: "Booking and availability workflow",
  multilingual: "Multilingual interface with Arabic and English support",
  chatbot: "AI chatbot or guided assistant experience",
  analytics: "Analytics, reporting, and activity visibility",
  integrations: "Third-party APIs, webhooks, or service integrations",
  notifications: "Email notifications and confirmation messages",
  calendar: "Calendar, scheduling, or appointment management",
  auth: "Secure authentication and protected user roles",
  cicd: "CI/CD pipeline and production-ready deployment process"
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const sentence = (value, fallback) => {
  const text = String(value || "").trim();
  if (!text) {
    return fallback;
  }

  return /[.!?]$/.test(text) ? text : `${text}.`;
};

const titleCase = (value = "") =>
  value
    .split(/[\s/-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

const getSignalsFromText = (text = "") => {
  const lower = text.toLowerCase();
  return keywordSignals
    .filter((signal) => signal.test.some((token) => lower.includes(token)))
    .map((signal) => signal.tag);
};

const collectRequirements = (draft) =>
  unique([
    ...(draft.requirements || []),
    ...getSignalsFromText(draft.rawIdea),
    ...getSignalsFromText(draft.audience),
    ...getSignalsFromText(draft.firstAction)
  ]);

const requirementList = (requirements) => requirements.map((key) => requirementDescriptions[key]).filter(Boolean);

const addConditionalItems = (requirements, features, pages, stack) => {
  if (requirements.includes("payment")) {
    features.push("Secure payment and checkout handling");
    pages.push("Checkout or payment flow");
    stack.push("Payment gateway integration");
  }

  if (requirements.includes("booking")) {
    features.push("Booking flow with availability or reservation logic");
    pages.push("Booking or reservation flow");
  }

  if (requirements.includes("admin")) {
    features.push("Admin management area with protected access");
    pages.push("Admin dashboard");
  }

  if (requirements.includes("multilingual")) {
    features.push("Multilingual content and language switching");
  }

  if (requirements.includes("chatbot")) {
    features.push("Guided AI assistant or chatbot experience");
    stack.push("AI assistant integration");
  }

  if (requirements.includes("analytics")) {
    features.push("Analytics, reporting, or performance visibility");
    pages.push("Reports or analytics view");
  }

  if (requirements.includes("integrations")) {
    features.push("External integrations and automation touchpoints");
  }

  if (requirements.includes("notifications")) {
    features.push("Email confirmations and operational notifications");
  }

  if (requirements.includes("calendar")) {
    features.push("Calendar and scheduling support");
    pages.push("Calendar or scheduling view");
  }

  if (requirements.includes("auth")) {
    features.push("Authentication and role-based access");
    pages.push("Authentication flow");
  }

  if (requirements.includes("cicd")) {
    stack.push("CI/CD pipeline");
  }
};

const getComplexity = (projectType, requirements) => {
  const score =
    requirements.length +
    (projectType === "ai" ? 2 : 0) +
    (projectType === "dashboard" ? 1 : 0) +
    (requirements.includes("payment") ? 1 : 0) +
    (requirements.includes("booking") ? 1 : 0) +
    (requirements.includes("admin") ? 1 : 0);

  if (score >= 7) {
    return "High";
  }

  if (score >= 4) {
    return "Medium";
  }

  return "Focused";
};

const getOpenQuestions = (draft, requirements) => {
  const questions = [];

  if (!draft.audience) {
    questions.push("Who are the primary users or client profiles for the platform?");
  }

  if (!draft.firstAction) {
    questions.push("What is the first thing a user should be able to do when they land on the product?");
  }

  if (requirements.includes("payment")) {
    questions.push("Which payment provider or billing model should the platform support?");
  }

  if (requirements.includes("multilingual")) {
    questions.push("Which languages should be included in the first release, and who will manage translations?");
  }

  if (requirements.includes("admin")) {
    questions.push("What level of control should the admin team have over users, content, or business operations?");
  }

  if (requirements.includes("chatbot")) {
    questions.push("Should the assistant answer from fixed content, live data, or a connected knowledge base?");
  }

  if (requirements.includes("cicd")) {
    questions.push("What hosting environment, release flow, and monitoring expectations should be part of the delivery?");
  }

  if (draft.timeline) {
    questions.push(`How should the scope be phased to fit the preferred timeline: ${draft.timeline.toLowerCase()}?`);
  }

  return unique(questions).slice(0, 5);
};

export const generateProjectBrief = (draft) => {
  const projectType = draft.projectType || "custom";
  const preset = projectTypePresets[projectType] || projectTypePresets.custom;
  const requirements = collectRequirements(draft);
  const featureList = [...preset.features];
  const pageList = [...preset.pages];
  const stackList = [...preset.stack];

  addConditionalItems(requirements, featureList, pageList, stackList);

  const overview = sentence(
    `${preset.label} designed to ${preset.goal}. The current idea suggests a product where users can ${
      draft.firstAction || "quickly understand the offer and move into the core workflow"
    }`,
    `${preset.label} designed to ${preset.goal}.`
  );

  const businessGoal = sentence(
    draft.rawIdea
      ? `The raw project idea points toward a solution that should ${preset.goal}`
      : `This project should ${preset.goal}`,
    `This project should ${preset.goal}.`
  );

  const targetUsers = sentence(
    draft.audience || "Primary users will be the client's target audience together with the internal team that manages the platform.",
    "Primary users will be the client's target audience together with the internal team that manages the platform."
  );

  const adminBackoffice = requirements.includes("admin") ? preset.admin : "An advanced admin dashboard can be added later if internal content, users, orders, or operations need direct management.";
  const aiAutomation = requirements.includes("chatbot") || projectType === "ai" ? preset.ai : "AI is optional here, but it could still add value through lead qualification, FAQ guidance, smart recommendations, or operational automation.";
  const deployment = sentence(
    requirements.includes("cicd")
      ? preset.deployment
      : "A clean deployment flow should still include environment setup, version control, and a reliable production release process even for the first version.",
    preset.deployment
  );

  return {
    projectType: preset.label,
    requirements,
    overview,
    businessGoal,
    targetUsers,
    coreFeatures: unique(featureList),
    pagesModules: unique(pageList),
    adminBackoffice: sentence(adminBackoffice, preset.admin),
    aiAutomation: sentence(aiAutomation, preset.ai),
    suggestedStack: unique(stackList),
    deployment,
    complexity: getComplexity(projectType, requirements),
    openQuestions: getOpenQuestions(draft, requirements),
    requirementSummary: requirementList(requirements),
    rawIdeaLabel: titleCase(projectType)
  };
};
