import { generateAnalysis } from "../services/aiAnalysisService.js";

// POST /api/ai/analysis
export const createAnalysis = async (req, res) => {
  try {
    const result = await generateAnalysis(req.user._id);
    res.json({ ...result, generatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};