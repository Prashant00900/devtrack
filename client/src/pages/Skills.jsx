import { useEffect, useState } from "react";
import api from "../api/axios";

const levelLabels = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

const levelColor = (level) =>
  level >= 4 ? "bg-green-500" : level === 3 ? "bg-blue-500" : "bg-amber-500";

const inputClass =
  "px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none";

function Skills() {
  const [allSkills, setAllSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [skillId, setSkillId] = useState("");
  const [level, setLevel] = useState(1);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [all, mine] = await Promise.all([
        api.get("/skills"),
        api.get("/skills/me"),
      ]);
      setAllSkills(all.data.skills);
      setMySkills(mine.data.userSkills);
    } catch {
      setError("Skills load nahi hui");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const available = allSkills.filter(
    (s) => !mySkills.some((m) => m.skill?._id === s._id)
  );

  const handleAdd = async () => {
    if (!skillId) return;
    setError("");
    try {
      await api.post("/skills/me", { skillId, level });
      setSkillId("");
      setLevel(1);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Add nahi hua");
    }
  };

  const handleLevelChange = async (id, newLevel) => {
    try {
      await api.put(`/skills/me/${id}`, { level: newLevel });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Update nahi hua");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/skills/me/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete nahi hua");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Skills</h1>
        <p className="text-slate-400 mt-1">
          Add the skills you know and rate yourself honestly from 1 to 5.
        </p>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <p className="font-semibold mb-3">Add a skill</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            className={`${inputClass} flex-1`}
          >
            <option value="">Choose a skill</option>
            {available.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5].map((l) => (
              <option key={l} value={l}>
                {l} - {levelLabels[l]}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            disabled={!skillId}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition"
          >
            Add
          </button>
        </div>
      </div>

      {mySkills.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No skills yet. Add your first skill above.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {mySkills.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.skill?.name}</p>
                  <span className="inline-block mt-1 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    {item.skill?.category}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-slate-500 hover:text-red-400 text-lg leading-none transition"
                  aria-label="Delete skill"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i <= item.level ? levelColor(item.level) : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-slate-300">
                  {levelLabels[item.level]}
                </p>
                <select
                  value={item.level}
                  onChange={(e) =>
                    handleLevelChange(item._id, Number(e.target.value))
                  }
                  className="px-2 py-1 text-sm rounded-lg bg-slate-950 border border-slate-700 outline-none"
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>
                      {l} - {levelLabels[l]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Skills;