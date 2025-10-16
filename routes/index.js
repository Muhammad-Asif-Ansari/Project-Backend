import express from "express";
import user from "./user.js";
import userRouter from "./userRoutes.js";
const router = express.Router()

router.use("/auth",user)

router.use("/user",userRouter)

export default router