import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const levelNames = {
  student: "Student",
  fresher: "Fresher",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
};

const verdicts = {
  ready: { text: "Ready for promotion 🎉", color: "text-green-400", bar: "bg-green-500" },
  almost: { text: "Almost there 💪", color: "text-yellow-400", bar: "bg-yellow-500" },
  "not-yet": { text: "Not ready yet", color: "text-red-400", bar: "bg-red-500" },
};

function Promotion() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/promotion/readiness")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load data")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Promotion Readiness</h1>
        <p className="bg-red-500/20 text-red-300 p-3 rounded">{error}</p>
      </div>
    );
  }

  if (!data.nextLevel) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Promotion Readiness</h1>
        <p className="bg-slate-800 p-4 rounded-xl text-slate-300">
          You are already at Senior level. Focus on leadership, mentoring and system design now.
        </p>
      </div>
    );
  }

  const v = verdicts[data.verdict];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Promotion Readiness</h1>
      <p className="text-slate-400 mb-6">
        {levelNames[data.currentLevel]} → {levelNames[data.nextLevel]} ·{" "}
        <Link to="/profile" className="text-blue-400 underline">
          Want to change your level? Open Profile
        </Link>
      </p>

      <div className="bg-slate-800 p-5 rounded-xl mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className={`font-semibold ${v.color}`}>{v.text}</span>
          <span className="text-4xl font-bold">{data.readiness}%</span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full ${v.bar}`} style={{ width: `${data.readiness}%` }} />
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl mb-6">
        <h2 className="text-lg font-semibold mb-3">Criteria</h2>
        <div className="space-y-2">
          {data.criteria.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded"
            >
              <span>
                {c.met ? "✅" : "⏳"} {c.label}
              </span>
              <span
                className={`text-sm font-semibold ${
                  c.met ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {c.current} / {c.target}
              </span>
            </div>
          ))}
        </div>
      </div>

      {data.actions.length > 0 && (
        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">What to do next 🚀</h2>
          <ol className="list-decimal pl-5 space-y-2 text-slate-200">
            {data.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default Promotion;