import { useEffect, useState } from "react";
import api from "../api/axios";

function TargetRole() {
  const [roles, setRoles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [r, t] = await Promise.all([
          api.get("/roles"),
          api.get("/roles/target"),
        ]);
        setRoles(r.data.roles);
        if (t.data.role) setSelectedId(t.data.role._id);
      } catch {
        setError("Could not load roles");
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setMessage("");
    setError("");
    try {
      await api.put("/roles/target", { roleId: selectedId });
      setMessage("Target role saved ✅");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save");
    }
  };

  const selectedRole = roles.find((r) => r._id === selectedId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Target Role</h1>

      {message && <p className="bg-green-500/20 text-green-300 p-2 rounded mb-4">{message}</p>}
      {error && <p className="bg-red-500/20 text-red-300 p-2 rounded mb-4">{error}</p>}

      <div className="bg-slate-800 p-4 rounded-xl flex gap-3 mb-6">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-700 outline-none"
        >
          <option value="">Choose a role</option>
          {roles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          disabled={!selectedId}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold disabled:opacity-50"
        >
          Save
        </button>
      </div>

      {selectedRole && (
        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold">{selectedRole.title}</h2>
          <p className="text-slate-400 mb-4">{selectedRole.description}</p>

          <p className="font-semibold mb-2">Required skills</p>
          <div className="space-y-2">
            {selectedRole.requiredSkills.map((rs) => (
              <div
                key={rs._id}
                className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded"
              >
                <span>{rs.skill?.name}</span>
                <span className="text-xs text-slate-300">
                  min level {rs.minLevel} · {rs.importance === "must" ? "must have" : "good to have"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TargetRole;