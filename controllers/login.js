import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { UserData } from "../models/user.js"
import joi from "joi"
import transporter from "../helpers/sendEmail.js"
const userValidationSchema = joi.object({
    email: joi.string().required().email().pattern(new RegExp("@gmail\\.com$")),
    password: joi.string().required().min(6).max(15),
})

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("📩 Login Request Received:", req.body);

        if (!(email && password)) {
            return res.status(400).send({ status: 400, message: "Email or Password Required" });
        }

        await userValidationSchema.validateAsync(req.body);
        console.log("✅ Validation passed");

        const existedUser = await UserData.findOne({ email });
        if (!existedUser) {
            return res.status(401).json({ status: 401, message: "User Not found!" });
        }
        console.log("✅ User found:", existedUser.email);

        const passwordCompare = await bcrypt.compare(password, existedUser.password);
        if (!passwordCompare) {
            return res.status(401).send({ status: 401, message: "Incorrect Password!" });
        }
        console.log("✅ Password matched");

        const loggedInUser = await UserData.findById(existedUser._id).select("-password");

        console.log("✅ Preparing to send login email...");
        await transporter.sendMail({
            from: `Muhammad Asif Ansari ${process.env.EMAIL_USER}`,
            to: existedUser.email,
            subject: "Login Notification ✅",
            text: `Hi ${existedUser.username},

You have successfully logged in to your account.

If this wasn't you, please secure your account immediately.

Best regards,  
Muhammad Asif Ansari`,
        });
        console.log("✅ Login email sent");

        const token = jwt.sign(
            { _id: existedUser._id, email: existedUser.email, username: existedUser.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        console.log("✅ Token created");

        delete existedUser.password;
        return res.status(201).send({
            status: 200,
            message: "User Login Successfully!",
            data: loggedInUser,
            token,
        });

    } catch (error) {
        console.error("🔥 Login Error:", error);
        return res.status(500).send({ status: 500, message: error.message });
    }
};


// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         if (!(email && password)) {
//             return res.status(400).send({ status: 400, message: "Email or Password Required" })
//         }
//         await userValidationSchema.validateAsync(req.body);
//         const existedUser = await UserData.findOne({ email })
//         if (!existedUser) {
//             return res.status(401).json({ status: 401, message: "User Not found!", })
//         }
//         const passwordCompare = await bcrypt.compare(password, existedUser.password)
//         if (!passwordCompare) {
//             return res.status(401).send({ status: 401, message: "Incorrect Password!", })
//         }
//         const loggedInUser = await UserData.findById(existedUser._id).select(
//             "-password"
//         );

//         // console.log(loggedInUser);
// await transporter.sendMail({
//   from: `Muhammad Asif Ansari ${process.env.EMAIL_USER}`,
//   to: existedUser.email, // logged in user
//   subject: "Login Notification ✅",
//   text: `Hi ${existedUser.username},

// You have successfully logged in to your account.

// If this wasn't you, please secure your account immediately.

// Best regards,  
// Muhammad Asif Ansari`
// });

//         const token = jwt.sign({ _id: existedUser._id, email: existedUser.email,username:existedUser.username}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

//         delete existedUser.password
//         return res.status(201).send({ status: 200, message: "User Login Successfully!", data: loggedInUser, token: token})

//      } catch (error) {
//         return res.status(500).send({ status: 500, message: error.message })

//     }
// }


export default loginUser