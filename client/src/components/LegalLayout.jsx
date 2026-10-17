import { Link } from "react-router-dom";

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <div className="space-y-2 text-slate-300">{children}</div>
    </section>
  );
}

function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white">
            Dev<span className="text-blue-500">Track</span>
          </Link>
          <Link to="/login" className="text-sm text-slate-400 hover:text-white">
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">Last updated: {updated}</p>
        <div className="mt-8 space-y-7 text-sm leading-relaxed">{children}</div>
      </main>
    </div>
  );
}

export default LegalLayout;