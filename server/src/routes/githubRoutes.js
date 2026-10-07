import express from "express";
import { getMyGithubSummary } from "../controllers/githubController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getMyGithubSummary);

export default router;