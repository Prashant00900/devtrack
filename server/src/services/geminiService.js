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
    throw fail("AI abhi set nahi hai. Server par GEMINI_API_KEY daalo.", 503);
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
    throw fail("AI se connect nahi ho paya. Thodi der baad try karo.");
  }

  if (!res.ok) {
    const body = await res.text();
    console.error("Gemini error:", res.status, body.slice(0, 600));

    if (res.status === 400 && /api key/i.test(body)) {
      throw fail("GEMINI_API_KEY galat hai. server/.env check karo.");
    }
    if (res.status === 401 || res.status === 403) {
      throw fail("AI key ko permission nahi hai ya galat hai.");
    }
    if (res.status === 404) {
      throw fail(`AI model "${model}" nahi mila. .env mein GEMINI_MODEL badlo.`);
    }
    if (res.status === 429) {
      throw fail("AI ki free limit ho gayi. Thodi der baad try karo.", 429);
    }
    if (res.status >= 500) {
      throw fail("AI abhi busy hai. Dobara try karo.");
    }
    throw fail(`AI error (${res.status}). Backend terminal dekho.`);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .filter((p) => !p.thought)
    .map((p) => p.text || "")
    .join("");

  if (!text) {
    throw fail(
      data.promptFeedback?.blockReason
        ? "AI ne is input ko block kar diya."
        : "AI ne khali jawab diya. Dobara try karo."
    );
  }

  try {
    return parseJson(text);
  } catch {
    throw fail("AI ka jawab samajh nahi aaya. Dobara try karo.");
  }
};