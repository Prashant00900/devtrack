import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

const forgotLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Bahut zyada requests. 15 minute baad try karo.",
});

const resetLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Bahut zyada koshishein. 15 minute baad try karo.",
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.post("/reset-password", resetLimiter, resetPassword);
router.get("/me", protect, getMe);

export default router;