import { SendMailOptions } from "nodemailer";
import jsonwebtoken, { EncodedPayload } from "../config/jwt";
import { email, transporter } from "../config/mail";

export const sendMail = (mailOptions: SendMailOptions) =>
  transporter.sendMail(mailOptions);

// Email verification mail WITHOUT template
export const sendEmailVerificationMailNoTemplate = async (
  payload: EncodedPayload
) => {
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

// Email verification mail with TEMPLATE
export const sendEmailVerificationMail = async (token: string, to: string) => {
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

  try {
    await email.send({
      template: "verify-email", // The folder name of the template
      message: {
        to: to,
      },
      locals: {
        verificationLink,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error((error as NativeError).message);
  }
};
