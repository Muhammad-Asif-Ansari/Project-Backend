import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true }, // Cloudinary or Firebase file URL
    filename: { type: String, required: true },
    mimetype: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
