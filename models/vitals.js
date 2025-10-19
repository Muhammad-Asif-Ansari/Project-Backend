import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodPressure: { type: String },
    sugarLevel: { type: String },
    weight: { type: String },
  },
  { timestamps: true }
);

export const Vitals = mongoose.model("Vitals", vitalsSchema);
