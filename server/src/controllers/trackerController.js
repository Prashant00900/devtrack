import { getTracker, toggleTopic } from "../services/trackerService.js";

// GET /api/tracker?tzOffset=-330
export const getMyTracker = async (req, res) => {
  try {
    const raw = Number(req.query.tzOffset);
    const offsetMin = Number.isFinite(raw) ? raw : 0;

    const data = await getTracker(req.user._id, offsetMin);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tracker/toggle
export const toggleMyTopic = async (req, res) => {
  try {
    const { topicId } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: "topicId is required" });
    }

    const result = await toggleTopic(req.user._id, topicId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};