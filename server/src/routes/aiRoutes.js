import express from "express";
import { createAnalysis } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analysis", protect, createAnalysis);

export default router;