// import nodemailer from "nodemailer";
// import "dotenv/config";

// // ✅ Create transporter with proper timeout settings
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,    // Gmail ID
//     pass: process.env.EMAIL_PASS,    // Gmail App Password (not normal password!)
//   },
//   pool: true,                        // Reuse connection
//   maxConnections: 1,                 // Keep it minimal for Render free tier
//   socketTimeout: 30000,              // 30 sec timeout
//   connectionTimeout: 30000,
// });

// // ✅ Function to send OTP email
// export const sendResetEmail = async (email, otp) => {
//   try {
//     const mailOptions = {
//       from: `"Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Password Reset OTP",
//       html: `
//         <div style="font-family:Arial,sans-serif;">
//           <h2>Password Reset Request</h2>
//           <p>Use the OTP below to reset your password:</p>
//           <h1 style="letter-spacing:4px;">${otp}</h1>
//           <p>This OTP will expire in 5 minutes.</p>
//         </div>
//       `,
//     };

//     // 📨 Send email
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP sent to ${email}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//     // ⚠️ Optional: Don't crash the server if email fails
//   }
// };

// export default transporter;



import nodemailer from "nodemailer";
import "dotenv/config";

// ✅ Simple and reliable Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail ID
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your normal password!)
  },
});

// ✅ Function to send OTP email
export const sendResetEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>Password Reset Request</h2>
          <p>Use the OTP below to reset your password:</p>
          <h1 style="letter-spacing:4px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
};

export default transporter;
