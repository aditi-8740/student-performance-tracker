import { BrevoClient } from "@getbrevo/brevo";
import config from "../config/config.js";

const brevo = new BrevoClient({
  apiKey: config.BREVO_API_KEY,
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      textContent: text,
      htmlContent: html,
      sender: { name: "Sender", email: config.GOOGLE_USER },
      to: [{ email: to }],
    });
    console.log("email sent successfully");
  } catch (error) {
    console.error("Brevo email error: ", error);
  }
};

export default sendEmail;


// import nodemailer from "nodemailer";
// import config from "../config/config.js";

// const transporter = nodemailer.createTransport({
//   // service: "gmail",
//   // auth: {
//   //   type: "OAuth2",
//   //   user: config.GOOGLE_USER, // Your Gmail address
//   //   clientId: config.GOOGLE_CLIENT_ID,
//   //   clientSecret: config.GOOGLE_CLIENT_SECRET,
//   //   refreshToken: config.GOOGLE_REFRESH_TOKEN,
//   // },

//   host: config.BREVO_SMTP_HOST,
//   port: config.BREVO_SMTP_PORT,
//   secure: true,
//   auth: {
//     user: config.BREVO_SMTP_LOGIN,
//     pass: config.BREVO_SMTP_PASSWORD,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Error setting up email transporter:", error);
//   } else {
//     console.log(typeof config.BREVO_SMTP_PORT);
// console.log(config.BREVO_SMTP_PORT);
//     console.log("BREVO SMTP is ready to send messages");
//   }
// });

// const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"smart school Team" <${config.GOOGLE_USER}>`,
//       to: to,
//       subject: subject,
//       text: text,
//       html: html,
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Preview URL is only available when using an Ethereal test account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   } catch (err) {
//     console.error("Error while sending mail:", err);
//   }
// };
// export default sendEmail;
