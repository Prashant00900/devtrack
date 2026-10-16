import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail, emailConfigured } from "../services/emailService.js";

const RESET_MINUTES = 15;
const FORGOT_MESSAGE =
  "If this email is registered, a password reset link has been sent. Please check your spam folder too.";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  mode: user.mode,
  avatar: user.avatar || "",
});

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account was created with Google. Use 'Continue with Google', or use 'Forgot password' to set a password.",
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google login is not configured on the server" });
    }

    // Google ka token backend par verify hota hai, frontend par bharosa nahi karte
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    const email = payload.email.toLowerCase();

    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

    if (!user) {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        avatar: payload.picture || "",
      });
    } else if (!user.googleId) {
      // Pehle se password wala account hai, uspar Google jod do
      user.googleId = payload.sub;
      if (!user.avatar && payload.picture) user.avatar = payload.picture;
      await user.save();
    }

    res.json({
      token: generateToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(401).json({ message: "Google login failed. Please try again." });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      await User.updateOne(
        { _id: user._id },
        {
          resetPasswordToken: hashToken(token),
          resetPasswordExpires: new Date(Date.now() + RESET_MINUTES * 60 * 1000),
        }
      );

      const base = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
      const link = `${base}/reset-password/${token}`;

      if (!emailConfigured() && process.env.NODE_ENV !== "production") {
        // Local testing: email set nahi hai to link terminal mein dikhao
        console.log("Password reset link (email is not configured):", link);
      } else {
        // await nahi kiya, taaki response ka time same rahe (email exist karta hai ya nahi, pata na chale)
        sendEmail({
          to: user.email,
          subject: "Reset your DevTrack password",
          text: `Hi ${user.name},\n\nUse this link to reset your DevTrack password. It works for ${RESET_MINUTES} minutes and only once:\n${link}\n\nIf you did not ask for this, you can ignore this email.`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#111">
              <h2>Reset your DevTrack password</h2>
              <p>Hi ${user.name},</p>
              <p>Click the button below to set a new password. The link works for ${RESET_MINUTES} minutes and only once.</p>
              <p><a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Reset password</a></p>
              <p style="font-size:13px;color:#555">Or paste this link in your browser:<br>${link}</p>
              <p style="font-size:13px;color:#555">If you did not ask for this, you can ignore this email.</p>
            </div>`,
        }).catch((err) => console.error("Reset email failed:", err.message));
      }
    }

    // Hamesha same jawab, taaki koi ye na jaan sake ki email registered hai ya nahi
    res.json({ message: FORGOT_MESSAGE });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: hashToken(String(token)),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res
        .status(400)
        .json({ message: "This reset link is invalid or has expired. Please request a new one." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Your password has been changed. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};