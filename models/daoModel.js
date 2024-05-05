const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the history record was created, defaults to current date and time.
 *         membersCount:
 *           type: number
 *           description: Number of members in the DAO at the time of the history snapshot.
 *         balance:
 *           type: number
 *           description: Total balance of the DAO at the time of the history snapshot.
 *         proposalsCount:
 *           type: number
 *           description: Total number of proposals in the DAO at the time of the history snapshot.
 *       example:
 *         timestamp: "2021-04-20T12:34:56.789Z"
 *         membersCount: 150
 *         balance: 10000
 *         proposalsCount: 25
 *
 *     DAODTO:
 *       type: object
 *       required:
 *         - name
 *         - id
 *         - members
 *         - currentBalance
 *         - currentProposalsCount
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the DAO.
 *         id:
 *           type: string
 *           description: Unique identifier for the DAO.
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: List of addresses of the members of the DAO.
 *         currentBalance:
 *           type: number
 *           description: Current balance of the DAO.
 *         currentProposalsCount:
 *           type: number
 *           description: Current count of active proposals in the DAO.
 *       example:
 *         name: "Genesis DAO"
 *         id: "dao123"
 *         members: ["0xABCDEF...", "0x123456..."]
 *         currentBalance: 50000
 *         currentProposalsCount: 10
 *     DAO:
 *       type: object
 *       required:
 *         - name
 *         - id
 *         - members
 *         - currentBalance
 *         - currentProposalsCount
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the DAO.
 *         id:
 *           type: string
 *           description: Unique identifier for the DAO.
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: List of addresses of the members of the DAO.
 *         currentBalance:
 *           type: number
 *           description: Current balance of the DAO.
 *         currentProposalsCount:
 *           type: number
 *           description: Current count of active proposals in the DAO.
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/History'
 *           description: Historical snapshots of the DAO's state at various times.
 *       example:
 *         name: "Genesis DAO"
 *         id: "dao123"
 *         members: ["0xABCDEF...", "0x123456..."]
 *         currentBalance: 50000
 *         currentProposalsCount: 10
 *         history:
 *           - timestamp: "2021-04-20T12:34:56.789Z"
 *           - membersCount: 150
 *           - balance: 10000
 *           - proposalsCount: 25
 */

const historySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  membersCount: Number,
  balance: Number,
  proposalsCount: Number,
});

const daoSchema = new mongoose.Schema({
  name: String,
  id: String,
  members: [String],
  currentBalance: { type: Number, default: 0 },
  currentProposalsCount: { type: Number, default: 0 },
  history: { type: [historySchema], default: [] },
});

const DAO = mongoose.model('DAO', daoSchema);

module.exports = DAO;
