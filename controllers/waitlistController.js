const EarlyUser = require('../models/earlyUserModel');
const { sendWaitlistEmail } = require('../utils');

exports.addUserToWaitlist = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json('email is required');
    }
    await EarlyUser.updateOne({ email }, { email }, { upsert: true });
    await sendWaitlistEmail(email);
    res.status(201).json({
      message: 'Email successfully added to waitlist',
      email,
    });
  } catch (error) {
    console.error({ error });
    res.status(500).json({ message: 'Error adding email to waitlist' });
  }
};

exports.getWaitlist = async (req, res) => {
  try {
    const users = await EarlyUser.find({}, { email: true });
    res.status(200).send(users.map((user) => user.email));
  } catch (error) {
    console.error('Error getting waitlist emails', error);
    res.status(500).json({ message: 'Error getting waitlist emails' });
  }
};
