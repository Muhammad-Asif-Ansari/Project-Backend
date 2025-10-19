import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    summary: { type: String, required: true },
    urduExplanation: { type: String },
    doctorQuestions: [{ type: String }],
    dietAdvice: { type: String }, // optional - for Gemini suggestions
  },
  { timestamps: true }
);

export const AiInsight = mongoose.model("AiInsight", aiInsightSchema);
