import nodemailer from "nodemailer";

export const sendMails = (res, mailBody) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    transporter.sendMail(mailBody);
  } catch (error) {
    res.status(500);
    throw new Error("Somethign went wrong while sending email's verification");
  }
};
