const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');

/**
 * @swagger
 * tags:
 *   name: Waitlist
 *   description: Waitlist operations
 */

/**
 * @swagger
 * /waitlists:
 *   post:
 *     summary: Subscribe to waitlist
 *     tags: [Waitlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: mayor@nucluesdao.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       404:
 *         description: User already exists
 *       500:
 *         description: Error creating the user
 */

router.post('', waitlistController.addUserToWaitlist);

/**
 * @swagger
 * /waitlists:
 *   get:
 *     summary: Retrieve waitlist subscribed email
 *     tags: [Waitlist]
 *     responses:
 *       200:
 *         description: A list of all email subscribed to waitlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 email:
 *                   type: string
 *               example: ["mayor@nucluesdao.com", "chuks@nucluesdao.com"]
 *       500:
 *         description: Error fetching users
 */

router.get('', waitlistController.getWaitlist);

module.exports = router;
