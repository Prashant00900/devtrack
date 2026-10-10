function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-white">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900">
        <p className="text-2xl font-bold">DevTrack</p>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Know your skills.
            <br />
            Close your gaps.
            <br />
            Land the role.
          </h2>
          <p className="mt-4 text-blue-100 max-w-md">
            Track your skills, projects and GitHub activity in one place, and get a clear plan for your target role.
          </p>

          <ul className="mt-8 space-y-3 text-blue-50">
            <li className="flex items-center gap-3">
              <span>📈</span> Skill gap analysis for your target role
            </li>
            <li className="flex items-center gap-3">
              <span>🧭</span> Personalised learning roadmap
            </li>
            <li className="flex items-center gap-3">
              <span>🐙</span> GitHub insights and project mapping
            </li>
            <li className="flex items-center gap-3">
              <span>🚀</span> Promotion readiness score
            </li>
          </ul>
        </div>

        <p className="text-sm text-blue-200">Built with the MERN stack</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <p className="lg:hidden text-2xl font-bold text-center mb-8">
            Dev<span className="text-blue-500">Track</span>
          </p>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-slate-400 mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;