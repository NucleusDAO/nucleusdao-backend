const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       201:
 *         description: User created successfully
 *       404:
 *         description: User already exists
 *       500:
 *         description: Error creating the user
 */
router.post('', userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error fetching users
 */
router.get('', userController.getUsers);

/**
 * @swagger
 * /users/{address}:
 *   get:
 *     summary: Get a single user by address
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique address of the user
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user profile
 */
router.get('/:address', userController.getUserProfile);

/**
 * @swagger
 * /users/{address}:
 *   patch:
 *     summary: Update a user's profile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique address of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User/DTO'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user profile
 */
router.patch('/:address', userController.updateUserProfile);

/**
 * @swagger
 * /users/{address}/notifications:
 *   patch:
 *     summary: Update a user's notification settings
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique address of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotificationSettings:
 *                 $ref: '#/components/schemas/NotificationSettings'
 *               pushNotificationSettings:
 *                 $ref: '#/components/schemas/NotificationSettings'
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
 *       400:
 *         description: Notification settings are required
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating notification settings
 */
router.patch(
  '/:address/notifications',
  userController.updateNotificationSettings
);

module.exports = router;
