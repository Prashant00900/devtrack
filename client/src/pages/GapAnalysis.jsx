import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function SkillRow({ item, color }) {
  return (
    <div className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded">
      <div>
        <span className="font-medium">{item.name}</span>
        <span className="text-xs text-slate-400 ml-2">
          {item.importance === "must" ? "must have" : "good to have"}
        </span>
      </div>
      <span className={`text-sm font-semibold ${color}`}>
        {item.userLevel} / {item.minLevel}
      </span>
    </div>
  );
}

function Section({ title, items, color, emptyText }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-4">
      <h2 className="text-lg font-semibold mb-3">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-slate-400 text-sm">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <SkillRow key={item.skillId} item={item} color={color} />
          ))}
        </div>
      )}
    </div>
  );
}

function GapAnalysis() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analysis/gap")
      .then((res) => setReport(res.data.report))
      .catch((err) =>
        setError(err.response?.data?.message || "Analysis load nahi hui")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Skill Gap Analysis</h1>
        <p className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</p>
        <Link to="/target-role" className="text-blue-400 underline">
          Target Role select karo
        </Link>
      </div>
    );
  }

  const pct = report.matchPercentage;
  const barColor = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Skill Gap Analysis</h1>
      <p className="text-slate-400 mb-6">Target: {report.role.title}</p>

      <div className="bg-slate-800 p-5 rounded-xl mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-slate-300">Role match</span>
          <span className="text-4xl font-bold">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-slate-400 mt-3">
          {report.strong.length} strong · {report.weak.length} weak · {report.missing.length} missing
          (out of {report.totalRequired})
        </p>
      </div>

      <Section
        title="Strong skills ✅"
        items={report.strong}
        color="text-green-400"
        emptyText="Abhi koi skill required level tak nahi pahunchi."
      />
      <Section
        title="Weak skills ⚠️ (level badhao)"
        items={report.weak}
        color="text-yellow-400"
        emptyText="Koi weak skill nahi."
      />
      <Section
        title="Missing skills ❌ (seekhni hain)"
        items={report.missing}
        color="text-red-400"
        emptyText="Koi skill missing nahi. Great!"
      />

      <Link
        to="/roadmap"
        className="inline-block bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold"
      >
        Learning Roadmap dekho →
      </Link>
    </div>
  );
}

export default GapAnalysis;