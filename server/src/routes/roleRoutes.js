import express from "express";
import {
  getAllRoles,
  getMyTargetRole,
  setMyTargetRole,
} from "../controllers/roleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllRoles);
router.get("/target", protect, getMyTargetRole);
router.put("/target", protect, setMyTargetRole);

export default router;