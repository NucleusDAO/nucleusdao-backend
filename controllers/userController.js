const User = require('../models/userModel');

const userResponseFields = { _id: 0, __v: 0, notifications: 0 };

exports.createUser = async (req, res) => {
  try {
    const userExists = await User.findOne({ address: req.body.address });
    console.log({ userExists });
    if (userExists) {
      return res.status(404).json({ message: 'User already exists.' });
    }
    const user = await User.create(req.body);
    res.status(201).send({ message: 'User created successfully', user });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res
        .status(409)
        .json({
          message: `Duplicate key error: ${duplicateField} already exists`,
        });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, userResponseFields);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userAddress = req.params.address;
    const user = await User.findOne(
      { address: userAddress },
      userResponseFields
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userAddress = req.params.address;
    const user = await User.findOneAndUpdate(
      { address: userAddress },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res
      .status(200)
      .json({ message: 'User profile updated successfully.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user profile.' });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const userAddress = req.params.address;
    const { emailNotificationsSettings, pushNotificationsSettings } = req.body;
    if (!emailNotificationsSettings && !pushNotificationsSettings) {
      return res
        .status(400)
        .json({ message: 'Notification settings are required.' });
    }
    const user = await User.findOne({ address: userAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (emailNotificationsSettings) {
      user.emailNotificationSettings = emailNotificationsSettings;
    }
    if (pushNotificationsSettings) {
      user.pushNotificationSettings = pushNotificationsSettings;
    }
    await user.save();
    res
      .status(200)
      .json(
        { message: 'Notification settings updated successfully.' },
        { emailNotificationsSettings, pushNotificationsSettings }
      );
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating notification settings' });
  }
};
