import Profile from "../models/Profile.js";
import UserSkill from "../models/UserSkill.js";

export const buildGapReport = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate({
    path: "targetRole",
    populate: { path: "requiredSkills.skill" },
  });

  const role = profile?.targetRole;
  if (!role) return null;

  const userSkills = await UserSkill.find({ user: userId });
  const levelBySkillId = {};
  userSkills.forEach((us) => {
    levelBySkillId[us.skill.toString()] = us.level;
  });

  const strong = [];
  const weak = [];
  const missing = [];
  let earned = 0;
  let total = 0;

  role.requiredSkills.forEach((rs) => {
    if (!rs.skill) return;

    const userLevel = levelBySkillId[rs.skill._id.toString()] || 0;
    const weight = rs.importance === "must" ? 2 : 1;
    const score = Math.min(userLevel / rs.minLevel, 1);

    earned += score * weight;
    total += weight;

    const item = {
      skillId: rs.skill._id,
      name: rs.skill.name,
      category: rs.skill.category,
      userLevel,
      minLevel: rs.minLevel,
      importance: rs.importance,
    };

    if (userLevel >= rs.minLevel) strong.push(item);
    else if (userLevel > 0) weak.push(item);
    else missing.push(item);
  });

  const matchPercentage = total ? Math.round((earned / total) * 100) : 0;

  return {
    role: { id: role._id, title: role.title, description: role.description },
    matchPercentage,
    totalRequired: role.requiredSkills.length,
    strong,
    weak,
    missing,
  };
};

export const buildRoadmap = (report) => {
  const items = [
    ...report.missing.map((s) => ({ ...s, type: "learn" })),
    ...report.weak.map((s) => ({ ...s, type: "improve" })),
  ];

  const rank = (s) => (s.importance === "must" ? 0 : 1) * 10 + (s.type === "learn" ? 0 : 1);
  items.sort((a, b) => rank(a) - rank(b));

  return items.map((s, index) => {
    const query =
      s.type === "learn"
        ? `${s.name} full course for beginners`
        : `${s.name} advanced concepts and projects`;

    return {
      order: index + 1,
      skillId: s.skillId,
      skillName: s.name,
      category: s.category,
      type: s.type,
      importance: s.importance,
      fromLevel: s.userLevel,
      toLevel: s.minLevel,
      title: s.type === "learn" ? `Learn ${s.name}` : `Improve ${s.name}`,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    };
  });
};