import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Profile Accessed",
    user: req.user
  });
});

export default userRouter;
