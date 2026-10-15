import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["hr", "technical"], required: true },
    roleTitle: { type: String, default: "" },
    questionCount: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    report: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;