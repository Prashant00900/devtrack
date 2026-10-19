import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-5";
const inputClass =
  "px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 outline-none";

function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load stats")
      );
  }, []);

  if (error) {
    return (
      <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg">
        {error}
      </p>
    );
  }
  if (!data) return <p className="text-slate-400">Loading...</p>;

  const stats = [
    ["👥", "Total users", data.users],
    ["🆕", "New (7 days)", data.newUsers],
    ["📁", "Projects", data.projects],
    ["🏅", "Certifications", data.certifications],
    ["🛠️", "Skill entries", data.skillEntries],
  ];
  const max = Math.max(1, ...data.topSkills.map((t) => t.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(([icon, label, value]) => (
          <div key={label} className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{label}</p>
              <span className="text-xl">{icon}</span>
            </div>
            <p className="text-3xl font-bold mt-3">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h2 className="font-semibold mb-4">Most added skills</h2>
          {data.topSkills.length === 0 ? (
            <p className="text-sm text-slate-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topSkills.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.name}</span>
                    <span className="text-slate-400">
                      {t.count} users · avg {t.avgLevel}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(t.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className="font-semibold mb-4">Recent signups</h2>
          <div className="space-y-3">
            {data.recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0 ml-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Users() {
  const { user: me } = useAuth();
  const myId = me?._id || me?.id;
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (q = "") => {
    try {
      const res = await api.get("/admin/users", { params: { search: q } });
      setUsers(res.data.users);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the role");
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`${u.email} and all their data will be deleted. Are you sure?`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
        className="flex gap-3 mb-4"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-5 rounded-lg font-semibold transition"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className={`${cardClass} overflow-x-auto p-0`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-800">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === myId;
                return (
                  <tr key={u.id} className="border-b border-slate-800 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {u.name} {isMe && <span className="text-xs text-blue-400">(you)</span>}
                      </p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={isMe}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 outline-none disabled:opacity-50"
                      >
                        <option value="developer">developer</option>
                        <option value="mentor">mentor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeUser(u)}
                        disabled={isMe}
                        className="bg-slate-800 hover:bg-red-600 px-3 py-1 rounded-lg transition disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Resources() {
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ skillId: "", title: "", url: "", type: "docs" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s, r] = await Promise.all([
        api.get("/skills"),
        api.get("/admin/resources"),
      ]);
      setSkills(s.data.skills);
      setResources(r.data.resources);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load resources");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/admin/resources", form);
      setForm({ skillId: "", title: "", url: "", type: "docs" });
      setMessage("Link added ✅");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/resources/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  const handleSeed = async () => {
    setMessage("");
    setError("");
    try {
      const res = await api.post("/admin/resources/seed-defaults");
      setMessage(`${res.data.added} new default links added`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not load default links");
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <p className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-lg">
          {message}
        </p>
      )}
      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div className={`${cardClass} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div>
          <p className="font-semibold">Default learning links</p>
          <p className="text-sm text-slate-400">
            Add starter links for every skill in one click. Clicking again will not create duplicates.
          </p>
        </div>
        <button
          onClick={handleSeed}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold shrink-0 transition"
        >
          Load default links
        </button>
      </div>

      <form onSubmit={handleAdd} className={`${cardClass} space-y-3`}>
        <p className="font-semibold">Add a link</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            name="skillId"
            value={form.skillId}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Choose a skill</option>
            {skills.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            <option value="docs">docs</option>
            <option value="video">video</option>
            <option value="course">course</option>
            <option value="article">article</option>
            <option value="practice">practice</option>
          </select>
        </div>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title (e.g. React crash course)"
          required
          className={`${inputClass} w-full`}
        />
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://..."
          required
          className={`${inputClass} w-full`}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-semibold transition"
        >
          Add link
        </button>
      </form>

      <div className={`${cardClass} p-0 overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-800">
              <th className="px-4 py-3 font-medium">Skill</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r._id} className="border-b border-slate-800 last:border-0">
                <td className="px-4 py-3">{r.skill.name}</td>
                <td className="px-4 py-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {r.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-400">{r.type}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-slate-800 hover:bg-red-600 px-3 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No links yet. Click "Load default links".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Admin() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    ["overview", "Overview"],
    ["users", "Users"],
    ["resources", "Learning links"],
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-slate-400 mt-1">Manage users and learning links.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === key
                ? "bg-blue-600 text-white"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "users" && <Users />}
      {tab === "resources" && <Resources />}
    </div>
  );
}

export default Admin;