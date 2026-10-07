import mongoose from "mongoose";

const userSkillSchema = new mongoose.Schema(
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
    level: { type: Number, min: 1, max: 5, default: 1 },
    source: {
      type: String,
      enum: ["manual", "project", "github"],
      default: "manual",
    },
  },
  { timestamps: true }
);

// Ek user ek skill sirf ek baar add kar sake
userSkillSchema.index({ user: 1, skill: 1 }, { unique: true });

const UserSkill = mongoose.model("UserSkill", userSkillSchema);

export default UserSkill;