import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ListCard({ title, items, ordered }) {
  if (!items || items.length === 0) return null;

  const ListTag = ordered ? "ol" : "ul";

  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ListTag
        className={`space-y-2 text-slate-200 pl-5 ${
          ordered ? "list-decimal" : "list-disc"
        }`}
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
    </div>
  );
}

function AiAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/ai/analysis");
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate the analysis");
    } finally {
      setLoading(false);
    }
  };

  const a = result?.analysis;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">AI Career Analysis</h1>
      <p className="text-slate-400 mb-6">
        Personalised career advice based on your skills, projects and target role.
      </p>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded font-semibold disabled:opacity-50 mb-6"
      >
        {loading ? "Analyzing..." : result ? "Generate again" : "Generate analysis"}
      </button>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">
          <p>{error}</p>
          {error.includes("Target Role") && (
            <Link to="/target-role" className="text-blue-400 underline">
              Select a Target Role →
            </Link>
          )}
        </div>
      )}

      {a && (
        <div>
          <p className="text-xs text-slate-400 mb-3">
            {result.source === "ai"
              ? "🤖 AI generated"
              : "📋 Rule-based analysis (add an AI key to get AI-written advice)"}
          </p>

          <div className="bg-slate-800 p-4 rounded-xl mb-4">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p className="text-slate-200">{a.summary}</p>
          </div>

          <ListCard title="Strengths 💪" items={a.strengths} />
          <ListCard title="Improvements ⚠️" items={a.improvements} />
          <ListCard title="Next steps 🚀" items={a.nextSteps} ordered />
          <ListCard title="Project ideas 💡" items={a.projectIdeas} />
          <ListCard title="Interview tips 🎯" items={a.interviewTips} />
        </div>
      )}
    </div>
  );
}

export default AiAnalysis;