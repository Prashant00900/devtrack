import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3">
        <p className="text-lg font-bold">
          Dev<span className="text-blue-500">Track</span>
        </p>
        <button
          onClick={() => setOpen(true)}
          className="text-2xl leading-none px-2"
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="lg:pl-64">
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;