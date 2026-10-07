import express from "express";
import { toggleProgress } from "../controllers/roadmapProgressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", protect, toggleProgress);

export default router;