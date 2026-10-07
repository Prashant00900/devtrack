import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyProfile);
router.put("/", protect, updateMyProfile);

export default router;