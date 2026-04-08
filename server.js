import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cors from "cors";

app.use(cors());
dotenv.config();

const app = express();
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// SERVER
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));