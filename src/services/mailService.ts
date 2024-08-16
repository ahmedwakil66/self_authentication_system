import { SendMailOptions } from "nodemailer";
import jsonwebtoken, { EncodedPayload } from "@/config/jwt";
import transporter from "@/config/mail";

export const sendMail = (mailOptions: SendMailOptions) =>
  transporter.sendMail(mailOptions);

export const sendEmailVerificationMail = async (payload: EncodedPayload) => {
  const verificationLink = `${
    process.env.BASE_URL
  }/verify-email?token=${jsonwebtoken.generateEmailToken(payload)}`;

  const emailTemplate = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
    <br />
    <p>The link is valid until 1 hour.<p/>
  `;

  try {
    return await sendMail({
      from: `"WASIVEN" <dev@wasiven.xyz>`,
      to: payload.email,
      subject: "Wasiven Email Verification",
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error((error as NativeError).message);
  }
};
