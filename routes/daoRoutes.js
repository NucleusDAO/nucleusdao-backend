const express = require('express');
const router = express.Router();
const daoController = require('../controllers/daoController');

/**
 * @swagger
 * tags:
 *   name: DAO
 *   description: DAO management and history operations
 */

/**
 * @swagger
 * /daos:
 *   post:
 *     summary: Create a new DAO
 *     tags: [DAO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DAODTO'
 *     responses:
 *       201:
 *         description: DAO created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error creating the DAO
 */
router.post('', daoController.createDao);

/**
 * @swagger
 * /daos/{id}:
 *   patch:
 *     summary: Update a DAO
 *     tags: [DAO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DAO ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DAODTO'
 *     responses:
 *       200:
 *         description: DAO updated successfully
 *       400:
 *         description: DAO ID is required
 *       404:
 *         description: DAO not found
 *       500:
 *         description: Error updating the DAO
 */
router.patch('/:id', daoController.updateDao);

/**
 * @swagger
 * /daos/{id}/balance-history:
 *   get:
 *     summary: Retrieve balance history for a DAO
 *     tags: [DAO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DAO ID
 *       - in: query
 *         name: timeframe
 *         required: false
 *         schema:
 *           type: string
 *         description: The timeframe of the data
 *     responses:
 *       200:
 *         description: Balance history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 *       404:
 *         description: DAO not found
 *       500:
 *         description: Error fetching balance history
 */
router.get('/:id/balance-history', daoController.getBalanceHistory);

/**
 * @swagger
 * /daos/{id}/members-history:
 *   get:
 *     summary: Retrieve members count history for a DAO
 *     tags: [DAO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DAO ID
 *       - in: query
 *         name: timeframe
 *         required: false
 *         schema:
 *           type: string
 *         description: The timeframe of the data
 *     responses:
 *       200:
 *         description: Members count history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 *       404:
 *         description: DAO not found
 *       500:
 *         description: Error fetching members count history
 */
router.get('/:id/members-history', daoController.getMembersHistory);

/**
 * @swagger
 * /daos/{id}/proposals-history:
 *   get:
 *     summary: Retrieve proposals count history for a DAO
 *     tags: [DAO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The DAO ID
 *       - in: query
 *         name: timeframe
 *         required: false
 *         schema:
 *           type: string
 *         description: The timeframe of the data
 *     responses:
 *       200:
 *         description: Proposals count history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 *       404:
 *         description: DAO not found
 *       500:
 *         description: Error fetching proposals count history
 */
router.get('/:id/proposals-history', daoController.getProposalsHistory);

module.exports = router;
