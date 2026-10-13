import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "📈",
    title: "Skill Gap Analysis",
    desc: "Compare your skills with your target role and see what is strong, weak and missing.",
    tint: "bg-blue-500/15",
  },
  {
    icon: "🧭",
    title: "Learning Roadmap",
    desc: "An ordered plan of what to learn first, with progress tracking you can tick off.",
    tint: "bg-green-500/15",
  },
  {
    icon: "🐙",
    title: "GitHub & LinkedIn",
    desc: "Your repos, languages and weekly activity from GitHub, plus your LinkedIn profile.",
    tint: "bg-purple-500/15",
  },
  {
    icon: "🗺️",
    title: "Project-to-Skill Map",
    desc: "Skills used in your projects are mapped to your profile in one click.",
    tint: "bg-orange-500/15",
  },
  {
    icon: "🚀",
    title: "Promotion Readiness",
    desc: "See how ready you are for the next level, from Student all the way to Senior.",
    tint: "bg-pink-500/15",
  },
  {
    icon: "✨",
    title: "AI Career Analysis",
    desc: "A summary, strengths, next steps, project ideas and interview tips for your goal.",
    tint: "bg-teal-500/15",
  },
];

const shots = [
  {
    label: "Dashboard",
    title: "Dashboard",
    desc: "Your skills, projects and role match at a glance, with a next step.",
    src: "/screenshots/dashboard.png",
  },
  {
    label: "Gap Analysis",
    title: "Skill Gap Analysis",
    desc: "A role-match score with strong, weak and missing skills.",
    src: "/screenshots/gap-analysis.png",
  },
  {
    label: "Roadmap",
    title: "Learning Roadmap",
    desc: "A prioritised plan with progress tracking.",
    src: "/screenshots/roadmap.png",
  },
  {
    label: "GitHub",
    title: "GitHub & LinkedIn",
    desc: "Repos, languages and activity from your public profiles.",
    src: "/screenshots/github.png",
  },
];

const steps = [
  {
    icon: "👤",
    title: "Sign up free",
    desc: "Create your account in seconds. No credit card needed.",
  },
  {
    icon: "🛠️",
    title: "Add skills and pick a role",
    desc: "Rate your skills from 1 to 5 and choose the role you are aiming for.",
  },
  {
    icon: "🎯",
    title: "Get your plan",
    desc: "See your match score, your gaps and a roadmap of what to learn next.",
  },
];

const stack = [
  "React",
  "Vite",
  "Tailwind CSS",
  "Recharts",
  "Node.js",
  "Express",
  "MongoDB",
  "JWT",
  "GitHub API",
];

const faqs = [
  {
    q: "Is DevTrack free?",
    a: "Yes. You can sign up and use every feature for free.",
  },
  {
    q: "How is the match score calculated?",
    a: "Every role has required skills with a minimum level. Each skill scores min(your level / required level, 1). Must-have skills count double, and the match is the weighted average.",
  },
  {
    q: "Do I need an API key for the AI analysis?",
    a: "No. The analysis works out of the box with a built-in rule-based engine. When an AI API key is configured on the server, it upgrades to AI-written advice.",
  },
  {
    q: "Which roles are supported?",
    a: "Frontend Developer, Backend Developer, MERN Stack Developer and Full Stack Developer. More roles can be added.",
  },
  {
    q: "Why is the first load slow?",
    a: "The backend runs on a free hosting plan that goes to sleep when nobody uses it. The first request can take up to a minute, after that it is fast.",
  },
];

const exampleRows = [
  { name: "React", level: 4, min: 4, color: "bg-green-500", text: "text-green-400" },
  { name: "Node.js", level: 2, min: 4, color: "bg-yellow-500", text: "text-yellow-400" },
  { name: "MongoDB", level: 0, min: 4, color: "bg-red-500", text: "text-red-400" },
];

