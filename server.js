import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ ENV check
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing ENV variables");
  process.exit(1);
}

// ✅ Middleware
app.use(express.json());

app.use(cors({
  origin: "http://127.0.0.1:5500", // change to Netlify URL later
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server running");
    });
  })
  .catch(err => console.log(err));