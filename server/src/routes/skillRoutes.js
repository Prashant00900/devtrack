import express from "express";
import {
  getAllSkills,
  getMySkills,
  addMySkill,
  updateMySkill,
  deleteMySkill,
} from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllSkills);
router.get("/me", protect, getMySkills);
router.post("/me", protect, addMySkill);
router.put("/me/:id", protect, updateMySkill);
router.delete("/me/:id", protect, deleteMySkill);

export default router;