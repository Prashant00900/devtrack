import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api/axios";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7", "#14b8a6", "#f97316"];

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#fff",
};

const cardClass = "bg-slate-900 border border-slate-800 rounded-2xl p-5";

function StatCard({ label, value }) {
  return (
    <div className={cardClass}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function LinkedInCard({ url }) {
  return (
    <div className={`${cardClass} flex items-center justify-between gap-4`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#0a66c2] flex items-center justify-center text-xl font-bold shrink-0">
          in
        </div>
        <div className="min-w-0">
          <p className="font-semibold">LinkedIn</p>
          {url ? (
            <p className="text-sm text-slate-400 truncate">{url}</p>
          ) : (
            <p className="text-sm text-slate-400">
              Profile mein apna LinkedIn link add karo.
            </p>
          )}
        </div>
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="bg-[#0a66c2] hover:bg-[#0b78e3] px-4 py-2 rounded-lg font-semibold text-sm shrink-0 transition"
        >
          Open ↗
        </a>
      ) : (
        <Link
          to="/profile"
          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-semibold text-sm shrink-0 transition"
        >
          Add link
        </Link>
      )}
    </div>
  );
}

function Github() {
  const [data, setData] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [error, setError] = useState("");
  const [needsUsername, setNeedsUsername] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    setNeedsUsername(false);

    try {
      const p = await api.get("/profile");
      setLinkedinUrl(p.data.profile?.linkedinUrl || "");
    } catch {
      // profile na mile to bhi aage badho
    }

    try {
      const res = await api.get("/github/summary");
      setData(res.data.summary);
    } catch (err) {
      if (err.response?.status === 400) setNeedsUsername(true);
      setError(err.response?.data?.message || "GitHub data load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-slate-400">GitHub data la rahe hain...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">GitHub & LinkedIn</h1>
        <p className="text-slate-400 mt-1">
          Your public developer profiles in one place.
        </p>
      </div>

      <div className="mb-6">
        <LinkedInCard url={linkedinUrl} />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl mb-6">
          <p>{error}</p>
          <div className="flex gap-4 mt-3 text-sm">
            {needsUsername ? (
              <Link to="/profile" className="text-blue-400 hover:underline">
                Profile mein GitHub username daalo →
              </Link>
            ) : (
              <button onClick={load} className="text-blue-400 hover:underline">
                Dobara try karo
              </button>
            )}
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className={`${cardClass} flex items-center gap-4`}>
            <img
              src={data.profile.avatarUrl}
              alt={data.profile.username}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xl font-semibold">
                {data.profile.name || data.profile.username}
              </p>
              <a
                href={data.profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 text-sm hover:underline"
              >
                @{data.profile.username} ↗
              </a>
              {data.profile.bio && (
                <p className="text-slate-300 text-sm mt-1">{data.profile.bio}</p>
              )}
            </div>
            <div className="text-sm text-slate-400 text-right shrink-0">
              <p>{data.profile.followers} followers</p>
              <p>{data.profile.following} following</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Own repos" value={data.stats.ownRepos} />
            <StatCard label="Total stars" value={data.stats.totalStars} />
            <StatCard label="Active repos (30d)" value={data.stats.activeLast30Days} />
            <StatCard label="Events (30d)" value={data.stats.eventsLast30Days} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className={cardClass}>
              <h2 className="text-lg font-semibold mb-4">Languages (repos count)</h2>
              {data.languages.length === 0 ? (
                <p className="text-slate-400 text-sm">Koi language data nahi mila.</p>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.languages}
                        dataKey="count"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {data.languages.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className={cardClass}>
              <h2 className="text-lg font-semibold mb-4">
                Recent activity (events per week)
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.activity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b" }} />
                    <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-lg font-semibold mb-4">Top repositories</h2>
            {data.topRepos.length === 0 ? (
              <p className="text-slate-400 text-sm">Koi repo nahi mili.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {data.topRepos.map((r) => (
                  <div
                    key={r.name}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-400 hover:underline truncate"
                      >
                        {r.name}
                      </a>
                      <span className="text-xs text-slate-400 shrink-0">
                        ⭐ {r.stars} · 🍴 {r.forks}
                      </span>
                    </div>
                    {r.description && (
                      <p className="text-sm text-slate-300 mt-1">{r.description}</p>
                    )}
                    {r.language && (
                      <span className="inline-block mt-2 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {r.language}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Github;