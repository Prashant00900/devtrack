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
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7", "#14b8a6", "#f97316"];

const levelColor = (level) =>
  level >= 4 ? "#22c55e" : level === 3 ? "#3b82f6" : "#f59e0b";

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "#fff",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${accent}`}
        >
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 truncate">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p, g] = await Promise.all([
          api.get("/skills/me"),
          api.get("/projects"),
          api.get("/analysis/gap").catch(() => null),
        ]);
        setSkills(s.data.userSkills);
        setProjects(p.data.projects);
        setReport(g ? g.data.report : null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-slate-400">Loading...</p>;

  const barData = skills.map((item) => ({
    name: item.skill?.name,
    level: item.level,
  }));

  const categoryCount = {};
  skills.forEach((item) => {
    const cat = item.skill?.category || "other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const pieData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

  const avgLevel = skills.length
    ? (skills.reduce((sum, s) => sum + s.level, 0) / skills.length).toFixed(1)
    : 0;

  const toLearn = report ? report.missing.length + report.weak.length : 0;
  const pct = report ? report.matchPercentage : 0;
  const pctColor =
    pct >= 70 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400";

  let nextStep = null;
  if (skills.length === 0) {
    nextStep = {
      text: "Start by adding the skills you already know.",
      to: "/skills",
      cta: "Add skills",
    };
  } else if (!report) {
    nextStep = {
      text: "Pick a target role to see how close you are.",
      to: "/target-role",
      cta: "Choose a role",
    };
  } else if (projects.length === 0) {
    nextStep = {
      text: "Add your first project. Projects prove your skills to recruiters.",
      to: "/projects",
      cta: "Add a project",
    };
  } else if (toLearn > 0) {
    nextStep = {
      text: `${toLearn} skills are left for ${report.role.title}. Follow your roadmap.`,
      to: "/roadmap",
      cta: "Open roadmap",
    };
  }

  const quickActions = [
    { to: "/skills", label: "Update skills", icon: "🛠️" },
    { to: "/projects", label: "Add project", icon: "📁" },
    { to: "/gap-analysis", label: "Gap analysis", icon: "📈" },
    { to: "/roadmap", label: "Roadmap", icon: "🧭" },
  ];

  const cardClass = "bg-slate-900 border border-slate-800 p-5 rounded-2xl";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here is your developer career overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="🛠️"
          label="Skills"
          value={skills.length}
          sub={`Average level ${avgLevel}`}
          accent="bg-blue-500/15"
        />
        <StatCard
          icon="📁"
          label="Projects"
          value={projects.length}
          sub={projects.length === 0 ? "Add your first one" : "Keep building"}
          accent="bg-purple-500/15"
        />
        <StatCard
          icon="🎯"
          label="Role match"
          value={
            report ? <span className={pctColor}>{pct}%</span> : "—"
          }
          sub={report ? report.role.title : "No target role yet"}
          accent="bg-green-500/15"
        />
        <StatCard
          icon="📚"
          label="Skills to learn"
          value={report ? toLearn : "—"}
          sub={
            report
              ? `${report.missing.length} missing · ${report.weak.length} weak`
              : ""
          }
          accent="bg-orange-500/15"
        />
      </div>

      {nextStep && (
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-5 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Next step
            </p>
            <p className="mt-1 text-slate-100">{nextStep.text}</p>
          </div>
          <Link
            to={nextStep.to}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold text-center shrink-0 transition"
          >
            {nextStep.cta} →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {quickActions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl px-4 py-3 flex items-center gap-3 transition"
          >
            <span className="text-lg">{a.icon}</span>
            <span className="text-sm font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      {skills.length === 0 ? (
        <div className={cardClass}>
          <p className="text-slate-300 mb-2">Add some skills to see your charts.</p>
          <Link to="/skills" className="text-blue-400 hover:underline">
            Add skills →
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`${cardClass} lg:col-span-2`}>
            <h2 className="text-lg font-semibold">Skill levels</h2>
            <p className="text-xs text-slate-400 mb-4">
              <span className="text-green-400">●</span> 4-5 strong ·{" "}
              <span className="text-blue-400">●</span> 3 good ·{" "}
              <span className="text-amber-400">●</span> 1-2 learning
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    allowDecimals={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b" }} />
                  <Bar dataKey="level" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={levelColor(entry.level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-lg font-semibold mb-4">Skills by category</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;