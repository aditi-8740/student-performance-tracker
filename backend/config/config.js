import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.MONGO_URL ||
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.GOOGLE_USER ||
  !process.env.CLIENT_URL||
  !process.env.BREVO_API_KEY
) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}

const config = {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  GOOGLE_USER: process.env.GOOGLE_USER,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,

  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST,
  BREVO_SMTP_PORT: process.env.BREVO_SMTP_PORT,
  BREVO_SMTP_LOGIN: process.env.BREVO_SMTP_LOGIN,
  BREVO_SMTP_PASSWORD: process.env.BREVO_SMTP_PASSWORD,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
};
export default config;
