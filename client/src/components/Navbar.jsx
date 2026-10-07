import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `px-3 py-1 rounded text-sm ${isActive ? "bg-blue-600" : "hover:bg-slate-700"}`;

  return (
    <nav className="bg-slate-800 text-white">
      <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-bold text-lg mr-3">DevTrack</span>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/skills" className={linkClass}>
            Skills
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
          <NavLink to="/certifications" className={linkClass}>
            Certifications
          </NavLink>
          <NavLink to="/skill-map" className={linkClass}>
            Skill Map
          </NavLink>
          <NavLink to="/target-role" className={linkClass}>
            Target Role
          </NavLink>
          <NavLink to="/gap-analysis" className={linkClass}>
            Gap Analysis
          </NavLink>
          <NavLink to="/roadmap" className={linkClass}>
            Roadmap
          </NavLink>
          <NavLink to="/github" className={linkClass}>
            GitHub
          </NavLink>
          <NavLink to="/ai-analysis" className={linkClass}>
            AI Analysis
          </NavLink>
          <NavLink to="/promotion" className={linkClass}>
            Promotion
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">{user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;