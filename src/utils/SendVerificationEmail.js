import nodemailer from "nodemailer";
import { getVerificationEmailTemplate } from "../templates/verificationEmail.template.js";
import { EMAIL_PASSWORD } from "../config/env.js";

const sendVerificationEmail = async (user, verificationUrl) => {
  try {
    const emailHTML = getVerificationEmailTemplate(verificationUrl);

    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ajil.weronz@gmail.com",
        pass: EMAIL_PASSWORD,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: '"Movie Booking" <no-reply@moviebooking.com>',
      to: user.email,
      subject: "Verify Your Email",
      html: emailHTML,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

export { sendVerificationEmail };
