const nodemailer = require("nodemailer");
const path = require("path");

const sendMailWithPdf = async (to, subject, text, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: path.basename(pdfPath), // file name in email
        path: pdfPath, // actual saved path
      },
    ],
  });
};

module.exports = { sendMailWithPdf };
