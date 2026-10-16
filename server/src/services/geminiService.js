const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export const aiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

const fail = (message, status = 502) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const parseJson = (text) => {
  const clean = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json");
  return JSON.parse(clean.slice(start, end + 1));
};

// Gemini ko system prompt + messages bhejo, JSON object wapas lo
export const askGemini = async ({ system, contents, temperature = 0.7 }) => {
  if (!aiConfigured()) {
    throw fail("AI is not set up yet. Add GEMINI_API_KEY on the server.", 503);
  }

  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

  let res;
  try {
    res = await fetch(`${BASE}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    });
  } catch {
    throw fail("Could not connect to the AI. Please try again later.");
  }

  if (!res.ok) {
    const body = await res.text();
    console.error("Gemini error:", res.status, body.slice(0, 600));

    if (res.status === 400 && /api key/i.test(body)) {
      throw fail("GEMINI_API_KEY is invalid. Check server/.env.");
    }
    if (res.status === 401 || res.status === 403) {
      throw fail("The AI key has no permission or is invalid.");
    }
    if (res.status === 404) {
      throw fail(`AI model "${model}" not found. Change GEMINI_MODEL in .env.`);
    }
    if (res.status === 429) {
      throw fail("The AI free limit has been reached. Please try again later.", 429);
    }
    if (res.status >= 500) {
      throw fail("The AI is busy right now. Please try again.");
    }
    throw fail(`AI error (${res.status}). Check the backend terminal.`);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .filter((p) => !p.thought)
    .map((p) => p.text || "")
    .join("");

  if (!text) {
    throw fail(
      data.promptFeedback?.blockReason
        ? "The AI blocked this input."
        : "The AI returned an empty answer. Please try again."
    );
  }

  try {
    return parseJson(text);
  } catch {
    throw fail("Could not understand the AI response. Please try again.");
  }
};