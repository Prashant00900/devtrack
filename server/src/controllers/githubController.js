import Profile from "../models/Profile.js";
import { getGithubSummary } from "../services/githubService.js";

// GET /api/github/summary
export const getMyGithubSummary = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const username = profile?.githubUsername?.trim();

    if (!username) {
      return res
        .status(400)
        .json({ message: "Pehle Profile page par GitHub username daalo" });
    }

    const summary = await getGithubSummary(username);
    res.json({ summary });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};