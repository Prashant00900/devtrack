import express from "express";
import { getGapAnalysis, getRoadmap } from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/gap", protect, getGapAnalysis);
router.get("/roadmap", protect, getRoadmap);

export default router;