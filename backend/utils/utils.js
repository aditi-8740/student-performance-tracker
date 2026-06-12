import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d'
  });
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function getOtpHtml(otp) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        }
        .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        }
        .otp {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin: 20px 0;
        }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Your OTP Code</h2>
      <p class="otp">${otp}</p>
      <p>Please use this code to verify your email address.</p>
    </div>
  </body>
  </html>`;
}

export function getResetPasswordEmailHtml(resetLink) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .reset-link {
        display: inline-block;
        padding: 10px 20px;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        border: 1px solid #fff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Reset Your Password</h2>
      <p>Please click the button below to reset your password:</p>
      <a href="${resetLink}" class="reset-link">Reset Password</a>
    </div>
  </body>
  </html>`
};


