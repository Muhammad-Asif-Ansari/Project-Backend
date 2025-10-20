import cloudinary from "../helpers/cloudinary.js";
import { File } from "../models/file.js";
import multer from "multer";

const storage = multer.memoryStorage(); // ✅ memory storage for Vercel
const upload = multer({ storage });

export const uploadFile = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      // Convert buffer to base64 string
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload directly to Cloudinary
      const result = await cloudinary.uploader.upload(fileStr, {
        resource_type: "auto",
      });

      // Save file info to DB
      const newFile = await File.create({
        userId: req.user?._id || null,
        url: result.secure_url,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      res.json({
        success: true,
        message: "File uploaded successfully",
        fileId: newFile._id,
        data: newFile,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
];
            res.json({
                success: true,
                message: "File uploaded successfully",
                fileId: newFile._id,
                data: newFile,
            });
        } catch (error) {
            console.error("❌ Upload error:", error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    },
];
