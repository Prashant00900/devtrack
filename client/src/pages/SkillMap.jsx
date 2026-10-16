import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function SkillMap() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/project-skills");
      setItems(res.data.items);
    } catch {
      setError("Could not load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const missing = items.filter((i) => !i.inMySkills);

  const handleSync = async () => {
    setMessage("");
    setError("");
    setSyncing(true);
    try {
      const res = await api.post("/project-skills/sync");
      setMessage(
        res.data.added.length
          ? `${res.data.added.length} skills added: ${res.data.added.join(", ")}`
          : "No new skills to add"
      );
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not sync");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Project → Skill Map</h1>
      <p className="text-slate-400 mb-6">
        Skills used in your projects, and whether they are in your My Skills list.
      </p>

      {message && (
        <p className="bg-green-500/20 text-green-300 p-2 rounded mb-4">{message}</p>
      )}
      {error && (
        <p className="bg-red-500/20 text-red-300 p-2 rounded mb-4">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-slate-300 mb-2">
            No project has a tech stack selected yet.
          </p>
          <Link to="/projects" className="text-blue-400 underline">
            Add a tech stack in Projects →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between gap-3 mb-6">
            <p className="text-slate-300">
              {missing.length === 0
                ? "All project skills are in your My Skills ✅"
                : `${missing.length} skills are used in projects but missing from My Skills`}
            </p>
            <button
              onClick={handleSync}
              disabled={syncing || missing.length === 0}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold disabled:opacity-50 shrink-0"
            >
              {syncing ? "Syncing..." : "Sync to My Skills"}
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.skillId} className="bg-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.inMySkills
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {item.inMySkills
                        ? "In My Skills"
                        : `Not in My Skills (level ${item.suggestedLevel} will be added)`}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mt-2">
                  {item.projectCount} project{item.projectCount > 1 ? "s" : ""}:{" "}
                  {item.projects.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SkillMap;