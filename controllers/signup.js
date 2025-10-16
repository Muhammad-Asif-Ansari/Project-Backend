// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import joi from "joi";
// import transporter from "../helpers/sendEmail.js";
// import { UserData } from "../models/user.js";
// import "dotenv/config"

// const userValidationSchema = joi.object({
//     username: joi.string().required(),
//     email: joi.string().required().email().pattern(new RegExp("@gmail\\.com$")),
//     password: joi.string().required().min(6).max(15),
// })

//  const createUser = async (req, res) => {
//     const { username, email, password } = req.body;


//     try {
//         if (!(username && email && password)) {
//             return res.status(409).send({ status: 409, message: "All Fields are Required" })
//         }

//         const existedUser = await UserData.findOne({ email })

//         if (existedUser) {
//             return res.status(409).send({ status: 409, message: "User Already Exits!", })
//         }

//         await userValidationSchema.validateAsync(req.body);

//         const passwordHash = await bcrypt.hash(password, 10)

//         const createUser = await UserData.create({
//             username: username,
//             email: email,
//             password: passwordHash
//         }).then(res => res.toObject())
//         await transporter.sendMail({
//             from: `Muhammad Asif Ansari ${process.env.EMAIL_USER}`,
//             to: createUser.email,
//             subject: "Welcome to Our Platform 🎉",
//             text: `Hi ${createUser.username},

// Welcome to our platform! Your account has been created successfully.
// If you have any questions, feel free to reach out to me.
// Best regards,
// Muhammad Asif Ansari`
//         });
//  const token = jwt.sign({ _id: createUser._id, email: createUser.email,username:createUser.username }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

//         delete createUser.password
//         return res.status(201).send({ status: 200, message: "User Created Successfully!", data: createUser,token: token  })
//     } catch (error) {
//         return res.status(500).send({ status: 500, message: error.message })

//     }
// }

// export default createUser


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import joi from "joi";
import transporter from "../helpers/sendEmail.js";
import { UserData } from "../models/user.js";
import "dotenv/config";

const userValidationSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().required().email().pattern(new RegExp("@gmail\\.com$")),
  password: joi.string().required().min(6).max(15),
});

const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!(username && email && password)) {
      return res
        .status(409)
        .send({ status: 409, message: "All Fields are Required" });
    }

    const existedUser = await UserData.findOne({ email });
    if (existedUser) {
      return res
        .status(409)
        .send({ status: 409, message: "User Already Exists!" });
    }

    await userValidationSchema.validateAsync(req.body);

    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await UserData.create({
      username,
      email,
      password: passwordHash,
    });

    const userObj = createdUser.toObject();

    // 📩 Send Welcome Email
    await transporter.sendMail({
      from: `Muhammad Asif Ansari <${process.env.EMAIL_USER}>`,
      to: userObj.email,
      subject: "Welcome to Our Platform 🎉",
      text: `Hi ${userObj.username},

Welcome to our platform! Your account has been created successfully.
If you have any questions, feel free to reach out.

Best regards,
Muhammad Asif Ansari`,
    });

    const token = jwt.sign(
      { _id: userObj._id, email: userObj.email, username: userObj.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    delete userObj.password;
    return res
      .status(201)
      .send({
        status: 200,
        message: "User Created Successfully!",
        data: userObj,
        token,
      });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).send({ status: 500, message: error.message });
  }
};

export default createUser;
