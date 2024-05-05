const User = require('../models/userModel');
const DAO = require('../models/daoModel'); // Assuming you have this model
const { sendEmail } = require('../utils');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await User.findOne(
      { address: req.params.address },
      'notifications'
    );
    res.send(notifications.notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await User.findOne(
      { address: req.params.address },
      'notifications'
    );
    const unreadNotifications = notifications.notifications.filter(
      (notification) => !notification.read
    );
    res.send(unreadNotifications);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    const userAddress = req.params.address;
    const result = await User.updateOne(
      { address: userAddress },
      { $set: { 'notifications.$[].read': true } }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .send({ message: 'User not found or no notifications updated' });
    }

    res.send({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error in marking notifications as read:', error);
    res.status(500).send({
      message: 'Failed to mark notifications as read',
      error: error.message,
    });
  }
};

exports.notifyUsersOnDaoCreation = async (dao) => {
  const emailRecievers = await User.find({
    'emailNotificationsSettings.newDAO': true,
  });

  const notification = {
    title: 'New DAO Created',
    message: `A new DAO named ${dao.name} has been created.`,
    time: new Date(),
    extra: { daoName: dao.name, daoId: dao.id },
    read: false,
  };

  // Update users' notification arrays
  await User.updateMany(
    { 'emailNotificationsSettings.newDAO': true },
    { $push: { notifications: { $each: [notification], $position: 0 } } }
  );

  // Prepare and send email notifications
  const recipients = emailRecievers.map((user) => user.email).join(',');
  sendEmail(
    recipients,
    'New DAO Created',
    `A new DAO named ${dao.name} has been created.`
  );
};

exports.notifyUsersOnProposalCreation = async (daoId, proposalId) => {
  const dao = await DAO.findOne({ id: daoId });
  const emailRecievers = await User.find({
    'emailNotificationsSettings.newProposal': true,
    address: { $in: dao.members },
  });

  const notification = {
    title: 'New Proposal Created',
    message: `A new proposal has been created in DAO: ${dao.name}`,
    time: new Date(),
    extra: { daoName: dao.name, daoId, proposalId },
    read: false,
  };

  // Get all dao members
  await User.updateMany(
    {
      address: { $in: dao.members },
    },
    { $push: { notifications: { $each: [notification], $position: 0 } } }
  );

  // Prepare and send email notifications
  const recipients = emailRecievers.map((user) => user.email).join(',');
  sendEmail(
    recipients,
    'New Proposal Created',
    `A new proposal has been created in DAO: ${dao.name}.`
  );
};
