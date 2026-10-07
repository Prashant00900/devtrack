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

  if (loading) return <p>Loading...</p>;

  if (error && !data) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Learning Roadmap</h1>
        <p className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</p>
        <Link to="/target-role" className="text-blue-400 underline">
          Target Role select karo
        </Link>
      </div>
    );
  }

  const doneCount = data.roadmap.filter((r) => r.done).length;
  const total = data.roadmap.length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Learning Roadmap</h1>
      <p className="text-slate-400 mb-6">
        Target: {data.role.title} · Current match: {data.matchPercentage}%
      </p>

      {error && <p className="bg-red-500/20 text-red-300 p-2 rounded mb-4">{error}</p>}

      {total === 0 ? (
        <p className="bg-green-500/20 text-green-300 p-4 rounded">
          Tumhari saari required skills ready hain 🎉
        </p>
      ) : (
        <>
          <div className="bg-slate-800 p-4 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Progress</span>
              <span className="font-semibold">
                {doneCount} / {total} done ({progress}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Tick sirf tumhare tracking ke liye hai. Gap Analysis tab badlega jab tum Skills page par level badhaoge.
            </p>
          </div>

          <div className="space-y-3">
            {data.roadmap.map((item) => (
              <div
                key={item.skillId}
                className={`bg-slate-800 p-4 rounded-xl flex items-center gap-4 ${
                  item.done ? "opacity-60" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => handleToggle(item)}
                  className="w-5 h-5 shrink-0 cursor-pointer"
                />

                <div className="flex-1">
                  <p className={`font-semibold ${item.done ? "line-through" : ""}`}>
                    {item.order}. {item.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    Level {item.fromLevel} → {item.toLevel} ·{" "}
                    {item.importance === "must" ? "must have" : "good to have"} ·{" "}
                    {item.category}
                  </p>
                </div>

                <a
                  href={item.searchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm"
                >
                  Learn ↗
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Roadmap;