const User = require('../models/userModel');
const DAO = require('../models/daoModel');
const {
  sendDAOCreatedEmails,
  sendProposalsCreatedEmails,
} = require('../utils');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await User.findOne(
      { address: req.params.address },
      'notifications'
    );
    res.send(notifications.notifications);
  } catch (error) {
    console.error('Error fetching all notifications', error);
    res.status(500).send({ message: 'Error marking notifications as read' });
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
    console.error('Error in fetching unread notifications:', error);
    res.status(500).send({ message: 'Error fetching unread notifications' });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    const address = req.params.address;
    const result = await User.updateOne(
      { address },
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
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { address, notificationId } = req.params;
    const result = await User.updateOne(
      { address, 'notifications._id': notificationId },
      { $set: { 'notifications.$.read': true } }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: 'Notification not found or already marked as read' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error in marking notification as read:', error);
    res.status(500).json({
      message: 'Failed to mark notification as read',
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
  sendDAOCreatedEmails(dao, emailRecievers);
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
  sendProposalsCreatedEmails(dao, emailRecievers);
};
