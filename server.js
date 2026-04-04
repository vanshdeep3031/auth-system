import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";

dotenv.config();

const app = express();

// 🔐 Security Middlewares
app.use(helmet());
app.use(cors());

// 🚫 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100
});
app.use(limiter);

// 📦 Body Parser
app.use(express.json());

// 🌐 Root Route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 🔗 Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// ❌ Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🗄️ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// 🚀 Server Start
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});