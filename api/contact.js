import mongoose from "mongoose";
import nodemailer from "nodemailer";

const env = (key, fallback = "") => (process.env[key] || fallback).trim();
const mongoUri = env("MONGODB_URI");
const contactToEmail = env("CONTACT_TO_EMAIL", "amed14170@gmail.com");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    company: { type: String, trim: true, maxlength: 160 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    source: { type: String, default: "portfolio-vercel" }
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#061017;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#061017;padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #143140;">
            <tr>
              <td style="background:#0b1d27;padding:32px;">
                <p style="margin:0 0 12px;color:#45e4c8;font-size:12px;font-weight:700;text-transform:uppercase;">Portfolio Contact</p>
                <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.16;">New project request</h1>
                <p style="margin:14px 0 0;color:#c6d7de;font-size:15px;line-height:1.7;">A visitor sent a message from your freelance portfolio.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;background:#ffffff;color:#10202a;">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#007f72;text-decoration:none;">${safeEmail}</a></p>
                <p><strong>Company:</strong> ${safeCompany}</p>
                <p><strong>Budget:</strong> ${safeBudget}</p>
                <div style="border:1px solid #d9e4e8;border-radius:8px;background:#f6fafb;padding:20px;margin:22px 0;">
                  <p style="margin:0 0 10px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Message</p>
                  <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeMessage}</p>
                </div>
                <a href="mailto:${safeEmail}" style="display:inline-block;background:#007f72;color:#ffffff;text-decoration:none;border-radius:8px;padding:13px 18px;font-size:15px;font-weight:700;">Reply to client</a>
              </td>
            </tr>
            <tr>
              <td style="background:#eef5f6;padding:18px 32px;color:#607684;font-size:13px;line-height:1.6;">
                Sent from Amine portfolio contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { name, email, company, budget, message } = parseBody(req.body);

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    let contact = null;
    let delivered = false;
    const errors = [];

    if (mongoUri) {
      try {
        await connectMongo();
        contact = await Contact.create({ name, email, company, budget, message });
      } catch (error) {
        console.error("MongoDB save failed", error);
        errors.push("mongodb");
      }
    }

    const mailer = createMailer();

    if (mailer) {
      try {
        await mailer.sendMail({
          from: `"Portfolio Contact" <${env("SMTP_USER")}>`,
          replyTo: email,
          to: contactToEmail,
          subject: `New portfolio message from ${name}`,
          text: formatContactText({ name, email, company, budget, message }),
          html: formatContactHtml({ name, email, company, budget, message })
        });
        delivered = true;
      } catch (error) {
        console.error("SMTP delivery failed", error);
        errors.push("smtp");
      }
    }

    if (!contact && !delivered) {
      return res.status(500).json({ error: "Contact service failed.", services: errors });
    }

    return res.status(201).json({ ok: true, id: contact?._id || null, delivered });
  } catch (error) {
    console.error("Contact submission failed", error);
    return res.status(500).json({ error: "Unable to send your message right now." });
  }
}
