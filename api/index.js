import express from "express";
import cors from "cors";
import route from "../routes/index.js";
import "../db/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['https://project-frontend-smoky-pi.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.status(200).send("Backend working fine ✅");
});

app.use("/api", route);

// ✅ PORT only used for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

// ✅ Export for Vercel
export default app;
