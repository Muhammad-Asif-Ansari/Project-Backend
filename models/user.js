import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // ✅ OTP aur reset password fields
  resetOTP: {
    type: String, // 6-digit OTP
  },
  resetOTPExpiry: {
    type: Date, // OTP expiry
  },
  resetToken: {
    type: String, // optional, future use
  },
  resetTokenExpiry: {
    type: Date, // optional
  },
}, { timestamps: true });

export const UserData = mongoose.model("UserData", UserSchema);
