import {
  cleanHistory,
  getNextQuestion,
  buildReport,
  getSessionHistory,
} from "../services/interviewService.js";

const TYPES = ["hr", "technical"];

// POST /api/interview/next
export const nextQuestion = async (req, res) => {
  try {
    const { type } = req.body;

    if (!TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid interview type" });
    }

    const total = Math.min(10, Math.max(3, Number(req.body.total) || 5));
    const history = cleanHistory(req.body.history);

    if (history.length >= total) {
      return res.status(400).json({ message: "Interview ke saare sawaal ho chuke hain" });
    }

    const result = await getNextQuestion(req.user._id, type, total, history);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// POST /api/interview/report
export const createReport = async (req, res) => {
  try {
    const { type } = req.body;

    if (!TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid interview type" });
    }

    const history = cleanHistory(req.body.history);
    if (history.length === 0) {
      return res.status(400).json({ message: "Koi jawab nahi mila" });
    }

    const report = await buildReport(req.user._id, type, history);
    res.json({ report });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// GET /api/interview/history
export const getHistory = async (req, res) => {
  try {
    const sessions = await getSessionHistory(req.user._id);
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};