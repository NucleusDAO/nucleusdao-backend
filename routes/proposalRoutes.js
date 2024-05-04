const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

/**
 * @swagger
 * tags:
 *   name: Proposal
 *   description: Provides easy access to all proposals
 */

/**
 * @swagger
 * /proposals:
 *   post:
 *     summary: Create a new proposal
 *     tags: [Proposal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposal'
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 *       500:
 *         description: Error creating the proposal
 */
router.post('/', proposalController.createProposal);

/**
 * @swagger
 * /proposals/{daoId}/{id}:
 *   get:
 *     summary: Get a proposal by ID
 *     tags: [Proposal]
 *     parameters:
 *       - in: path
 *         name: daoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The DAO ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The proposal ID
 *     responses:
 *       200:
 *         description: Proposal fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposal'
 *       404:
 *         description: Proposal not found
 *       500:
 *         description: Error fetching the proposal
 */
router.get('/:daoId/:id', proposalController.getProposal);

/**
 * @swagger
 * /proposals/{daoId}/{id}:
 *   put:
 *     summary: Update a proposal by ID
 *     tags: [Proposal]
 *     parameters:
 *       - in: path
 *         name: daoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The DAO ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The proposal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposal'
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       404:
 *         description: Proposal not found
 *       500:
 *         description: Error updating the proposal
 */
router.put('/:daoId/:id', proposalController.updateProposal);

/**
 * @swagger
 * /proposals:
 *   get:
 *     summary: Get all proposals
 *     tags: [Proposal]
 *     responses:
 *       200:
 *         description: Proposals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proposal'
 *       500:
 *         description: Error fetching proposals
 */
router.get('/', proposalController.getProposals);

module.exports = router;
