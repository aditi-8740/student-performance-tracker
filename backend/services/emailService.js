import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  //   type: "OAuth2",
  //   user: config.GOOGLE_USER, // Your Gmail address
  //   clientId: config.GOOGLE_CLIENT_ID,
  //   clientSecret: config.GOOGLE_CLIENT_SECRET,
  //   refreshToken: config.GOOGLE_REFRESH_TOKEN,
  // },

  host: config.BREVO_SMTP_HOST,
  port: config.BREVO_SMTP_PORT,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: config.BREVO_SMTP_LOGIN,
    pass: config.BREVO_SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error setting up email transporter:", error);
  } else {
    console.log("BREVO SMTP is ready to send messages");
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"smart school Team" <${config.GOOGLE_USER}>`, // sender address
      to: to, // list of recipients
      subject: subject, // subject line
      text: text, // plain text body
      html: html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
export default sendEmail;
