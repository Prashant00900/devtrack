const GITHUB_API = "https://api.github.com";

const ghFetch = async (path) => {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevTrack-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`${GITHUB_API}${path}`, { headers });

  if (res.status === 404) {
    const err = new Error("GitHub user nahi mila. Username check karo.");
    err.status = 404;
    throw err;
  }

  if (res.status === 403 || res.status === 429) {
    const err = new Error("GitHub rate limit ho gayi. Thodi der baad try karo.");
    err.status = 429;
    throw err;
  }

  if (!res.ok) {
    const err = new Error("GitHub se data nahi aaya");
    err.status = 502;
    throw err;
  }

  return res.json();
};

export const getGithubSummary = async (username) => {
  const u = encodeURIComponent(username);

  const [user, repos, events] = await Promise.all([
    ghFetch(`/users/${u}`),
    ghFetch(`/users/${u}/repos?per_page=100&sort=pushed`),
    ghFetch(`/users/${u}/events/public?per_page=100`).catch(() => []),
  ]);

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const WEEK = 7 * DAY;

  const ownRepos = repos.filter((r) => !r.fork);

  // Languages
  const langCount = {};
  ownRepos.forEach((r) => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  const languages = Object.entries(langCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Top repos
  const topRepos = [...ownRepos]
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at) - new Date(a.pushed_at)
    )
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.pushed_at,
    }));

  const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

  const activeLast30Days = ownRepos.filter(
    (r) => now - new Date(r.pushed_at).getTime() <= 30 * DAY
  ).length;

  // Activity: events per week (last 6 weeks)
  const activity = Array.from({ length: 6 }, (_, i) => {
    const weeksAgo = 5 - i;
    return {
      label: weeksAgo === 0 ? "This week" : `${weeksAgo}w ago`,
      weeksAgo,
      count: 0,
    };
  });

  let eventsLast30Days = 0;
  events.forEach((e) => {
    const age = now - new Date(e.created_at).getTime();
    const weeksAgo = Math.floor(age / WEEK);
    const slot = activity.find((a) => a.weeksAgo === weeksAgo);
    if (slot) slot.count += 1;
    if (age <= 30 * DAY) eventsLast30Days += 1;
  });

  return {
    profile: {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
    },
    stats: {
      ownRepos: ownRepos.length,
      totalStars,
      activeLast30Days,
      eventsLast30Days,
    },
    languages,
    topRepos,
    activity: activity.map(({ label, count }) => ({ label, count })),
  };
};