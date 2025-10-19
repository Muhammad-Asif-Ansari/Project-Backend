import express from "express";
import user from "./user.js";
import userRouter from "./userRoutes.js";
import fileRoutes from "./fileRoutes.js";
import aiRoutes from "./aiRoutes.js";
import vitalsRoutes from "./vitalsRoutes.js";
const router = express.Router()

router.use("/auth",user)

router.use("/user",userRouter)

router.use("/vitals", vitalsRoutes);


router.use("/file", fileRoutes);

router.use("/ai", aiRoutes);

router.use("/vitals", vitalsRoutes);


export default router