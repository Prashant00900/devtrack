import { useEffect, useState } from "react";
import api from "../api/axios";

const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-5";

function Stat({ icon, label, value, sub }) {
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

const barColor = (percent) =>
  percent >= 70 ? "bg-green-500" : percent >= 30 ? "bg-blue-500" : "bg-amber-500";

function Tracker() {
  const [data, setData] = useState(null);
  const [activeKey, setActiveKey] = useState("dsa");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/tracker", {
        params: { tzOffset: new Date().getTimezoneOffset() },
      });
      setData(res.data);
    } catch {
      setError("Could not load the tracker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (topic) => {
    // Pehle screen par turant badlo, phir server se confirm karo
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => ({
        ...s,
        topics: s.topics.map((t) =>
          t.id === topic.id ? { ...t, done: !t.done } : t
        ),
      })),
    }));

    try {
      await api.post("/tracker/toggle", { topicId: topic.id });
    } catch {
      setError("Could not update");
    }
    load();
  };

  if (loading) return <p className="text-slate-400">Loading...</p>;

  if (!data) {
    return (
      <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg">
        {error || "Something went wrong"}
      </p>
    );
  }

  const { subjects, overall, streak } = data;
  const active = subjects.find((s) => s.key === activeKey) || subjects[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Skill Tracker</h1>
        <p className="text-slate-400 mt-1">
          Tick the core CS topics you have finished. Study a little every day to keep your streak alive.
        </p>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat
          icon="📚"
          label="Overall progress"
          value={`${overall.percent}%`}
          sub={`${overall.done} of ${overall.total} topics`}
        />
        <Stat
          icon="✅"
          label="Topics done"
          value={overall.done}
          sub={`${overall.total - overall.done} left`}
        />
        <Stat
          icon="🔥"
          label="Current streak"
          value={`${streak.current} ${streak.current === 1 ? "day" : "days"}`}
          sub={streak.activeToday ? "You studied today" : "Tick a topic today to keep it going"}
        />
        <Stat
          icon="🏆"
          label="Longest streak"
          value={`${streak.longest} ${streak.longest === 1 ? "day" : "days"}`}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {subjects.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveKey(s.key)}
            className={`text-left rounded-2xl border p-4 transition ${
              s.key === active.key
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{s.icon}</span>
              <span className="text-sm font-semibold">{s.percent}%</span>
            </div>
            <p className="font-semibold mt-2 text-sm">{s.name}</p>
            <p className="text-xs text-slate-400">
              {s.done}/{s.total} topics
            </p>
            <div className="h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${barColor(s.percent)}`}
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {active.icon} {active.name}
          </h2>
          <span className="text-sm text-slate-400">
            {active.done}/{active.total} done
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {active.topics.map((t) => (
            <label
              key={t.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition ${
                t.done
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => handleToggle(t)}
                className="w-4 h-4 accent-green-500 cursor-pointer"
              />
              <span className={`text-sm ${t.done ? "line-through text-slate-400" : ""}`}>
                {t.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tracker;