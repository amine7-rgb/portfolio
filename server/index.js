import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { formatAssistantBriefHtml, formatAssistantBriefText } from "../lib/assistantBrief.js";
import { generateAssistantBrief } from "../lib/assistantGeneration.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/amine_portfolio";
const contactToEmail = process.env.CONTACT_TO_EMAIL || "amed14170@gmail.com";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "1mb" }));

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    company: { type: String, trim: true, maxlength: 160 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    source: { type: String, default: "portfolio" }
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

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
    source: { type: String, default: "assistant-local" }
  },
  { timestamps: true }
);

const AssistantBrief = mongoose.models.AssistantBrief || mongoose.model("AssistantBrief", assistantBriefSchema);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isMongoConnected = () => mongoose.connection.readyState === 1;
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const createMailer = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const formatContactText = ({ name, email, company, budget, message }) => `
New portfolio contact request

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Budget: ${budget || "Not selected"}

Message:
${message}
`;

const formatContactHtml = ({ name, email, company, budget, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || "Not provided");
  const safeBudget = escapeHtml(budget || "Not selected");
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const preview = `New portfolio request from ${safeName}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${preview}</title>
  </head>
  <body style="margin:0;background:#061017;color:#10202a;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#061017;padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #143140;">
            <tr>
              <td style="background:#0b1d27;padding:32px 32px 26px;">
                <p style="margin:0 0 12px;color:#45e4c8;font-size:12px;font-weight:700;text-transform:uppercase;">Portfolio Contact</p>
                <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.16;">New project request</h1>
                <p style="margin:14px 0 0;color:#c6d7de;font-size:15px;line-height:1.7;">A visitor sent a message from your freelance portfolio.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:0 0 16px;width:50%;vertical-align:top;">
                      <p style="margin:0 0 6px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Name</p>
                      <p style="margin:0;color:#10202a;font-size:17px;font-weight:700;">${safeName}</p>
                    </td>
                    <td style="padding:0 0 16px;width:50%;vertical-align:top;">
                      <p style="margin:0 0 6px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Email</p>
                      <p style="margin:0;color:#10202a;font-size:17px;font-weight:700;"><a href="mailto:${safeEmail}" style="color:#007f72;text-decoration:none;">${safeEmail}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 16px;width:50%;vertical-align:top;">
                      <p style="margin:0 0 6px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Company</p>
                      <p style="margin:0;color:#10202a;font-size:16px;">${safeCompany}</p>
                    </td>
                    <td style="padding:0 0 16px;width:50%;vertical-align:top;">
                      <p style="margin:0 0 6px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Budget</p>
                      <p style="margin:0;color:#10202a;font-size:16px;">${safeBudget}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 32px 28px;background:#ffffff;">
                <div style="border:1px solid #d9e4e8;border-radius:8px;background:#f6fafb;padding:22px;">
                  <p style="margin:0 0 10px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Message</p>
                  <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeMessage}</p>
                </div>
                <div style="padding-top:24px;">
                  <a href="mailto:${safeEmail}" style="display:inline-block;background:#007f72;color:#ffffff;text-decoration:none;border-radius:8px;padding:13px 18px;font-size:15px;font-weight:700;">Reply to client</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#eef5f6;padding:18px 32px;color:#607684;font-size:13px;line-height:1.6;">
                Sent from Amine portfolio contact form. Replying to this email will contact ${safeName}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "amine-portfolio-api" });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, company, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    let contact = null;

    if (isMongoConnected()) {
      contact = await Contact.create({ name, email, company, budget, message });
    } else {
      console.warn("MongoDB is not connected. Message was not saved to the database.");
    }

    const mailer = createMailer();

    if (mailer) {
      await mailer.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: contactToEmail,
        subject: `New portfolio message from ${name}`,
        text: formatContactText({ name, email, company, budget, message }),
        html: formatContactHtml({ name, email, company, budget, message })
      });
    } else {
      console.warn("SMTP is not configured. No email was sent.");
    }

    if (!contact && !mailer) {
      return res.status(503).json({
        error: "Contact service is not configured. Set MongoDB or SMTP settings in .env."
      });
    }

    res.status(201).json({ ok: true, id: contact?._id || null });
  } catch (error) {
    console.error("Contact submission failed", error);
    res.status(500).json({ error: "Unable to send your message right now." });
  }
});

app.post("/api/assistant-generate", async (req, res) => {
  try {
    const payload = req.body || {};
    const draft = payload.draft || {};
    const language = payload.language || "en";

    if (!draft.rawIdea || !String(draft.rawIdea).trim()) {
      return res.status(400).json({ error: "Project idea is required." });
    }

    const result = await generateAssistantBrief({
      draft,
      language,
      apiKey: (process.env.OPENAI_API_KEY || "").trim(),
      model: (process.env.OPENAI_MODEL || "gpt-5-mini").trim()
    });

    return res.status(200).json({
      ok: true,
      brief: result.brief,
      mode: result.mode,
      reason: result.reason,
      model: result.model
    });
  } catch (error) {
    console.error("Assistant brief generation failed", error);
    return res.status(500).json({ error: "Unable to generate the project brief right now." });
  }
});

app.post("/api/assistant-brief", async (req, res) => {
  try {
    const payload = req.body || {};
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

    if (isMongoConnected()) {
      record = await AssistantBrief.create({
        language: payload.language || "en",
        projectType: draft.projectType,
        rawIdea: draft.rawIdea,
        audience: draft.audience,
        firstAction: draft.firstAction,
        requirements: draft.requirements || [],
        timeline: draft.timeline,
        brief,
        lead: normalizedLead,
        source: payload.source || "assistant-local"
      });
    } else {
      console.warn("MongoDB is not connected. Assistant brief was not saved to the database.");
    }

    const mailer = createMailer();

    if (mailer) {
      await mailer.sendMail({
        from: `"Idea to Brief Assistant" <${process.env.SMTP_USER}>`,
        replyTo: normalizedLead.email,
        to: contactToEmail,
        subject: `New AI project brief from ${normalizedLead.name}`,
        text: formatAssistantBriefText({ lead: normalizedLead, draft: { ...draft, language: payload.language }, brief }),
        html: formatAssistantBriefHtml({ lead: normalizedLead, draft: { ...draft, language: payload.language }, brief })
      });
    } else {
      console.warn("SMTP is not configured. No assistant brief email was sent.");
    }

    if (!record && !mailer) {
      return res.status(503).json({
        error: "Assistant brief service is not configured. Set MongoDB or SMTP settings in .env."
      });
    }

    return res.status(201).json({ ok: true, id: record?._id || null });
  } catch (error) {
    console.error("Assistant brief submission failed", error);
    return res.status(500).json({ error: "Unable to send the generated brief right now." });
  }
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const start = () => {
  mongoose
    .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.warn(`MongoDB connection skipped: ${error.message}`);
    });

  app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on http://localhost:${port}`);
  });
};

start();
