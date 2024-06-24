const express = require('express');
const router = express.Router();
const { contactUs } = require('../controllers/appController');

/**
 * @swagger
 * /app/contact-us:
 *   post:
 *     summary: Contact Us
 *     description: Allows users to contact us by sending an email with the provided subject, body, and optional image URL.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *               subject:
 *                 type: string
 *                 description: The subject of the message.
 *                 example: "Inquiry about DAO services"
 *               body:
 *                 type: string
 *                 description: The body of the message.
 *                 example: "I would like to know more about your DAO creation services."
 *               imageUrl:
 *                 type: string
 *                 description: Optional image URL related to the message.
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Thank you message received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thank you for contacting us. We have received your message and will get back to you shortly."
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post('/contact-us', contactUs);

module.exports = router;
