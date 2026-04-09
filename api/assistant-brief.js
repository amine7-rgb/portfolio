import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { formatAssistantBriefHtml, formatAssistantBriefText } from "../lib/assistantBrief.js";

const env = (key, fallback = "") => (process.env[key] || fallback).trim();
const mongoUri = env("MONGODB_URI");
const contactToEmail = env("CONTACT_TO_EMAIL", "amed14170@gmail.com");

const assistantBriefSchema = new mongoose.Schema(
  {
    language: { type: String, trim: true, maxlength: 12, default: "en" },
    projectType: { type: String, trim: true, maxlength: 80 },
    rawIdea: { type: String, required: true, trim: true, maxlength: 4000 },
    audience: { type: String, trim: true, maxlength: 600 },
    firstAction: { type: String, trim: true, maxlength: 600 },
    requirements: [{ type: String, trim: true, maxlength: 120 }],
    timeline: { type: String, trim: true, maxlength: 120 },
    brief: {
      projectType: { type: String, trim: true, maxlength: 120 },
      overview: { type: String, trim: true, maxlength: 2000 },
      businessGoal: { type: String, trim: true, maxlength: 2000 },
      targetUsers: { type: String, trim: true, maxlength: 2000 },
      coreFeatures: [{ type: String, trim: true, maxlength: 240 }],
      pagesModules: [{ type: String, trim: true, maxlength: 240 }],
      adminBackoffice: { type: String, trim: true, maxlength: 2000 },
      aiAutomation: { type: String, trim: true, maxlength: 2000 },
      suggestedStack: [{ type: String, trim: true, maxlength: 180 }],
      deployment: { type: String, trim: true, maxlength: 2000 },
      complexity: { type: String, trim: true, maxlength: 80 },
      openQuestions: [{ type: String, trim: true, maxlength: 320 }],
      requirementSummary: [{ type: String, trim: true, maxlength: 240 }]
    },
    lead: {
      name: { type: String, required: true, trim: true, maxlength: 120 },
      email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
      company: { type: String, trim: true, maxlength: 180 },
      budget: { type: String, trim: true, maxlength: 120 },
      briefParagraph: { type: String, trim: true, maxlength: 6000 },
      notes: { type: String, trim: true, maxlength: 3000 }
    },
    source: { type: String, default: "assistant-vercel" }
  },
  { timestamps: true }
);

const AssistantBrief = mongoose.models.AssistantBrief || mongoose.model("AssistantBrief", assistantBriefSchema);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseBody = (body) => {
  if (!body || typeof body === "object") {
    return body || {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const connectMongo = async () => {
  if (!mongoUri || mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
};

const createMailer = () => {
  const SMTP_HOST = env("SMTP_HOST");
  const SMTP_PORT = env("SMTP_PORT");
  const SMTP_SECURE = env("SMTP_SECURE");
  const SMTP_USER = env("SMTP_USER");
  const SMTP_PASS = env("SMTP_PASS");

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const payload = parseBody(req.body);
    const draft = payload.draft || {};
    const lead = payload.lead || {};
    const brief = payload.brief || {};
    const normalizedLead = {
      ...lead,
      briefParagraph: String(lead.briefParagraph || payload.finalBriefParagraph || "").trim()
    };

    if (!draft.rawIdea || !normalizedLead.name || !normalizedLead.email || !brief.overview) {
      return res.status(400).json({ error: "Raw idea, lead information, and generated brief are required." });
    }

    if (!isEmail(normalizedLead.email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    let record = null;
    let delivered = false;
    const errors = [];

    if (mongoUri) {
      try {
        await connectMongo();
        record = await AssistantBrief.create({
          language: payload.language || draft.language || "en",
          projectType: draft.projectType,
          rawIdea: draft.rawIdea,
          audience: draft.audience,
          firstAction: draft.firstAction,
          requirements: draft.requirements || [],
          timeline: draft.timeline,
          brief,
          lead: normalizedLead,
          source: payload.source || "assistant-vercel"
        });
      } catch (error) {
        console.error("Assistant brief save failed", error);
        errors.push("mongodb");
      }
    }

    const mailer = createMailer();

    if (mailer) {
      try {
        await mailer.sendMail({
          from: `"Idea to Brief Assistant" <${env("SMTP_USER")}>`,
          replyTo: normalizedLead.email,
          to: contactToEmail,
          subject: `New AI project brief from ${normalizedLead.name}`,
          text: formatAssistantBriefText({ lead: normalizedLead, draft: { ...draft, language: payload.language }, brief }),
          html: formatAssistantBriefHtml({ lead: normalizedLead, draft: { ...draft, language: payload.language }, brief })
        });
        delivered = true;
      } catch (error) {
        console.error("Assistant brief email failed", error);
        errors.push("smtp");
      }
    }

    if (!record && !delivered) {
      return res.status(500).json({ error: "Assistant brief service failed.", services: errors });
    }

    return res.status(201).json({ ok: true, id: record?._id || null, delivered });
  } catch (error) {
    console.error("Assistant brief submission failed", error);
    return res.status(500).json({ error: "Unable to send the generated brief right now." });
  }
}
