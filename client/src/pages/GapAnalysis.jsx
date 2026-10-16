import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function SkillRow({ item, barColor, textColor }) {
  const fill = Math.min((item.userLevel / item.minLevel) * 100, 100);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <p className="text-xs text-slate-500">
            {item.importance === "must" ? "Must have" : "Good to have"}
          </p>
        </div>
        <span className={`text-sm font-semibold shrink-0 ${textColor}`}>
          {item.userLevel}/{item.minLevel}
        </span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${fill}%` }} />
      </div>
    </div>
  );
}

function Column({ title, subtitle, items, barColor, textColor, border, emptyText }) {
  return (
    <div className={`bg-slate-900 border ${border} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold">{title}</h2>
        <span className={`text-sm font-bold ${textColor}`}>{items.length}</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{subtitle}</p>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <SkillRow
              key={item.skillId}
              item={item}
              barColor={barColor}
              textColor={textColor}
            />
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
        setError(err.response?.data?.message || "Could not load the analysis")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading...</p>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Skill Gap Analysis</h1>
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
        <Link to="/target-role" className="text-blue-400 hover:underline">
          Select a target role →
        </Link>
      </div>
    );
  }

  const pct = report.matchPercentage;
  const barColor =
    pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";
  const pctText =
    pct >= 70 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-slate-400 mt-1">
          Target role: <span className="text-slate-200">{report.role.title}</span>
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-sm text-slate-400">Role match</p>
            <p className={`text-5xl font-bold mt-1 ${pctText}`}>{pct}%</p>
          </div>
          <p className="text-sm text-slate-400 text-right">
            {report.strong.length} strong · {report.weak.length} weak ·{" "}
            {report.missing.length} missing
            <br />
            out of {report.totalRequired} required skills
          </p>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Column
          title="✅ Strong"
          subtitle="At the required level"
          items={report.strong}
          barColor="bg-green-500"
          textColor="text-green-400"
          border="border-green-500/20"
          emptyText="Nothing here yet"
        />
        <Column
          title="⚠️ Weak"
          subtitle="You know it, level needs to go up"
          items={report.weak}
          barColor="bg-yellow-500"
          textColor="text-yellow-400"
          border="border-yellow-500/20"
          emptyText="No weak skills"
        />
        <Column
          title="❌ Missing"
          subtitle="Not in your skills yet"
          items={report.missing}
          barColor="bg-red-500"
          textColor="text-red-400"
          border="border-red-500/20"
          emptyText="Nothing missing. Great!"
        />
      </div>

      <Link
        to="/roadmap"
        className="inline-block bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-semibold transition"
      >
        View learning roadmap →
      </Link>
    </div>
  );
}

export default GapAnalysis;