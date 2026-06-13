import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/otp.js";
import Session from "../models/Session.js";
import sendEmail from "../services/emailService.js";
import crypto from "crypto";
import {
  hashOTP,
  generateRefreshToken,
  generateAccessToken,
  hashToken,
  generateOTP,
  getOtpHtml,
  getResetPasswordEmailHtml,
} from "../utils/utils.js";
import { REFRESH_COOKIE_OPTIONS } from "../config/cookies.js";
import config from "../config/config.js";
import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const saltRounds = 10;

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    //Check if user already exists or not
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user && user.isEmailVerified) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    if (!user) {
      //Create user in Database
      user = await User.create({
        name: name,
        email: email.toLowerCase(),
        passwordHash,
        classes: [],
        role: role || "student",
      });
    } else {
      // If user exists but email is not verified, update the existing user with new details
      user.name = name;
      user.passwordHash = passwordHash;
      user.role = role || "student";
      await user.save();
    }

    await Otp.deleteMany({
      userId: user._id,
      purpose: "signup",
    });

    const otp = generateOTP(); // send this via email
    const otpHash = hashOTP(otp);

    await Otp.create({
      userId: user._id,
      otpHash,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      text: `Your OTP code is: ${otp}`,
      html: getOtpHtml(otp),
    });

    res.status(201).json({
      message: "Account created. Verification OTP sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//RESEND OTP
export const resendSignupOtp = async (req, res) => {
  const { email, purpose = "signup" } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (purpose === "signup" && user.isEmailVerified) {
    return res.status(400).json({ message: "Email already verified." });
  }

  await Otp.deleteMany({ userId: user._id, purpose });

  const otp = generateOTP();

  await Otp.create({
    userId: user._id,
    otpHash: hashOTP(otp),
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), //10 minutes
  });

  await sendEmail({
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: getOtpHtml(otp),
  });

  res.json({ message: "OTP sent successfully." });
};

export const verifySignupOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const otpDoc = await Otp.findOne({
    userId: user._id,
    purpose: "signup",
  });

  if (!otpDoc) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (!(otpDoc.expiresAt > Date.now())) {
    await otpDoc.deleteOne();
    return res.status(404).json({ message: "OTP expired" });
  }

  if (hashOTP(otp) !== otpDoc.otpHash) { 
    otpDoc.attempts += 1;
    otpDoc.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isEmailVerified = true;
  await user.save();
  await Otp.deleteMany({
    userId: user._id,
    purpose: "signup",
  });

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  await Session.create({
    userId: user._id,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
  });

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if User exists or not
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        message:
          "This account was created using Google.Please continue with Google Sign-In.",
      });
    }
    // if credentials true or not
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
    });

    await Session.create({
      userId: user._id,
      refreshTokenHash: hashToken(refreshToken),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
    });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({
      message: "Login successful.",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing." });
    }

    const payload = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    const tokenHash = hashToken(refreshToken);

    const session = await Session.findOne({
      refreshTokenHash: tokenHash,
      isRevoked: false,
    });

    if (!session) {
      return res.status(401).json({ message: "Session not found." });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const newAccessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id,
      sessionVersion: Date.now(),
    });

    session.refreshTokenHash = hashToken(newRefreshToken);
    session.lastUsedAt = new Date();
    await session.save();

    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// LOGOUT (CURRENT DEVICE)
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "refresh token missing" });
    }

    await Session.updateOne(
      { refreshTokenHash: hashToken(refreshToken), isRevoked: false },
      { $set: { isRevoked: true } },
    );

    res.clearCookie("refreshToken", {
      ...REFRESH_COOKIE_OPTIONS,
    });

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// LOGOUT FROM ALL DEVICES
export const logoutFromAllDevices = async (req, res) => {
  try {
    await Session.updateMany(
      { userId: req.user._id, isRevoked: false },
      { $set: { isRevoked: true } },
    );

    res.clearCookie("refreshToken", {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: undefined,
    });

    res.json({ message: "Logged out from all devices." });
  } catch (error) {
    console.error("Logout from all devices error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        message: "No account found. Check your email and try again.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordTokenHash = tokenHash;

    user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000; //15min
    await user.save();

    const resetLink = `${config.CLIENT_URL}/reset-password/${resetToken}`;

    // send email asynchronously so the HTTP response isn't blocked by SMTP delays (*Change later)
    // setImmediate(() => {
    sendEmail({
      to: user.email,
      subject: "Reset Password",
      text: `Click the following link to reset your password: ${resetLink}`,
      html: getResetPasswordEmailHtml(resetLink),
    });
    // });

    res.json({
      message: "If the account exists, a reset link sent successfully.",
    });
  } catch (error) {
    console.error("Forgot password OTP error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.json("Refresh Token missing");
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      req.user.passwordHash,
    );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "That's not the right password. Try again or reset your password",
      });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    const refreshTokenHash = hashToken(refreshToken);

    await User.findByIdAndUpdate(req.user._id, {
      $set: { passwordHash },
    });

    await Session.updateMany(
      {
        userId: req.user._id,
        refreshTokenHash: { $ne: refreshTokenHash },
      },
      {
        $set: { isRevoked: true },
      },
    );

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const tokenHash = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,

      resetPasswordExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token.",
      });
    }
    //Hash Password
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.passwordHash = passwordHash;

    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await Session.updateMany({ userId: user._id }, { isRevoked: true });

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const currentTokenHash = hashToken(refreshToken);
    const sessions = await Session.find({
      userId: req.user._id,
      isRevoked: false,
    })
      .select("-__v")
      .lean();

    const currentSession = sessions.find((s) => {
      return s.refreshTokenHash === currentTokenHash || null;
    });
    const otherSessions = sessions.filter((s) => {
      return s._id.toString() !== currentSession?._id.toString();
    });

    return res.json({ currentSession, otherSessions });
  } catch (error) {
    console.error("Get user sessions error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "ID Token required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId: sub,
        isEmailVerified: true,
      });
    }

    // Existing local account
    else if (!user.googleId) {
      user.googleId = sub;

      await user.save();
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
    });

    // Create session
    const session = await Session.create({
      userId: user._id,
      refreshTokenHash: hashToken(refreshToken),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
    });

    session.refreshTokenHash = hashToken(refreshToken);

    await session.save();

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid Google token",
    });
  }
};
