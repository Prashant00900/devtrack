import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, trim: true, default: "" },
    techStack: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    githubUrl: { type: String, trim: true, default: "" },
    liveUrl: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;