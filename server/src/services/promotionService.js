import Profile from "../models/Profile.js";
import UserSkill from "../models/UserSkill.js";
import Project from "../models/Project.js";

// Har level se agle level ke liye criteria
const TRANSITIONS = {
  student: {
    next: "fresher",
    criteria: [
      { type: "skillCount", target: 5 },
      { type: "projectsCompleted", target: 2 },
      { type: "skill", name: "Git", target: 2 },
      { type: "skill", name: "Problem Solving", target: 2 },
    ],
  },
  fresher: {
    next: "junior",
    criteria: [
      { type: "skillCount", target: 7 },
      { type: "strongSkills", target: 2 },
      { type: "projectsCompleted", target: 3 },
      { type: "skill", name: "Git", target: 3 },
      { type: "skill", name: "REST API", target: 3 },
    ],
  },
  junior: {
    next: "mid",
    criteria: [
      { type: "skillCount", target: 10 },
      { type: "strongSkills", target: 4 },
      { type: "projectsCompleted", target: 4 },
      { type: "liveProjects", target: 1 },
      { type: "categories", target: 4 },
      { type: "skill", name: "Unit Testing", target: 3 },
      { type: "skill", name: "Teamwork", target: 3 },
    ],
  },
  mid: {
    next: "senior",
    criteria: [
      { type: "skillCount", target: 14 },
      { type: "strongSkills", target: 8 },
      { type: "projectsCompleted", target: 6 },
      { type: "liveProjects", target: 2 },
      { type: "categories", target: 5 },
      { type: "skill", name: "System Design", target: 4 },
      { type: "skill", name: "Docker", target: 3 },
      { type: "skill", name: "Communication", target: 4 },
    ],
  },
  senior: { next: null, criteria: [] },
};

const describe = (criterion, current) => {
  const gap = Math.max(criterion.target - current, 0);

  switch (criterion.type) {
    case "skillCount":
      return {
        label: "Total skills",
        action: `Add ${gap} more skills`,
      };
    case "strongSkills":
      return {
        label: "Skills at level 4+",
        action: `Raise ${gap} more skills to level 4`,
      };
    case "projectsCompleted":
      return {
        label: "Completed projects",
        action: `Complete ${gap} more projects`,
      };
    case "liveProjects":
      return {
        label: "Projects with live link",
        action: `Deploy ${gap} project(s) and add a live link`,
      };
    case "categories":
      return {
        label: "Skill categories covered",
        action: `Learn skills from ${gap} new categories (for example devops, testing, database)`,
      };
    case "skill":
      return {
        label: `${criterion.name} level`,
        action: `Raise ${criterion.name} to level ${criterion.target}`,
      };
    default:
      return { label: "", action: "" };
  }
};

export const getPromotionReadiness = async (userId) => {
  const [profile, userSkills, projects] = await Promise.all([
    Profile.findOne({ user: userId }),
    UserSkill.find({ user: userId }).populate("skill"),
    Project.find({ user: userId }),
  ]);

  const currentLevel = profile?.experienceLevel || "student";
  const config = TRANSITIONS[currentLevel];

  if (!config.next) {
    return {
      currentLevel,
      nextLevel: null,
      readiness: 100,
      verdict: "top",
      criteria: [],
      actions: [],
    };
  }

  const validSkills = userSkills.filter((us) => us.skill);
  const levelByName = {};
  const categories = new Set();

  validSkills.forEach((us) => {
    levelByName[us.skill.name] = us.level;
    categories.add(us.skill.category);
  });

  const stats = {
    skillCount: validSkills.length,
    strongSkills: validSkills.filter((us) => us.level >= 4).length,
    projectsCompleted: projects.filter((p) => p.status === "completed").length,
    liveProjects: projects.filter((p) => p.liveUrl && p.liveUrl.trim()).length,
    categories: categories.size,
  };

  const criteria = config.criteria.map((criterion) => {
    const current =
      criterion.type === "skill"
        ? levelByName[criterion.name] || 0
        : stats[criterion.type];

    const { label, action } = describe(criterion, current);

    return {
      label,
      current,
      target: criterion.target,
      met: current >= criterion.target,
      action,
    };
  });

  const total = criteria.reduce(
    (sum, c) => sum + Math.min(c.current / c.target, 1),
    0
  );
  const readiness = Math.round((total / criteria.length) * 100);

  const verdict = readiness >= 80 ? "ready" : readiness >= 50 ? "almost" : "not-yet";

  return {
    currentLevel,
    nextLevel: config.next,
    readiness,
    verdict,
    criteria,
    actions: criteria.filter((c) => !c.met).map((c) => c.action),
  };
};