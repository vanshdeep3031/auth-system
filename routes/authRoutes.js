import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  generate2FA,
  verify2FA,
  verifyLogin2FA
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

router.get("/2fa/setup", authMiddleware, generate2FA);
router.post("/2fa/verify", authMiddleware, verify2FA);
router.post("/2fa/login", verifyLogin2FA);

export default router;