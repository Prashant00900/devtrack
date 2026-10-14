import Resource from "../models/Resource.js";

// GET /api/resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("skill")
      .sort({ createdAt: 1 });

    res.json({ resources: resources.filter((r) => r.skill) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};