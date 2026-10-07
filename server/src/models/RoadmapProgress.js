import mongoose from "mongoose";

const roadmapProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
  },
  { timestamps: true }
);

roadmapProgressSchema.index({ user: 1, skill: 1 }, { unique: true });

const RoadmapProgress = mongoose.model("RoadmapProgress", roadmapProgressSchema);

export default RoadmapProgress;