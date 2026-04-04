import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Dashboard", user: req.user });
});

router.get("/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Admin only" });
  }
);

router.get("/devices", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ devices: user.devices });
});

export default router;