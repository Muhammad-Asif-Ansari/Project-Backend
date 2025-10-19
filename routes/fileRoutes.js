import express from "express";
import { uploadFile } from "../controllers/fileController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/upload", verifyToken, uploadFile);

export default router;
