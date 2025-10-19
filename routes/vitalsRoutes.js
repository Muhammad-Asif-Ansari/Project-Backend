import express from "express";
import { addVitals, getVitals, updateVitals, deleteVitals } from "../controllers/vitalsController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, addVitals);
router.get("/", verifyToken, getVitals);
router.put("/:id", verifyToken, updateVitals);
router.delete("/:id", verifyToken, deleteVitals);

export default router;
