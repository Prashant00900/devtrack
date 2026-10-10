import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Roadmap() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analysis/roadmap")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Roadmap load nahi hua")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (item) => {
    try {
      const res = await api.post("/roadmap-progress/toggle", {
        skillId: item.skillId,
      });
      setData((prev) => ({
        ...prev,
        roadmap: prev.roadmap.map((r) =>
          r.skillId === item.skillId ? { ...r, done: res.data.done } : r
        ),
      }));
    } catch {
      setError("Update nahi hua");
    }
  };

  if (loading) return <p className="text-slate-400">Loading...</p>;

  if (error && !data) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Learning Roadmap</h1>
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
        <Link to="/target-role" className="text-blue-400 hover:underline">
          Select a target role →
        </Link>
      </div>
    );
  }

  const doneCount = data.roadmap.filter((r) => r.done).length;
  const total = data.roadmap.length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Learning Roadmap</h1>
        <p className="text-slate-400 mt-1">
          Target role: <span className="text-slate-200">{data.role.title}</span>{" "}
          · Current match {data.matchPercentage}%
        </p>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      {total === 0 ? (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-6 rounded-2xl text-center">
          All required skills are ready 🎉
        </div>
      ) : (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Your progress</span>
              <span className="font-semibold">
                {doneCount} / {total} done ({progress}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Ticks are for your own tracking. Your match % changes when you update skill levels on the Skills page.
            </p>
          </div>

          <div className="space-y-3">
            {data.roadmap.map((item) => (
              <div
                key={item.skillId}
                className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 transition ${
                  item.done ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${
                    item.done ? "bg-green-600" : "bg-blue-600"
                  }`}
                >
                  {item.done ? "✓" : item.order}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold ${
                      item.done ? "line-through" : ""
                    }`}
                  >
                    {item.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                      Level {item.fromLevel} → {item.toLevel}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.importance === "must"
                          ? "bg-red-500/15 text-red-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.importance === "must" ? "Must have" : "Good to have"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={item.searchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Learn ↗
                  </a>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggle(item)}
                    className="w-5 h-5 cursor-pointer accent-green-500"
                    aria-label="Mark as done"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Roadmap;