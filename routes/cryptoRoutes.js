const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

/**
 * @swagger
 * tags:
 *   name: Cryptocurrency
 *   description: Crypto price data retrieval
 */

/**
 * @swagger
 * /cryptos/aeternity-price:
 *   get:
 *     summary: Get the current price of Aeternity (AE) in USD
 *     tags: [Cryptocurrency]
 *     responses:
 *       200:
 *         description: The current price of Aeternity in USD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 price:
 *                   type: number
 *                   example: 0.1234
 *       500:
 *         description: Failed to retrieve price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve price
 *                 error:
 *                   type: string
 *                   example: Error message details
 */
router.get('/aeternity-price', cryptoController.getAeternityPrice);

module.exports = router;
