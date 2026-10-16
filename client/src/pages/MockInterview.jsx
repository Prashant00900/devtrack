import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

const SpeechRecognitionApi =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-5";

const scoreColor = (s) =>
  s >= 75 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400";
const barColor = (s) =>
  s >= 75 ? "bg-green-500" : s >= 50 ? "bg-yellow-500" : "bg-red-500";

const typeInfo = {
  hr: {
    title: "HR round",
    icon: "🤝",
    desc: "Tell me about yourself, strengths, teamwork, career goals and situational questions.",
  },
  technical: {
    title: "Technical round",
    icon: "💻",
    desc: "Basic questions on your own skills and projects, from easy to medium.",
  },
};

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{value}/100</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor(value)}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function BulletCard({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={cardClass}>
      <h2 className="font-semibold mb-3">{title}</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm text-slate-200">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MockInterview() {
  const [stage, setStage] = useState("setup");
  const [type, setType] = useState("hr");
  const [total, setTotal] = useState(5);
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [report, setReport] = useState(null);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const recRef = useRef(null);
  const baseRef = useRef("");

  const loadPast = async () => {
    try {
      const res = await api.get("/interview/history");
      setPast(res.data.sessions);
    } catch {
      setPast([]);
    }
  };

  useEffect(() => {
    loadPast();
    return () => {
      window.speechSynthesis?.cancel();
      recRef.current?.stop();
    };
  }, []);

  const speak = (text) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (stage === "interview" && autoSpeak && question) speak(question);
  }, [question, stage]);

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
    baseRef.current = answer ? `${answer.trim()} ` : "";

    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setAnswer((baseRef.current + text).trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const startInterview = async () => {
    setError("");
    setLoading(true);
    setLoadingText("Interviewer is getting ready...");
    try {
      const res = await api.post("/interview/next", { type, total, history: [] });
      setHistory([]);
      setAnswer("");
      setReport(null);
      setQuestion(res.data.question);
      setStage("interview");
    } catch (err) {
      setError(err.response?.data?.message || "Could not start the interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please type or speak your answer first. If you do not know, type 'I do not know'.");
      return;
    }

    stopListening();
    window.speechSynthesis?.cancel();
    setError("");

    const newHistory = [...history, { question, answer: answer.trim() }];
    const isLast = newHistory.length >= total;

    setLoading(true);
    setLoadingText(isLast ? "Preparing your report..." : "Next question...");

    try {
      if (isLast) {
        const res = await api.post("/interview/report", { type, history: newHistory });
        setReport(res.data.report);
        setHistory(newHistory);
        setStage("report");
        loadPast();
      } else {
        const res = await api.post("/interview/next", {
          type,
          total,
          history: newHistory,
        });
        setHistory(newHistory);
        setQuestion(res.data.question);
        setAnswer("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const quit = () => {
    if (!window.confirm("Leave the interview now? No report will be created.")) return;
    stopListening();
    window.speechSynthesis?.cancel();
    setStage("setup");
    setHistory([]);
    setQuestion("");
    setAnswer("");
    setError("");
  };

  const errorBox = error && (
    <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-sm">
      {error}
    </p>
  );

  // ---------- Setup ----------
  if (stage === "setup") {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Mock Interview</h1>
          <p className="text-slate-400 mt-1">
            Practice like a real placement interview. The AI asks, you answer, and you get a report on what to improve.
          </p>
        </div>

        {errorBox}

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {Object.entries(typeInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`text-left rounded-2xl border p-5 transition ${
                type === key
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-800 bg-slate-900 hover:border-slate-600"
              }`}
            >
              <p className="text-2xl">{info.icon}</p>
              <p className="font-semibold mt-2">{info.title}</p>
              <p className="text-sm text-slate-400 mt-1">{info.desc}</p>
            </button>
          ))}
        </div>

        <div className={`${cardClass} mb-6`}>
          <p className="font-semibold mb-3">Number of questions</p>
          <div className="flex gap-2">
            {[5, 8].map((n) => (
              <button
                key={n}
                onClick={() => setTotal(n)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  total === n
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {n} questions
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Voice answers work in Chrome or Edge. Your answers are sent to the AI service, so do not share personal or sensitive details.
          </p>
        </div>

        <button
          onClick={startInterview}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-semibold text-lg disabled:opacity-50 transition"
        >
          {loading ? loadingText : "Start interview →"}
        </button>

        {past.length > 0 && (
          <div className="mt-10">
            <h2 className="font-semibold mb-3">Your recent interviews</h2>
            <div className="space-y-2">
              {past.map((s) => (
                <div
                  key={s._id}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {typeInfo[s.type]?.title} · {s.roleTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(s.createdAt).toLocaleString()} · {s.questionCount} questions
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${scoreColor(s.overallScore)}`}>
                    {s.overallScore}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Interview ----------
  if (stage === "interview") {
    const number = history.length + 1;

    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400">{typeInfo[type].title}</p>
            <p className="font-semibold">
              Question {number} of {total}
            </p>
          </div>
          <button onClick={quit} className="text-sm text-slate-400 hover:text-red-400">
            Quit
          </button>
        </div>

        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((number - 1) / total) * 100}%` }}
          />
        </div>

        {errorBox}

        <div className={`${cardClass} mb-4`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl">
              👩‍💼
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-1">Sarah · Interviewer</p>
              <p className="text-lg leading-relaxed">{question}</p>
            </div>
            <button
              onClick={() => speak(question)}
              title="Listen again"
              className="bg-slate-800 hover:bg-slate-700 w-10 h-10 rounded-lg shrink-0"
            >
              🔊
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            placeholder="Type your answer here, or press the mic and speak..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none text-sm"
          />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {SpeechRecognitionApi && (
              <button
                onClick={listening ? stopListening : startListening}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  listening
                    ? "bg-red-600 hover:bg-red-500 animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {listening ? "⏹ Stop listening" : "🎤 Speak"}
              </button>
            )}

            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="accent-blue-500"
              />
              Read questions aloud
            </label>

            <button
              onClick={submitAnswer}
              disabled={loading}
              className="ml-auto bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition"
            >
              {loading
                ? loadingText
                : number >= total
                ? "Submit and get report"
                : "Submit answer →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Report ----------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interview report</h1>
        <p className="text-slate-400 mt-1">
          {typeInfo[type].title} · {history.length} questions
        </p>
      </div>

      <div className={`${cardClass} flex flex-col md:flex-row md:items-center gap-6`}>
        <div className="text-center md:text-left">
          <p className="text-sm text-slate-400">Overall score</p>
          <p className={`text-6xl font-bold mt-1 ${scoreColor(report.overallScore)}`}>
            {report.overallScore}
            <span className="text-2xl text-slate-500">/100</span>
          </p>
          <p className={`font-semibold mt-1 ${scoreColor(report.overallScore)}`}>
            {report.verdict}
          </p>
        </div>

        <div className="flex-1 space-y-3">
          <ScoreBar label="Communication" value={report.scores.communication} />
          <ScoreBar label="Content" value={report.scores.content} />
          <ScoreBar label="Structure" value={report.scores.structure} />
          <ScoreBar label="Confidence" value={report.scores.confidence} />
        </div>
      </div>

      {report.summary && (
        <div className={cardClass}>
          <h2 className="font-semibold mb-2">Summary</h2>
          <p className="text-slate-200 text-sm leading-relaxed">{report.summary}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <BulletCard title="💪 Strengths" items={report.strengths} />
        <BulletCard title="⚠️ What you are lacking" items={report.weaknesses} />
      </div>

      <BulletCard title="🎯 Work on this next" items={report.workOn} />

      {report.englishNotes.length > 0 && (
        <div className={cardClass}>
          <h2 className="font-semibold mb-3">🗣️ English fixes</h2>
          <div className="space-y-3">
            {report.englishNotes.map((n, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm">
                <p className="text-red-300 line-through">{n.original}</p>
                <p className="text-green-300 mt-1">{n.better}</p>
                {n.why && <p className="text-slate-400 mt-1">{n.why}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h2 className="font-semibold mb-3">Question by question</h2>
        <div className="space-y-3">
          {report.perQuestion.map((p, i) => (
            <details
              key={i}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3"
            >
              <summary className="cursor-pointer text-sm font-medium">
                Q{i + 1}. {p.question}
              </summary>
              <div className="mt-3 space-y-3 text-sm">
                {p.yourAnswerSummary && (
                  <p>
                    <span className="text-slate-400">Your answer: </span>
                    {p.yourAnswerSummary}
                  </p>
                )}
                {p.feedback && (
                  <p>
                    <span className="text-slate-400">Feedback: </span>
                    {p.feedback}
                  </p>
                )}
                {p.betterAnswer && (
                  <p className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-100">
                    <span className="text-green-300 font-medium">A better answer: </span>
                    {p.betterAnswer}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setStage("setup");
            setHistory([]);
            setQuestion("");
            setAnswer("");
          }}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold transition"
        >
          Practise again
        </button>
      </div>
    </div>
  );
}

export default MockInterview;