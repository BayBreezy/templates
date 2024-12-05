import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";
import type { MailOptions } from "nodemailer/lib/smtp-transport";

/**
 * Creates and returns an SMTP transporter using the runtime configuration.
 *
 * @returns A configured nodemailer transporter instance.
 */
export const getTransporter = () => {
  const config = useRuntimeConfig();
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: Number(config.SMTP_PORT) === 465, // true for 465, false for other ports
    from: config.SMTP_FROM,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

/**
 * Sends an email using the SMTP configuration from the runtime config.
 *
 * @param mailOptions - The mail options including to, from, subject, and body of the email.
 * @returns A promise that resolves when the email is sent.
 */
export const sendEmail = async (mailOptions: MailOptions) => {
  const transporter = getTransporter();
  transporter.use("compile", htmlToText());
  return transporter.sendMail(mailOptions);
};