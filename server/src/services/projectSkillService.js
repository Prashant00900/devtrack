import Project from "../models/Project.js";
import UserSkill from "../models/UserSkill.js";

// 1 project mein use hui skill = level 2, 2+ projects = level 3
const levelFromCount = (count) => (count >= 2 ? 3 : 2);

export const getProjectSkillMap = async (userId) => {
  const projects = await Project.find({ user: userId }).populate("techStack");
  const userSkills = await UserSkill.find({ user: userId });
  const ownedIds = new Set(userSkills.map((us) => us.skill.toString()));

  const map = {};

  projects.forEach((project) => {
    project.techStack.forEach((skill) => {
      if (!skill) return;
      const id = skill._id.toString();

      if (!map[id]) {
        map[id] = {
          skillId: skill._id,
          name: skill.name,
          category: skill.category,
          projectCount: 0,
          projects: [],
          inMySkills: ownedIds.has(id),
        };
      }

      map[id].projectCount += 1;
      map[id].projects.push(project.title);
    });
  });

  return Object.values(map)
    .map((item) => ({
      ...item,
      suggestedLevel: levelFromCount(item.projectCount),
    }))
    .sort(
      (a, b) => b.projectCount - a.projectCount || a.name.localeCompare(b.name)
    );
};

export const syncSkillsFromProjects = async (userId) => {
  const items = await getProjectSkillMap(userId);
  const toAdd = items.filter((item) => !item.inMySkills);

  for (const item of toAdd) {
    await UserSkill.updateOne(
      { user: userId, skill: item.skillId },
      { $setOnInsert: { level: item.suggestedLevel, source: "project" } },
      { upsert: true }
    );
  }

  return { added: toAdd.map((item) => item.name) };
};