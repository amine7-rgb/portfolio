export const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const joinLines = (items = []) => items.filter(Boolean).join("\n");
const joinHtmlList = (items = []) => items.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
const safeText = (value, fallback = "Not provided") => String(value || "").trim() || fallback;

export const formatAssistantBriefText = ({ lead = {}, draft = {}, brief = {} }) => `
New AI project brief

Lead information
Name: ${safeText(lead.name)}
Email: ${safeText(lead.email)}
Company: ${safeText(lead.company)}
Budget: ${safeText(lead.budget, "Not selected")}
Timeline: ${safeText(draft.timeline || lead.timeline, "Not selected")}

Project direction
Project type: ${safeText(brief.projectType || draft.projectType)}
Language: ${safeText(draft.language || "en")}

Raw idea
${safeText(draft.rawIdea)}

Clarifications
Audience: ${safeText(draft.audience)}
First important action: ${safeText(draft.firstAction)}
Requirements: ${(brief.requirementSummary || []).join(", ") || "None selected"}

Generated brief
Overview:
${safeText(brief.overview)}

Business goal:
${safeText(brief.businessGoal)}

Target users:
${safeText(brief.targetUsers)}

Core features:
${joinLines((brief.coreFeatures || []).map((item) => `- ${item}`))}

Pages / modules:
${joinLines((brief.pagesModules || []).map((item) => `- ${item}`))}

Admin and back office:
${safeText(brief.adminBackoffice)}

AI and automation opportunities:
${safeText(brief.aiAutomation)}

Suggested stack:
${joinLines((brief.suggestedStack || []).map((item) => `- ${item}`))}

Deployment and CI/CD:
${safeText(brief.deployment)}

Complexity:
${safeText(brief.complexity)}

Questions to confirm:
${joinLines((brief.openQuestions || []).map((item) => `- ${item}`))}

Additional note:
${safeText(lead.notes)}
`;

