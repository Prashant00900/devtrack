import express from "express";
import {
  nextQuestion,
  createReport,
  getHistory,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { aiLimit } from "../middleware/aiLimit.js";

const router = express.Router();

router.post("/next", protect, aiLimit, nextQuestion);
router.post("/report", protect, aiLimit, createReport);
router.get("/history", protect, getHistory);

export default router;