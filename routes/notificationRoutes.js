const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Manage user notifications
 */

/**
 * @swagger
 * /notifications/{address}:
 *   get:
 *     summary: Retrieve all notifications for a specified user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique address of the user
 *     responses:
 *       200:
 *         description: A list of all notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Error retrieving the notifications
 */
router.get('/:address', notificationController.getAllNotifications);

/**
 * @swagger
 * /notifications/unread/{address}:
 *   get:
 *     summary: Retrieve all unread notifications for a specified user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's address to fetch unread notifications
 *     responses:
 *       200:
 *         description: A list of unread notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Error retrieving the notifications
 */
router.get('/unread/:address', notificationController.getUnreadNotifications);

/**
 * @swagger
 * /notifications/mark-read/{address}:
 *   put:
 *     summary: Mark all notifications as read for a specified user
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's address to mark notifications as read
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *       404:
 *         description: User not found or no notifications to update
 *       500:
 *         description: Error marking notifications as read
 */
router.put('/mark-read/:address', notificationController.markNotificationsRead);

module.exports = router;
