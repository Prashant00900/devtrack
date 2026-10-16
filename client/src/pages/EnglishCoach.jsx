import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

const SpeechRecognitionApi =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const topics = [
  {
    key: "daily",
    label: "Daily conversation",
    greeting:
      "Hi! I'm Maya, your English coach. How was your day? Tell me in English. Mistakes are okay, I will help you fix them.",
  },
  {
    key: "intro",
    label: "Self introduction",
    greeting:
      "Hello! Let's practise your self introduction. Please introduce yourself like you would in a placement interview.",
  },
  {
    key: "hr",
    label: "HR answers",
    greeting: "Let's practise HR questions. First one: What are your strengths and weaknesses?",
  },
  {
    key: "project",
    label: "Explain your project",
    greeting:
      "Tell me about one project you built. What does it do, and which technologies did you use?",
  },
];

const speak = (text) => {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
};

const greetingFor = (key) => [
  { role: "assistant", text: topics.find((t) => t.key === key).greeting },
];

function Feedback({ feedback }) {
  if (!feedback) return null;
  const { corrections, improved, tip } = feedback;

  return (
    <div className="mt-2 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm space-y-2 max-w-[85%] ml-auto">
      {corrections.length === 0 ? (
        <p className="text-green-300">✅ Your English was correct!</p>
      ) : (
        <div className="space-y-2">
          {corrections.map((c, i) => (
            <div key={i}>
              <p>
                <span className="text-red-300 line-through">{c.original}</span>
                <span className="text-slate-500"> → </span>
                <span className="text-green-300">{c.corrected}</span>
              </p>
              {c.why && <p className="text-xs text-slate-400">{c.why}</p>}
            </div>
          ))}
        </div>
      )}

      {improved && (
        <p className="text-slate-300">
          <span className="text-blue-300 font-medium">Better way: </span>
          {improved}
        </p>
      )}
      {tip && <p className="text-xs text-yellow-200">💡 {tip}</p>}
    </div>
  );
}

function EnglishCoach() {
  const [topic, setTopic] = useState("daily");
  const [hinglish, setHinglish] = useState(true);
  const [messages, setMessages] = useState(greetingFor("daily"));
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const recRef = useRef(null);
  const baseRef = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
      recRef.current?.stop();
    },
    []
  );

  const changeTopic = (key) => {
    setTopic(key);
    setMessages(greetingFor(key));
    setInput("");
    setError("");
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const startListening = () => {
    if (!SpeechRecognitionApi) return;
    window.speechSynthesis?.cancel();

    const rec = new SpeechRecognitionApi();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    baseRef.current = input ? `${input.trim()} ` : "";

    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setInput((baseRef.current + text).trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    stopListening();
    setError("");

    const previous = messages;
    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("/english/chat", {
        topic,
        hinglish,
        messages: next.map((m) => ({ role: m.role, text: m.text })),
      });

      const { reply, corrections, improved, tip } = res.data;

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          feedback: { corrections, improved, tip },
        };
        return [...copy, { role: "assistant", text: reply }];
      });
    } catch (err) {
      setMessages(previous);
      setInput(text);
      setError(err.response?.data?.message || "Message was not sent, please try again");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">English Coach</h1>
        <p className="text-slate-400 mt-1">
          Chat with Maya. She replies, fixes your mistakes and shows a better way to say it. Hinglish is fine.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {topics.map((t) => (
          <button
            key={t.key}
            onClick={() => changeTopic(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              topic === t.key
                ? "bg-blue-600 text-white"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}

        <label className="ml-auto flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={hinglish}
            onChange={(e) => setHinglish(e.target.checked)}
            className="accent-blue-500"
          />
          Explain in Hinglish
        </label>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[28rem] overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === "assistant" ? (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm">
                  {m.text}
                </div>
                <button
                  onClick={() => speak(m.text)}
                  title="Listen"
                  className="text-slate-500 hover:text-white mt-2"
                >
                  🔊
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%] ml-auto w-fit">
                  {m.text}
                </div>
                <Feedback feedback={m.feedback} />
              </div>
            )}
          </div>
        ))}

        {sending && <p className="text-sm text-slate-400">Maya is typing...</p>}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mt-3 text-sm">
          {error}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        {SpeechRecognitionApi && (
          <button
            onClick={listening ? stopListening : startListening}
            className={`px-4 rounded-lg font-semibold transition ${
              listening
                ? "bg-red-600 hover:bg-red-500 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
            title="Speak"
          >
            {listening ? "⏹" : "🎤"}
          </button>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type in English or Hinglish..."
          className="flex-1 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
        />

        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 px-6 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Your messages are sent to the AI service. Do not share personal or sensitive details.
      </p>
    </div>
  );
}

export default EnglishCoach;