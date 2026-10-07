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
  backgroundColor: "#1e293b",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
};

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Github() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [needsUsername, setNeedsUsername] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/github/summary")
      .then((res) => setData(res.data.summary))
      .catch((err) => {
        if (err.response?.status === 400) setNeedsUsername(true);
        setError(err.response?.data?.message || "GitHub data load nahi hua");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>GitHub data la rahe hain...</p>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">GitHub</h1>
        <p className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</p>
        {needsUsername && (
          <Link to="/profile" className="text-blue-400 underline">
            Profile mein GitHub username daalo →
          </Link>
        )}
      </div>
    );
  }

  const { profile, stats, languages, topRepos, activity } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">GitHub</h1>

      <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-4 mb-6">
        <img
          src={profile.avatarUrl}
          alt={profile.username}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <p className="text-xl font-semibold">{profile.name || profile.username}</p>
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 text-sm"
          >
            @{profile.username}
          </a>
          {profile.bio && <p className="text-slate-300 text-sm mt-1">{profile.bio}</p>}
        </div>
        <div className="text-sm text-slate-400 text-right">
          <p>{profile.followers} followers</p>
          <p>{profile.following} following</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Own repos" value={stats.ownRepos} />
        <StatCard label="Total stars" value={stats.totalStars} />
        <StatCard label="Active repos (30d)" value={stats.activeLast30Days} />
        <StatCard label="Events (30d)" value={stats.eventsLast30Days} />
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Languages (repos count)</h2>
          {languages.length === 0 ? (
            <p className="text-slate-400 text-sm">Koi language data nahi mila.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languages}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={95}
                    label
                  >
                    {languages.map((entry, index) => (
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

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Recent activity (events per week)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#334155" }} />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Top repositories</h2>
          {topRepos.length === 0 ? (
            <p className="text-slate-400 text-sm">Koi repo nahi mili.</p>
          ) : (
            <div className="space-y-3">
              {topRepos.map((r) => (
                <div key={r.name} className="bg-slate-700 p-3 rounded">
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-400"
                    >
                      {r.name}
                    </a>
                    <span className="text-xs text-slate-300">
                      ⭐ {r.stars} · 🍴 {r.forks}
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-sm text-slate-300 mt-1">{r.description}</p>
                  )}
                  {r.language && (
                    <p className="text-xs text-slate-400 mt-1">{r.language}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Github;