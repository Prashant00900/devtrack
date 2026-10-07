import express from "express";
import {
  getMyCertifications,
  addCertification,
  deleteCertification,
} from "../controllers/certificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyCertifications);
router.post("/", protect, addCertification);
router.delete("/:id", protect, deleteCertification);

export default router;