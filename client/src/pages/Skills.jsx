import { useEffect, useState } from "react";
import api from "../api/axios";

const levelLabels = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

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

  const inputClass = "p-2 rounded bg-slate-700 outline-none";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Skills</h1>

      {error && (
        <p className="bg-red-500/20 text-red-300 p-2 rounded mb-4">{error}</p>
      )}

      <div className="bg-slate-800 p-4 rounded-xl flex flex-wrap gap-3 mb-6">
        <select
          value={skillId}
          onChange={(e) => setSkillId(e.target.value)}
          className={`${inputClass} flex-1 min-w-[160px]`}
        >
          <option value="">Skill choose karo</option>
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
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold"
        >
          Add
        </button>
      </div>

      {mySkills.length === 0 ? (
        <p className="text-slate-400">Abhi koi skill add nahi hui.</p>
      ) : (
        <div className="space-y-3">
          {mySkills.map((item) => (
            <div
              key={item._id}
              className="bg-slate-800 p-3 rounded-xl flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-semibold">{item.skill?.name}</p>
                <p className="text-xs text-slate-400">{item.skill?.category}</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={item.level}
                  onChange={(e) => handleLevelChange(item._id, Number(e.target.value))}
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>
                      {l} - {levelLabels[l]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Skills;