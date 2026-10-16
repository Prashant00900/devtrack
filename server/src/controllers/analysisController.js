import { buildGapReport, buildRoadmap } from "../services/gapAnalysisService.js";
import RoadmapProgress from "../models/RoadmapProgress.js";

// GET /api/analysis/gap
export const getGapAnalysis = async (req, res) => {
  try {
    const report = await buildGapReport(req.user._id);
    if (!report) {
      return res.status(400).json({ message: "Please select a Target Role first" });
    }
    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analysis/roadmap
export const getRoadmap = async (req, res) => {
  try {
    const [report, progress] = await Promise.all([
      buildGapReport(req.user._id),
      RoadmapProgress.find({ user: req.user._id }),
    ]);

    if (!report) {
      return res.status(400).json({ message: "Please select a Target Role first" });
    }

    const doneIds = new Set(progress.map((p) => p.skill.toString()));
    const roadmap = buildRoadmap(report).map((item) => ({
      ...item,
      done: doneIds.has(item.skillId.toString()),
    }));

    res.json({
      role: report.role,
      matchPercentage: report.matchPercentage,
      roadmap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};