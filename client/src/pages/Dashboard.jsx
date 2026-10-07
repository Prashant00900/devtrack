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

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
};

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
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

  if (loading) return <p>Loading...</p>;

  // Bar chart data: skill vs level
  const barData = skills.map((item) => ({
    name: item.skill?.name,
    level: item.level,
  }));

  // Pie chart data: skills per category
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

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
      <p className="text-slate-400 mb-6">Tumhara developer career overview</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Skills" value={skills.length} sub={`Avg level ${avgLevel}`} />
        <StatCard label="Projects" value={projects.length} />
        <StatCard
          label="Role match"
          value={report ? `${report.matchPercentage}%` : "—"}
          sub={report ? report.role.title : "Target role select nahi hai"}
        />
        <StatCard
          label="Skills to learn"
          value={report ? report.missing.length + report.weak.length : "—"}
          sub={report ? `${report.missing.length} missing · ${report.weak.length} weak` : ""}
        />
      </div>

      {!report && (
        <div className="bg-slate-800 p-4 rounded-xl mb-6">
          <p className="text-slate-300 mb-2">
            Role match dekhne ke liye pehle target role select karo.
          </p>
          <Link to="/target-role" className="text-blue-400 underline">
            Target Role select karo →
          </Link>
        </div>
      )}

      {skills.length === 0 ? (
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-slate-300 mb-2">Charts dekhne ke liye kuch skills add karo.</p>
          <Link to="/skills" className="text-blue-400 underline">
            Skills add karo →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Skill levels</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                  <YAxis
                    domain={[0, 5]}
                    allowDecimals={false}
                    tick={{ fill: "#cbd5e1", fontSize: 12 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#334155" }} />
                  <Bar dataKey="level" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Skills by category</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    label
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