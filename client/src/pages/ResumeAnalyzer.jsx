import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-5";

const youtubeUrl = (name) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} full course`)}`;

const scoreColor = (score) =>
  score >= 75 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";

const barColor = (ratio) =>
  ratio >= 0.7 ? "bg-green-500" : ratio >= 0.4 ? "bg-yellow-500" : "bg-red-500";

function ResumeAnalyzer() {
  const [mode, setMode] = useState("pdf");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (mode === "pdf" && !file) {
      setError("Pehle PDF file choose karo");
      return;
    }
    if (mode === "text" && text.trim().length < 80) {
      setError("Resume ka text paste karo (kam se kam 80 characters)");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (mode === "pdf") {
        const formData = new FormData();
        formData.append("resume", file);
        res = await api.post("/resume/analyze", formData);
      } else {
        res = await api.post("/resume/analyze", { text });
      }
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis nahi hui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resume Analyzer</h1>
        <p className="text-slate-400 mt-1">
          Get an ATS-style score, see which skills your resume is missing for your target role, and learn them.
        </p>
      </div>

      <div className={`${cardClass} mb-6`}>
        <div className="flex gap-2 mb-4">
          {[
            ["pdf", "Upload PDF"],
            ["text", "Paste text"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                mode === key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "pdf" ? (
          <div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700"
            />
            <p className="text-xs text-slate-500 mt-2">PDF only, up to 2MB.</p>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste your resume text here..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none text-sm"
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Analyzing..." : "Analyze resume"}
          </button>
          <p className="text-xs text-slate-500">
            Your resume is analysed once and not stored.
          </p>
        </div>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-6">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-6">
          <div className={`${cardClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <p className="text-sm text-slate-400">
                ATS score {result.role ? `for ${result.role.title}` : ""}
              </p>
              <p className={`text-6xl font-bold mt-1 ${scoreColor(result.score)}`}>
                {result.score}
                <span className="text-2xl text-slate-500">/100</span>
              </p>
              <p className={`font-semibold mt-1 ${scoreColor(result.score)}`}>
                {result.verdict}
              </p>
            </div>

            <div className="flex-1 sm:max-w-md space-y-3">
              {result.breakdown.map((b) => (
                <div key={b.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{b.label}</span>
                    <span className="text-slate-400">
                      {b.points}/{b.max}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor(b.points / b.max)}`}
                      style={{ width: `${(b.points / b.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!result.role && (
            <p className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-3 rounded-lg text-sm">
              Role-wise missing skills dekhne ke liye pehle{" "}
              <Link to="/target-role" className="underline">
                target role select karo
              </Link>
              .
            </p>
          )}

          {result.role && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className={cardClass}>
                <h2 className="font-semibold mb-3">
                  ✅ Found in resume ({result.foundRequired.length})
                </h2>
                {result.foundRequired.length === 0 ? (
                  <p className="text-sm text-slate-400">Koi required skill nahi mili.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.foundRequired.map((s) => (
                      <span
                        key={s.skillId}
                        className="bg-green-500/15 text-green-300 text-sm px-3 py-1 rounded-full"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={cardClass}>
                <h2 className="font-semibold mb-3">
                  ❌ Missing for {result.role.title} ({result.missingRequired.length})
                </h2>
                {result.missingRequired.length === 0 ? (
                  <p className="text-sm text-slate-400">Saari required skills resume mein hain 🎉</p>
                ) : (
                  <div className="space-y-3">
                    {result.missingRequired.map((m) => (
                      <div
                        key={m.skillId}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm">{m.name}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              m.importance === "must"
                                ? "bg-red-500/15 text-red-300"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {m.importance === "must" ? "Must have" : "Good to have"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {m.resources.map((r) => (
                            <a
                              key={r.url}
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition"
                            >
                              {r.title} ↗
                            </a>
                          ))}
                          <a
                            href={youtubeUrl(m.name)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 px-2 py-1 rounded-lg transition"
                          >
                            ▶ YouTube
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={cardClass}>
            <h2 className="font-semibold mb-3">💡 How to improve</h2>
            {result.tips.length === 0 ? (
              <p className="text-sm text-slate-400">Resume achha dikh raha hai. Koi bada sudhaar nahi mila.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-200">
                {result.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className={cardClass}>
              <h2 className="font-semibold mb-3">All skills we detected</h2>
              {result.detectedSkills.length === 0 ? (
                <p className="text-sm text-slate-400">Koi known skill nahi mili.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.detectedSkills.map((s) => (
                    <span
                      key={s}
                      className="bg-slate-800 text-slate-200 text-sm px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={cardClass}>
              <h2 className="font-semibold mb-3">Resume stats</h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  ["Words", result.stats.words],
                  ["Action verbs", result.stats.actionVerbs],
                  ["Numbers", result.stats.metrics],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-950 border border-slate-800 rounded-lg py-3">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(result.sections).map(([name, found]) => (
                  <span
                    key={name}
                    className={`text-xs px-2 py-1 rounded-full ${
                      found
                        ? "bg-green-500/15 text-green-300"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {found ? "✓" : "✗"} {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            This is a keyword and structure check, not the exact score a company's ATS will give. Use it as a guide, and only list skills you really know.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;