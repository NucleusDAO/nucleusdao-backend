const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - address
 *         - email
 *         - username
 *       properties:
 *         address:
 *           type: string
 *           description: Unique address identifier for the user, required and must be unique.
 *         email:
 *           type: string
 *           description: User's email address, required and must be unique.
 *         username:
 *           type: string
 *           description: User's username, required and must be unique.
 *         about:
 *           type: string
 *           description: A brief bio or description about the user.
 *         profilePicture:
 *           type: string
 *           description: URL to the user's profile picture.
 *         theme:
 *           type: string
 *           description: User's preferred theme setting.
 *           enum:
 *             - light
 *             - dark
 *             - system
 *           default: 'light'
 *         emailNotificationsSettings:
 *           type: object
 *           properties:
 *             newDAO:
 *               type: boolean
 *               description: Whether to receive email notifications for new DAOs.
 *               default: true
 *             newProposal:
 *               type: boolean
 *               description: Whether to receive email notifications for new proposals.
 *               default: true
 *             newUpdate:
 *               type: boolean
 *               description: Whether to receive email notifications for updates.
 *               default: true
 *         pushNotificationsSettings:
 *           type: object
 *           properties:
 *             newDAO:
 *               type: boolean
 *               description: Whether to receive push notifications for new DAOs.
 *               default: true
 *             newProposal:
 *               type: boolean
 *               description: Whether to receive push notifications for new proposals.
 *               default: true
 *             newUpdate:
 *               type: boolean
 *               description: Whether to receive push notifications for updates.
 *               default: true
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *           description: The user's notifications
 *       example:
 *         address: "0x123456789abcdef"
 *         email: "user@example.com"
 *         username: "user123"
 *         about: "An enthusiast of blockchain technologies."
 *         profilePicture: "https://example.com/images/profile.jpg"
 *         theme: "dark"
 *         emailNotificationsSettings:
 *           newDAO: true
 *           newProposal: false
 *           newUpdate: true
 *         pushNotificationsSettings:
 *           newDAO: true
 *           newProposal: true
 *           newUpdate: false
 *         notifications:
 *           - title: "Welcome"
 *           - message: "Thank you for joining our platform."
 *           - time: "2021-04-01T12:00:00Z"
 *           - read: false
 *     Notification:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - time
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the notification, giving a brief idea about its content.
 *         message:
 *           type: string
 *           description: The detailed message of the notification.
 *         time:
 *           type: string
 *           format: date-time
 *           description: The time when the notification was created or sent.
 *         extra:
 *           type: object
 *           additionalProperties: true
 *           description: Additional data related to the notification, stored as key-value pairs.
 *         read:
 *           type: boolean
 *           description: A boolean indicating whether the notification has been read by the user.
 *       example:
 *         title: "New Proposal Created"
 *         message: "A new proposal has been created in your DAO. Click to view details."
 *         time: "2021-04-20T12:34:56.789Z"
 *         extra: { "proposalId": "1234", "daoId": "5678" }
 *         read: false
 */

const notificationSchema = new mongoose.Schema({
  titile: String,
  message: String,
  time: Date,
  extra: { daoId: String, daoName: String, proposalId: String },
  read: Boolean,
});

const Notification = mongoose.model('Notification', notificationSchema);

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  about: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  theme: {
    type: String,
    default: 'light',
    enum: ['light', 'dark', 'system'],
  },
  emailNotificationsSettings: {
    newDAO: {
      type: Boolean,
      default: true,
    },
    newProposal: {
      type: Boolean,
      default: true,
    },
    newUpdate: {
      type: Boolean,
      default: true,
    },
  },
  pushNotificationsSettings: {
    newDAO: {
      type: Boolean,
      default: true,
    },
    newProposal: {
      type: Boolean,
      default: true,
    },
    newUpdate: {
      type: Boolean,
      default: true,
    },
  },
  notifications: { type: [notificationSchema], default: [] },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
