import { generateAssistantBrief } from "../lib/assistantGeneration.js";

const env = (key, fallback = "") => (process.env[key] || fallback).trim();

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
    const payload = parseBody(req.body);
    const draft = payload.draft || {};
    const language = payload.language || "en";

    if (!draft.rawIdea || !String(draft.rawIdea).trim()) {
      return res.status(400).json({ error: "Project idea is required." });
    }

    const result = await generateAssistantBrief({
      draft,
      language,
      apiKey: env("OPENAI_API_KEY"),
      model: env("OPENAI_MODEL", "gpt-5-mini")
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
}
