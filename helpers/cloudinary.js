import { v2 as cloudinary } from "cloudinary";

// Only load dotenv locally
if (process.env.NODE_ENV !== "production") {
  import("dotenv").then(dotenv => dotenv.config());
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;