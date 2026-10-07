import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: "" },
    requiredSkills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        minLevel: { type: Number, min: 1, max: 5, default: 3 },
        importance: {
          type: String,
          enum: ["must", "good"],
          default: "must",
        },
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;