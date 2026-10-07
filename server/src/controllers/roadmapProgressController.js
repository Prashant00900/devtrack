import RoadmapProgress from "../models/RoadmapProgress.js";

// POST /api/roadmap-progress/toggle
export const toggleProgress = async (req, res) => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({ message: "skillId is required" });
    }

    const existing = await RoadmapProgress.findOne({
      user: req.user._id,
      skill: skillId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ done: false });
    }

    await RoadmapProgress.create({ user: req.user._id, skill: skillId });
    res.json({ done: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};