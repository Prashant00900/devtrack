import {
  getProjectSkillMap,
  syncSkillsFromProjects,
} from "../services/projectSkillService.js";

// GET /api/project-skills
export const getMap = async (req, res) => {
  try {
    const items = await getProjectSkillMap(req.user._id);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/project-skills/sync
export const syncSkills = async (req, res) => {
  try {
    const result = await syncSkillsFromProjects(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};