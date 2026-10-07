import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    headline: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    collegeOrCompany: { type: String, trim: true, default: "" },
    experienceLevel: {
      type: String,
      enum: ["student", "fresher", "junior", "mid", "senior"],
      default: "student",
    },
    location: { type: String, trim: true, default: "" },
    githubUsername: { type: String, trim: true, default: "" },
    linkedinUrl: { type: String, trim: true, default: "" },
    targetRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;