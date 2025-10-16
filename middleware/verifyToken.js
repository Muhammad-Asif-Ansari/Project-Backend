import "dotenv/config"
import jwt from "jsonwebtoken"


// verifyToken.js
const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ status: 401, message: "Unauthorized", err });
        }

        req.user = {
            _id: decoded._id,
            email: decoded.email,
            username: decoded.username     
        };


        return next();
    });
};

export default verifyToken



