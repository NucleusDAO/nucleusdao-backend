const nodemailer = require('nodemailer');
const config = require('./config/config');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.mailUser,
    pass: config.mailPassword,
  },
});

exports.sendEmail = async (recipient, subject, text) => {
  try {
    let mailOptions = {
      from: `"Nucleus DAO" <${config.mailUser}>`,
      to: recipient,
      subject: subject,
      text: text,
      // html: '<b>Hello world?</b>' // html body
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
