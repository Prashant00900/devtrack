import express from "express";
import { getMap, syncSkills } from "../controllers/projectSkillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMap);
router.post("/sync", protect, syncSkills);

export default router;