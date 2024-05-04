const cron = require('node-cron');
const transporter = require('../config/mailer');
const User = require('../models/userModel');

const scheduleEmailJobs = () => {
  // Example: send an email reminder to all users at 9 AM every Monday
  cron.schedule('0 9 * * Monday', async () => {
    try {
      User.find({}, (err, users) => {
        if (err) {
          console.log(err);
        } else {
            console.log('Sending weekly email reminders...');
            users.forEach(async (user) => {
                const info = await transporter.sendMail({
                    from: '"Example App" <no-reply@example.com>',
                    to: user.email,
                    subject: 'Daily Reminder',
                    text: 'This is your daily reminder.',
                    // html: '<b>This is your daily reminder.</b>',
                });
                console.log('Message sent: %s', info.messageId);
            });
        }
    });

    } catch (error) {
      console.error('Error sending email reminders', error);
    }
  });
};

module.exports = { scheduleEmailJobs };