function Landing() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % shots.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const gradientText =
    "bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent";

  const cardClass = "bg-white/[0.03] border border-white/10 rounded-2xl";

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -left-40 w-[28rem] h-[28rem] bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              D
            </span>
            <span className="text-lg font-bold">
              Dev<span className="text-blue-500">Track</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <button onClick={() => scrollTo("features")} className="hover:text-white">
              Features
            </button>
            <button onClick={() => scrollTo("demo")} className="hover:text-white">
              Demo
            </button>
            <button onClick={() => scrollTo("faq")} className="hover:text-white">
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-300 hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center px-4 sm:px-6 pt-20 pb-16">
          <span className="inline-flex items-center gap-2 border border-white/15 bg-white/5 rounded-full px-4 py-1.5 text-sm text-slate-300">
            ⭐ Developer Career Intelligence Platform
          </span>

          <h1 className="mt-8 text-4xl sm:text-6xl font-bold leading-tight">
            Know your skills.
            <br />
            Close your gaps.
            <br />
            <span className={gradientText}>Land the role.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Track your skills, projects and GitHub activity in one place. DevTrack compares
            you with your target role and tells you exactly what to learn next.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition"
            >
              {user ? "Open Dashboard →" : "Start Free →"}
            </Link>
            <button
              onClick={() => scrollTo("features")}
              className="border border-white/15 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              ▶ Explore Features
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "13", label: "Features" },
              { value: "100%", label: "Free to use" },
              { value: "1-5", label: "Skill levels" },
              { value: "Live", label: "GitHub data" },
            ].map((s) => (
              <div key={s.label} className={`${cardClass} py-6`}>
                <p className={`text-3xl font-bold ${gradientText}`}>{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything you need to <span className={gradientText}>grow</span>
            </h2>
            <p className="text-slate-400 mt-3">
              Built for students and working developers who want a clear career plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className={`${cardClass} p-6 hover:border-blue-500/50 hover:-translate-y-1 transition`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${f.tint}`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mt-4">{f.title}</h3>
                <p className="text-slate-400 text-sm mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">
              See it in <span className={gradientText}>action</span>
            </h2>
            <p className="text-slate-400 mt-3">Real screens from the actual platform</p>
          </div>

          <div
            className={`${cardClass} overflow-hidden`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-400">devtrack-xi-gray.vercel.app</span>
            </div>

            <img
              key={shots[active].src}
              src={shots[active].src}
              alt={shots[active].title}
              className="w-full block"
            />

            <div className="px-5 py-4 border-t border-white/10">
              <p className="font-semibold">{shots[active].title}</p>
              <p className="text-sm text-slate-400">{shots[active].desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {shots.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setActive(i)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  i === active
                    ? "border-blue-500 bg-blue-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Get started in <span className={gradientText}>3 simple steps</span>
            </h2>
            <p className="text-slate-400 mt-3">From sign up to a clear plan in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/80 flex items-center justify-center text-3xl">
                  {s.icon}
                </div>
                <p className="mt-4 text-xs font-semibold tracking-widest text-blue-400">
                  STEP 0{i + 1}
                </p>
                <h3 className="text-lg font-semibold mt-1">{s.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Score explainer */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                How your <span className={gradientText}>match score</span> works
              </h2>
              <p className="text-slate-400 mt-4">
                Every role lists the skills it needs and the minimum level for each. DevTrack
                scores every skill from 0 to 1 and gives must-have skills double weight.
              </p>
              <p className="mt-4 text-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-slate-300">
                score = min(your level / required level, 1)
              </p>
              <p className="text-slate-400 text-sm mt-4">
                Skills at the required level are <span className="text-green-400">strong</span>,
                below it <span className="text-yellow-400">weak</span>, and skills you do not
                have are <span className="text-red-400">missing</span>. They go straight into
                your roadmap.
              </p>
            </div>

            <div className={`${cardClass} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400">Example · MERN Developer</p>
                  <p className="text-sm text-slate-300">Role match</p>
                </div>
                <p className="text-4xl font-bold text-yellow-400">50%</p>
              </div>

              <div className="space-y-3">
                {exampleRows.map((r) => (
                  <div
                    key={r.name}
                    className="bg-slate-950/60 border border-white/10 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>{r.name}</span>
                      <span className={`font-semibold ${r.text}`}>
                        {r.level}/{r.min}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full ${r.color}`}
                        style={{ width: `${(r.level / r.min) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Example with three must-have skills: (1 + 0.5 + 0) / 3 = 50%.
              </p>
            </div>
          </div>
        </section>

        {/* Built with */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built with the <span className={gradientText}>MERN stack</span>
          </h2>
          <p className="text-slate-400 mt-3">Open source and deployed on free cloud tiers</p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {stack.map((t) => (
              <span
                key={t}
                className="border border-white/10 bg-white/[0.04] rounded-full px-4 py-2 text-sm text-slate-200"
              >
                {t}
              </span>
            ))}
          </div>

          <a
            href="https://github.com/Prashant00900/devtrack"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-8 border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition"
          >
            View source on GitHub ↗
          </a>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Frequently asked <span className={gradientText}>questions</span>
            </h2>
            <p className="text-slate-400 mt-3">Everything you need to know</p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className={`${cardClass} overflow-hidden`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium"
                >
                  {f.q}
                  <span className="text-blue-400 text-xl leading-none">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-slate-400">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/25 to-indigo-600/10 text-center px-6 py-14">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to see where you stand?
            </h2>
            <p className="text-slate-300 mt-3">
              Add your skills, pick a role and get your plan in a few minutes.
            </p>
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-block mt-8 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition"
            >
              {user ? "Open Dashboard →" : "Create free account →"}
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 py-8 text-center text-sm text-slate-500">
        <p>
          DevTrack · Built by{" "}
          <a
            href="https://github.com/Prashant00900"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-white"
          >
            Prashant
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Landing;