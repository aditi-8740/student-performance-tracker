import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["teacher", "student", "admin"],
      default: "student",
      required: true,
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      default: null,
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordTokenHash: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
