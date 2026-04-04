import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  refreshToken: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,

  devices: [
    {
      ip: String,
      userAgent: String,
      lastLogin: Date
    }
  ],

  twoFactorSecret: String,
  twoFactorEnabled: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);