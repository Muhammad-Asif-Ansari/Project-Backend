import cloudinary from "../helpers/cloudinary.js";
import { File } from "../models/file.js";
import multer from "multer";

// ✅ Use memory storage for Vercel (no file system)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadFile = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Convert buffer to base64 string
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload directly to Cloudinary
      const result = await cloudinary.uploader.upload(fileStr, {
        resource_type: "auto",
      });

      // Save file info to MongoDB
      const newFile = await File.create({
        userId: req.user?._id || null,
        url: result.secure_url,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      // ✅ Success response
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        fileId: newFile._id,
        data: newFile,
      });
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
];
