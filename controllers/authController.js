import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import useragent from "useragent";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

// REGISTER
export const register = async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashed });

  res.json({ message: "Registered" });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid" });

  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({ message: "Account locked" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    user.loginAttempts++;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    await user.save();
    return res.status(400).json({ message: "Invalid" });
  }

  user.loginAttempts = 0;
  user.lockUntil = null;

  // DEVICE TRACKING
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const agent = useragent.parse(req.headers["user-agent"]).toString();

  const existing = user.devices.find(
    d => d.ip === ip && d.userAgent === agent
  );

  if (!existing) {
    console.log("⚠️ New device login!");
    user.devices.push({ ip, userAgent: agent, lastLogin: new Date() });
  } else {
    existing.lastLogin = new Date();
  }

  await user.save();

  // 2FA check
  if (user.twoFactorEnabled) {
    return res.json({ message: "2FA required", userId: user._id });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
};

// REFRESH
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ message: "Invalid" });

  jwt.verify(refreshToken, process.env.JWT_SECRET);

  const newToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ accessToken: newToken });
};

// LOGOUT
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({ message: "Logged out" });
};

// 2FA SETUP
export const generate2FA = async (req, res) => {
  const secret = speakeasy.generateSecret();

  const user = await User.findById(req.user.id);
  user.twoFactorSecret = secret.base32;
  await user.save();

  const qr = await QRCode.toDataURL(secret.otpauth_url);

  res.json({ qr });
};

// VERIFY 2FA
export const verify2FA = async (req, res) => {
  const { token } = req.body;

  const user = await User.findById(req.user.id);

  const valid = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token
  });

  if (!valid) return res.status(400).json({ message: "Invalid OTP" });

  user.twoFactorEnabled = true;
  await user.save();

  res.json({ message: "2FA enabled" });
};

// LOGIN 2FA
export const verifyLogin2FA = async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findById(userId);

  const valid = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token
  });

  if (!valid) return res.status(400).json({ message: "Invalid OTP" });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ accessToken, refreshToken });
};