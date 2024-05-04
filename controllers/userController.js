const User = require('../models/userModel');

const userResponseFields = { _id: 0, __v: 0, notifications: 0 };

exports.createUser = async (req, res) => {
  try {
    const userExists = await User.findOne({ address: req.body.address });
    console.log({ userExists });
    if (userExists) {
      return res.status(404).json({ message: 'User already exists.' });
    }
    await User.create(req.body);
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    const { address, username, email, about, profilePicture, theme } = req.body;
    const user = await User.findOne({ address: userAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.address = address;
    user.username = username;
    user.email = email;
    user.about = about;
    user.profilePicture = profilePicture;
    user.theme = theme;
    await user.save();
    res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user profile.' });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const userAddress = req.params.address;
    const { emailNotificationSettings, pushNotificationSettings } = req.body;
    if (!emailNotificationSettings && !pushNotificationSettings) {
      return res
        .status(400)
        .json({ message: 'Notification settings are required.' });
    }
    const user = await User.findOne({ address: userAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (emailNotificationSettings) {
      user.emailNotificationSettings = emailNotificationSettings;
    }
    if (pushNotificationSettings) {
      user.pushNotificationSettings = pushNotificationSettings;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
