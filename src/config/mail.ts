import nodemailer from "nodemailer";
import Email from "email-templates";
import path from "path";

// Nodemailer transporter configuration
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email-templates configuration
export const email = new Email({
  message: {
    from: `"WASIVEN" <dev@wasiven.xyz>`,
  },
  send:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod"
      ? true
      : false,
  transport: transporter,
  views: {
    root: path.resolve(__dirname, "..", "templates", "emails"),
    options: {
      extension: "ejs",
    },
  },
});

export default {
  transporter,
  email,
};
