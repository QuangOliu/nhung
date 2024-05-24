const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Thiết lập transporter cho nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-email', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"Test Email" <trantran30102002@gmail.com>', // sender address
      to: "trantran30102002@gmail.com", // list of receivers
      subject: "Test Email", // Subject line
      text: "This is a test email.", // plain text body
      html: "<b>This is a test email.</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
});

module.exports = router;
