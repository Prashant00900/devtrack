import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    title: { type: String, required: [true, "Title is required"], trim: true },
    url: { type: String, required: [true, "URL is required"], trim: true },
    type: {
      type: String,
      enum: ["docs", "video", "course", "article", "practice"],
      default: "docs",
    },
    isFree: { type: Boolean, default: true },
  },
  { timestamps: true }
);

resourceSchema.index({ skill: 1, url: 1 }, { unique: true });

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;