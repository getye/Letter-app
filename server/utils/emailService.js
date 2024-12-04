const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure your email service

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS   
  }
});

// Email sending utility
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: to,                       // Receiver's email
    cc:process.env.EMAIL_USER,    // cc for test
    subject: subject,             // Email subject
    text: text                    // Email body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = sendEmail;
