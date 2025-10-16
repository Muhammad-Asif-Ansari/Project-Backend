import 'dotenv/config';
import { UserData } from "../models/user.js";
import { sendResetEmail } from "../helpers/sendEmail.js";
import bcrypt from "bcrypt";

// 📌 STEP 1: SEND OTP to email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Forgot Password Request:", req.body);

    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry (5 minutes)
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send email with OTP
    await sendResetEmail(email, otp);

    console.log(`📨 OTP (${otp}) sent to: ${email}`);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 📌 STEP 2: VERIFY OTP and RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("🔸 Reset Password Body:", req.body);

    // Basic validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiry
    if (user.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields after successful reset
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    console.log(`✅ Password successfully reset for ${email}`);
    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
