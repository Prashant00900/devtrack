import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  status: "completed",
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [techStack, setTechStack] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, s] = await Promise.all([api.get("/projects"), api.get("/skills")]);
      setProjects(p.data.projects);
      setAllSkills(s.data.skills);
    } catch {
      setError("Data load nahi hua");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSkill = (id) => {
    setTechStack((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setForm(emptyForm);
    setTechStack([]);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      status: p.status || "completed",
    });
    setTechStack(p.techStack.map((t) => t._id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, { ...form, techStack });
      } else {
        await api.post("/projects", { ...form, techStack });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Project save nahi hua");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete nahi hua");
    }
  };

  const inputClass = "w-full p-2 rounded bg-slate-700 outline-none";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>

      {error && (
        <p className="bg-red-500/20 text-red-300 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-xl space-y-3 mb-8">
        <p className="font-semibold">
          {editingId ? "✏️ Project edit kar rahe ho" : "Naya project add karo"}
        </p>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project title"
          required
          className={inputClass}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={2}
          className={inputClass}
        />
        <input
          name="githubUrl"
          value={form.githubUrl}
          onChange={handleChange}
          placeholder="GitHub link"
          className={inputClass}
        />
        <input
          name="liveUrl"
          value={form.liveUrl}
          onChange={handleChange}
          placeholder="Live link"
          className={inputClass}
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="planned">Planned</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <div>
          <p className="text-sm text-slate-400 mb-2">Tech stack (click karke select karo)</p>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((s) => (
              <button
                type="button"
                key={s._id}
                onClick={() => toggleSkill(s._id)}
                className={`px-2 py-1 rounded text-xs ${
                  techStack.includes(s._id)
                    ? "bg-blue-600"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded font-semibold"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-600 hover:bg-slate-500 px-4 rounded font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {projects.length === 0 ? (
        <p className="text-slate-400">Abhi koi project nahi hai.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p._id} className="bg-slate-800 p-4 rounded-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{p.title}</h2>
                  <p className="text-xs text-slate-400 mb-1">{p.status}</p>
                  {p.description && <p className="text-slate-300">{p.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {p.techStack.map((t) => (
                  <span key={t._id} className="bg-slate-700 px-2 py-1 rounded text-xs">
                    {t.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-3 text-sm">
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400">
                    GitHub
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-blue-400">
                    Live
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;