import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/amine_portfolio";
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

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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

    const contact = await Contact.create({ name, email, company, budget, message });
    res.status(201).json({ ok: true, id: contact._id });
  } catch (error) {
    console.error("Contact submission failed", error);
    res.status(500).json({ error: "Unable to send your message right now." });
  }
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

start();
