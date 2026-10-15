import express from "express";
import { getMyTracker, toggleMyTopic } from "../controllers/trackerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyTracker);
router.post("/toggle", protect, toggleMyTopic);

export default router;