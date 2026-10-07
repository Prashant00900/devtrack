import express from "express";
import { getReadiness } from "../controllers/promotionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/readiness", protect, getReadiness);

export default router;