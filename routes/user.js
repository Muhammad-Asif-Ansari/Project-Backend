import express from "express";
import  {resetPassword,
    forgotPassword,
    loginUser,
    createUser,
} from "../controllers/index.js"
const router = express.Router()

router.post("/createUser",createUser)

router.post("/loginUser",loginUser)

router.post("/forgot-password",forgotPassword)

router.post("/reset-password",resetPassword)


export default router