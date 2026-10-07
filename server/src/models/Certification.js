import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: [true, "Name is required"], trim: true },
    issuer: { type: String, trim: true, default: "" },
    issueDate: { type: Date, default: null },
    credentialUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Certification = mongoose.model("Certification", certificationSchema);

export default Certification;