export const formatAssistantBriefHtml = ({ lead = {}, draft = {}, brief = {} }) => {
  const safeName = escapeHtml(safeText(lead.name));
  const safeEmail = escapeHtml(safeText(lead.email));
  const safeCompany = escapeHtml(safeText(lead.company));
  const safeBudget = escapeHtml(safeText(lead.budget, "Not selected"));
  const safeTimeline = escapeHtml(safeText(draft.timeline || lead.timeline, "Not selected"));
  const safeType = escapeHtml(safeText(brief.projectType || draft.projectType));
  const safeIdea = escapeHtml(safeText(draft.rawIdea)).replaceAll("\n", "<br />");
  const safeAudience = escapeHtml(safeText(draft.audience));
  const safeFirstAction = escapeHtml(safeText(draft.firstAction));
  const safeAdmin = escapeHtml(safeText(brief.adminBackoffice)).replaceAll("\n", "<br />");
  const safeAi = escapeHtml(safeText(brief.aiAutomation)).replaceAll("\n", "<br />");
  const safeOverview = escapeHtml(safeText(brief.overview)).replaceAll("\n", "<br />");
  const safeGoal = escapeHtml(safeText(brief.businessGoal)).replaceAll("\n", "<br />");
  const safeUsers = escapeHtml(safeText(brief.targetUsers)).replaceAll("\n", "<br />");
  const safeDeployment = escapeHtml(safeText(brief.deployment)).replaceAll("\n", "<br />");
  const safeComplexity = escapeHtml(safeText(brief.complexity));
  const safeNotes = escapeHtml(safeText(lead.notes)).replaceAll("\n", "<br />");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New AI project brief</title>
  </head>
  <body style="margin:0;background:#061017;color:#10202a;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#061017;padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #143140;">
            <tr>
              <td style="background:#0b1d27;padding:32px 32px 26px;">
                <p style="margin:0 0 12px;color:#45e4c8;font-size:12px;font-weight:700;text-transform:uppercase;">Idea to Brief Assistant</p>
                <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.16;">New AI project brief</h1>
                <p style="margin:14px 0 0;color:#c6d7de;font-size:15px;line-height:1.7;">A visitor used the assistant to turn a rough idea into a structured project brief.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 12px;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:0 0 16px;width:50%;vertical-align:top;">
                      <p style="margin:0 0 6px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Client</p>
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
                      <p style="margin:0 0 6px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Budget / Timeline</p>
                      <p style="margin:0;color:#10202a;font-size:16px;">${safeBudget}<br />${safeTimeline}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 32px 10px;background:#ffffff;">
                <div style="border:1px solid #d9e4e8;border-radius:8px;background:#f6fafb;padding:20px;">
                  <p style="margin:0 0 10px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Raw idea</p>
                  <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeIdea}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 32px 4px;background:#ffffff;">
                <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;">
                  <div style="border:1px solid #d9e4e8;border-radius:8px;padding:16px;background:#ffffff;">
                    <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Project type</p>
                    <p style="margin:0;color:#10202a;font-size:16px;font-weight:700;">${safeType}</p>
                  </div>
                  <div style="border:1px solid #d9e4e8;border-radius:8px;padding:16px;background:#ffffff;">
                    <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Complexity</p>
                    <p style="margin:0;color:#10202a;font-size:16px;font-weight:700;">${safeComplexity}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 8px;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 14px;">
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Overview</p>
                      <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeOverview}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Business goal</p>
                      <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeGoal}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Target users</p>
                      <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeUsers}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Core features</p>
                      <ul style="margin:0;padding-left:18px;color:#10202a;font-size:15px;line-height:1.75;">${joinHtmlList(brief.coreFeatures)}</ul>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Pages / modules</p>
                      <ul style="margin:0;padding-left:18px;color:#10202a;font-size:15px;line-height:1.75;">${joinHtmlList(brief.pagesModules)}</ul>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Admin and back office</p>
                      <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeAdmin}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">AI and automation opportunities</p>
                      <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeAi}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 10px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Suggested stack</p>
                      <div>${(brief.suggestedStack || [])
                        .map(
                          (item) =>
                            `<span style="display:inline-block;margin:0 8px 8px 0;padding:8px 10px;border-radius:999px;border:1px solid #d9e4e8;background:#f6fafb;color:#10202a;font-size:13px;font-weight:700;">${escapeHtml(item)}</span>`
                        )
                        .join("")}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Deployment and CI/CD</p>
                      <p style="margin:0;color:#10202a;font-size:16px;line-height:1.75;">${safeDeployment}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;border:1px solid #d9e4e8;border-radius:8px;background:#ffffff;">
                      <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Questions to confirm</p>
                      <ul style="margin:0;padding-left:18px;color:#10202a;font-size:15px;line-height:1.75;">${joinHtmlList(brief.openQuestions)}</ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 28px;background:#ffffff;">
                <div style="border:1px solid #d9e4e8;border-radius:8px;background:#f6fafb;padding:20px;">
                  <p style="margin:0 0 8px;color:#607684;font-size:12px;font-weight:700;text-transform:uppercase;">Clarifications and note</p>
                  <p style="margin:0 0 10px;color:#10202a;font-size:15px;line-height:1.75;"><strong>Audience:</strong> ${safeAudience}</p>
                  <p style="margin:0 0 10px;color:#10202a;font-size:15px;line-height:1.75;"><strong>First user action:</strong> ${safeFirstAction}</p>
                  <p style="margin:0 0 10px;color:#10202a;font-size:15px;line-height:1.75;"><strong>Requirements:</strong> ${(brief.requirementSummary || []).map((item) => escapeHtml(item)).join(", ") || "None selected"}</p>
                  <p style="margin:0;color:#10202a;font-size:15px;line-height:1.75;"><strong>Additional note:</strong><br />${safeNotes}</p>
                </div>
                <div style="padding-top:20px;">
                  <a href="mailto:${safeEmail}" style="display:inline-block;background:#007f72;color:#ffffff;text-decoration:none;border-radius:8px;padding:13px 18px;font-size:15px;font-weight:700;">Reply to client</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#eef5f6;padding:18px 32px;color:#607684;font-size:13px;line-height:1.6;">
                Sent from the Idea to Brief Assistant on Amine portfolio.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
