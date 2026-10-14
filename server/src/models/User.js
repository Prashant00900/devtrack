import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Google se bane users ka password nahi hota
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "Password is required",
      ],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["developer", "mentor", "admin"],
      default: "developer",
    },
    mode: {
      type: String,
      enum: ["student", "employee"],
      default: "student",
    },
  },
  { timestamps: true }
);

// Save hone se pehle password hash karo
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Login ke time password compare karne ke liye
userSchema.methods.matchPassword = function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;