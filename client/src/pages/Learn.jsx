import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const typeStyle = {
  docs: "bg-blue-500/15 text-blue-300",
  video: "bg-red-500/15 text-red-300",
  course: "bg-purple-500/15 text-purple-300",
  article: "bg-teal-500/15 text-teal-300",
  practice: "bg-amber-500/15 text-amber-300",
};

const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-4";

const youtubeUrl = (name) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} full course`)}`;
const googleUrl = (name) =>
  `https://www.google.com/search?q=${encodeURIComponent(`learn ${name} free resources`)}`;

function SkillCard({ skill, resources, note }) {
  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{skill.name}</p>
          <span className="inline-block mt-1 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
            {skill.category}
          </span>
        </div>
        {note && <span className="text-xs text-yellow-300 text-right">{note}</span>}
      </div>

      <div className="mt-3 space-y-2">
        {resources.map((r) => (
          <a
            key={r._id}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-2 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-lg px-3 py-2 text-sm transition"
          >
            <span className="truncate">{r.title}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                typeStyle[r.type] || typeStyle.docs
              }`}
            >
              {r.type}
            </span>
          </a>
        ))}

        <div className="flex gap-2">
          <a
            href={youtubeUrl(skill.name)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg px-3 py-2 text-xs font-medium transition"
          >
            ▶ YouTube
          </a>
          <a
            href={googleUrl(skill.name)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs font-medium transition"
          >
            🔎 Google
          </a>
        </div>
      </div>
    </div>
  );
}

function Learn() {
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [report, setReport] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r, g] = await Promise.all([
          api.get("/skills"),
          api.get("/resources"),
          api.get("/analysis/gap").catch(() => null),
        ]);
        setSkills(s.data.skills);
        setResources(r.data.resources);
        setReport(g ? g.data.report : null);
      } catch {
        setError("Could not load the Learning Hub");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const bySkill = useMemo(() => {
    const map = {};
    resources.forEach((r) => {
      const id = r.skill._id;
      if (!map[id]) map[id] = [];
      map[id].push(r);
    });
    return map;
  }, [resources]);

  const categories = useMemo(
    () => ["all", ...new Set(skills.map((s) => s.category))],
    [skills]
  );

  const filtered = skills.filter(
    (s) =>
      (category === "all" || s.category === category) &&
      s.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const recommended = report
    ? [
        ...report.missing.map((s) => ({ ...s, note: "Missing" })),
        ...report.weak.map((s) => ({
          ...s,
          note: `Level ${s.userLevel} → ${s.minLevel}`,
        })),
      ].slice(0, 6)
    : [];

  if (loading) return <p className="text-slate-400">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Learning Hub</h1>
        <p className="text-slate-400 mt-1">
          Pick any skill and get direct links to learn it.
        </p>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      {resources.length === 0 && !error && (
        <p className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-3 rounded-lg mb-6 text-sm">
          No curated links yet. Admin Panel → Resources → "Load default links" to add them. Until then the YouTube and Google links still work.
        </p>
      )}

      {recommended.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-1">Recommended for you</h2>
          <p className="text-sm text-slate-400 mb-3">
            Skills you need for your target role.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((item) => (
              <SkillCard
                key={item.skillId}
                skill={{ name: item.name, category: item.category }}
                resources={bySkill[item.skillId] || []}
                note={item.note}
              />
            ))}
          </div>
        </div>
      )}

      {!report && (
        <p className="text-sm text-slate-400 mb-6">
          For personal recommendations,{" "}
          <Link to="/target-role" className="text-blue-400 hover:underline">
            select a target role
          </Link>
          .
        </p>
      )}

      <h2 className="text-lg font-semibold mb-3">All skills</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a skill..."
          className="flex-1 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-400">No skills found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SkillCard key={s._id} skill={s} resources={bySkill[s._id] || []} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Learn;