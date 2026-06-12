import { Router } from "express";
const router = Router();
import {
  signup,
  login,
  verifySignupOtp,
  refreshAccessToken,
  logout,
  resendSignupOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutFromAllDevices,
  getUserSessions,
  googleLogin
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

/*
Auth Routes
Base URL: /api/auth
*/

/*
@route POST /api/auth/signup
@desc Register a new user
@access Public
*/
router.post("/signup", signup);

/*
@route POST /api/auth/login
@desc Login a user
@access Public
*/
router.post("/login", login);

/*
@route POST /api/auth/verifications
@desc Verify OTP for user signup
@access Public
*/
router.post("/verifications", verifySignupOtp);

/*
@route POST /api/auth/tokens/refresh
@desc Refresh access token using refresh token
@access Public
*/
router.post("/tokens/refresh", refreshAccessToken);

/*
@route POST /api/auth/logout
@desc Logout user by revoking refresh token
@access Public (refresh token is sent in cookie, no auth header needed)
*/
router.post("/logout", logout);

/*
@route POST /api/auth/logout-all
@desc Logout user from all devices by revoking all refresh tokens
@access Private (requires authentication)
*/
router.post("/logout-all", protect, logoutFromAllDevices);

/*
@route POST /api/auth/otp/resend
@desc Resend OTP for user signup
@access Public
*/
router.post("/otp/resend", resendSignupOtp);

/*
@route POST /api/auth/password/forgot
@desc Initiate password reset process
@access Public
*/
router.post("/password/forgot", forgotPassword);

/*
@route POST /api/auth/password/reset/:resetToken
@desc Reset password using reset token
@access Public
*/
router.post("/password/reset/:resetToken", resetPassword);

/*
@route POST /api/auth/password/change
@desc Change password for authenticated user
@access Private
*/
router.post("/password/change", protect, changePassword);

/*
@route GET /api/auth/me
@desc Get current authenticated user's info
@access Private
*/
router.get("/me", protect, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

/*
@route GET /api/auth/sessions
@desc Get all active sessions for the authenticated user
@access Private
*/
router.get("/sessions", protect, getUserSessions);

/*
@route POST /api/auth/google
@desc Login or register user using Google OAuth
@access Public
*/
router.post('/google',googleLogin);


export default router;
