import mongoose from "mongoose";

const topicProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicId: { type: String, required: true },
  },
  { timestamps: true }
);

topicProgressSchema.index({ user: 1, topicId: 1 }, { unique: true });

const TopicProgress = mongoose.model("TopicProgress", topicProgressSchema);

export default TopicProgress;