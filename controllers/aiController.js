import { GoogleGenerativeAI } from "@google/generative-ai";
import { File } from "../models/file.js";
import { AiInsight } from "../models/aiInsight.js"; // ✅ filename lowercase rakho (same as model file)
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeReport = async (req, res) => {
  try {
    // ✅ fileId body ya query dono se le lo
    const fileId = req.body.fileId || req.query.fileId;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "fileId is required" });
    }

    // 1️⃣ File find karo
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    console.log("🔗 Analyzing file:", file.url);

    // 2️⃣ Gemini model select
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3️⃣ Prompt
    const prompt = `
    Analyze this medical report (URL: ${file.url})
    1. Explain findings in simple English and Roman Urdu.
    2. Highlight abnormal values (if any).
    3. Suggest 3–5 questions to ask the doctor.
    4. Give basic diet or lifestyle advice.
    5. End with: "Always consult your doctor before making any decision."
    `;

    // 4️⃣ Gemini ko request bhejna
    const result = await model.generateContent([
      { text: prompt },
      { fileData: { mimeType: file.mimetype, fileUri: file.url } },
    ]);

    const aiSummary = result?.response?.text() || "No summary generated.";

    // 5️⃣ Database me save karna
    const aiData = await AiInsight.create({
      userId: req.user?._id || null,
      fileId: file._id,
      summary: aiSummary,
    });

    // 6️⃣ Response
    res.json({
      success: true,
      message: "✅ AI Summary generated successfully",
      data: aiData,
    });
  } catch (error) {
    console.error("❌ AI Analysis Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
