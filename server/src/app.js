import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import projectSkillRoutes from "./routes/projectSkillRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import roadmapProgressRoutes from "./routes/roadmapProgressRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DevTrack API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/project-skills", projectSkillRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/roadmap-progress", roadmapProgressRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);

export default app;