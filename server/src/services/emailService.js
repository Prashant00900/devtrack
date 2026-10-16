const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export const emailConfigured = () =>
  Boolean(process.env.BREVO_API_KEY && process.env.MAIL_FROM_EMAIL);

// Brevo ki HTTPS API se email bhejo (Render free par SMTP block hota hai)
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!emailConfigured()) {
    throw new Error("Email service is not configured");
  }

  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.MAIL_FROM_NAME || "DevTrack",
        email: process.env.MAIL_FROM_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo error ${res.status}: ${body.slice(0, 300)}`);
  }
};