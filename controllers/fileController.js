import cloudinary from "../helpers/cloudinary.js";
import { File } from "../models/file.js";
import multer from "multer";
import fs from "fs";

// Local upload temp storage (ensure 'uploads' folder exists)
const upload = multer({ dest: "uploads/" });

export const uploadFile = [
    upload.single("file"),
    async (req, res) => {
        try {
            console.log("📂 File received:", req.file); // Debugging

            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
            });

            console.log("✅ Uploaded to Cloudinary:", result.secure_url);

            // Create DB entry
            const newFile = await File.create({
                userId: req.user?._id || null, // avoid crash if user missing
                url: result.secure_url,
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
            });

            // Delete local temp file
            fs.unlinkSync(req.file.path);

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
