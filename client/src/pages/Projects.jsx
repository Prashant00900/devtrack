import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  status: "completed",
};

const statusStyle = {
  completed: "bg-green-500/15 text-green-300",
  "in-progress": "bg-yellow-500/15 text-yellow-300",
  planned: "bg-slate-700 text-slate-300",
};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none";

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="text-slate-400 mt-1">
          Projects prove your skills. Add the tech stack so DevTrack can map skills for you.
        </p>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 mb-8"
      >
        <p className="font-semibold">
          {editingId ? "✏️ Editing project" : "Add a new project"}
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project title"
            required
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
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What does this project do?"
          rows={2}
          className={inputClass}
        />

        <div className="grid sm:grid-cols-2 gap-3">
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
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-2">
            Tech stack (click to select)
          </p>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((s) => (
              <button
                type="button"
                key={s._id}
                onClick={() => toggleSkill(s._id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  techStack.includes(s._id)
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-semibold transition"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-800 hover:bg-slate-700 px-5 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No projects yet. Add your first project above.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    statusStyle[p.status] || statusStyle.planned
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {p.description && (
                <p className="text-sm text-slate-300 mt-2">{p.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {p.techStack.map((t) => (
                  <span
                    key={t._id}
                    className="bg-slate-800 text-slate-300 px-2 py-1 rounded-full text-xs"
                  >
                    {t.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex gap-4 text-sm">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Live ↗
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-slate-800 hover:bg-red-600 px-3 py-1 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;