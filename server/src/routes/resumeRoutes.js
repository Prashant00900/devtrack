import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "PDF 2MB se chhoti honi chahiye"
            : err.message,
      });
    }
    next();
  });
};

router.post("/analyze", protect, uploadResume, analyzeResume);

export default router;