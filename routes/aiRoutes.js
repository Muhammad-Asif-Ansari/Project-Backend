import express from "express";
import { analyzeReport } from "../controllers/aiController.js";
const router = express.Router();

// Agar JWT middleware hai to use yahan lagao

// import { authMiddleware } from "../middleware/auth.js";
// router.post("/analyze", authMiddleware, analyzeReport);

router.post("/analyze", analyzeReport);

export default router;
