import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const groups = [
  {
    title: "Home",
    links: [{ to: "/dashboard", label: "Dashboard", icon: "📊" }],
  },
  {
    title: "My Profile",
    links: [
      { to: "/profile", label: "Profile", icon: "👤" },
      { to: "/skills", label: "Skills", icon: "🛠️" },
      { to: "/projects", label: "Projects", icon: "📁" },
      { to: "/certifications", label: "Certifications", icon: "🏅" },
      { to: "/skill-map", label: "Skill Map", icon: "🗺️" },
    ],
  },
  {
    title: "Career Plan",
    links: [
      { to: "/target-role", label: "Target Role", icon: "🎯" },
      { to: "/gap-analysis", label: "Gap Analysis", icon: "📈" },
      { to: "/roadmap", label: "Roadmap", icon: "🧭" },
      { to: "/promotion", label: "Promotion", icon: "🚀" },
    ],
  },
  {
    title: "Learn & Prepare",
    links: [{ to: "/learn", label: "Learning Hub", icon: "📚" }],
  },
  {
    title: "AI Tools",
    links: [{ to: "/ai-analysis", label: "AI Analysis", icon: "✨" }],
  },
  {
    title: "Insights",
    links: [{ to: "/github", label: "GitHub & LinkedIn", icon: "🐙" }],
  },
  {
    title: "Admin",
    adminOnly: true,
    links: [{ to: "/admin", label: "Admin Panel", icon: "🛡️" }],
  },
];

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const visibleGroups = groups.filter(
    (g) => !g.adminOnly || user?.role === "admin"
  );

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-5 py-5 border-b border-slate-800">
          <p className="text-xl font-bold">
            Dev<span className="text-blue-500">Track</span>
          </p>
          <p className="text-xs text-slate-400">Career intelligence</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {visibleGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={linkClass}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full bg-slate-800 hover:bg-red-600 py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;