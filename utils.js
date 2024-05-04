const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',
    pass: 'yourpassword',
  },
});

exports.sendEmail = async (recipient, subject, text) => {
  try {
    let mailOptions = {
      from: '"Sender Name" <yourgmail@gmail.com>',
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
