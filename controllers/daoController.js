const moment = require('moment'); // Ensure moment is installed
const DAO = require('../models/daoModel'); // Ensure your DAO model path is correct

// Helper function to format data based on the specified timeframe
function formatData(history, timeframe) {
  const now = moment();
  let start;
  let formattedHistory = [];
  let unit;
  let interval;

  switch (timeframe) {
    case 'daily':
      start = moment().subtract(23, 'hours').startOf('hour'); // Start from 23 hours ago
      unit = 'hours';
      interval = 24;
      break;
    case 'weekly':
      start = moment().subtract(6, 'days').startOf('day'); // Start from 6 days ago
      unit = 'days';
      interval = 7;
      break;
    case 'monthly':
      start = moment().subtract(3, 'weeks').startOf('isoWeek'); // Start from 3 weeks ago
      unit = 'days';
      interval = 21;
      break;
    case 'yearly':
      start = moment().subtract(11, 'months').startOf('month'); // Start from 11 months ago
      unit = 'months';
      interval = 12;
      break;
    default:
      return [];
  }

  formattedHistory = new Array(interval).fill(null).map((_, index) => ({
    title: start
      .clone()
      .add(index, unit)
      .format(unit === 'hours' ? 'H:mm' : unit === 'days' ? 'D MMM' : 'MMMM'),
    value: null, // Initially null, will be filled later
  }));

  // Fill the formattedHistory with actual values from the database
  history.forEach((data) => {
    const momentTime = moment(data.timestamp);
    if (momentTime.isBetween(start, now, unit, '[]')) {
      const index = momentTime.diff(start, unit);
      if (index < interval) {
        formattedHistory[index].value = data.value.toString();
      }
    }
  });

  // Fill in gaps by propagating the last seen value
  let lastValue = '0'; // Default value if no data exists at all, adjust as necessary
  for (let i = 0; i < formattedHistory.length; i++) {
    if (formattedHistory[i].value !== null) {
      lastValue = formattedHistory[i].value; // Update last seen value
    } else {
      formattedHistory[i].value = lastValue; // Fill with last seen value
    }
  }

  return formattedHistory;
}

// Controller functions to handle API requests
exports.getBalanceHistory = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const dao = await DAO.findOne({ id: req.params.id });
    if (!dao) {
      return res.status(404).send({ message: 'DAO not found' });
    }
    const formattedHistory = formatData(
      dao.history.map((h) => ({
        timestamp: h.timestamp,
        value: h.balance,
      })),
      timeframe
    );
    res.json(formattedHistory);
  } catch (error) {
    console.error('Error getting balance history', error);
    res.status(500).send({ message: 'Error getting balance history' });
  }
};

exports.getMembersHistory = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const dao = await DAO.findOne({ id: req.params.id });
    if (!dao) {
      return res.status(404).send({ message: 'DAO not found' });
    }
    const formattedHistory = formatData(
      dao.history.map((h) => ({
        timestamp: h.timestamp,
        value: h.membersCount,
      })),
      timeframe
    );
    res.json(formattedHistory);
  } catch (error) {
    console.error('Error getting members history', error);
    res.status(500).send({ message: 'Error getting members history' });
  }
};

exports.getProposalsHistory = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const dao = await DAO.findOne({ id: req.params.id });
    if (!dao) {
      return res.status(404).send({ message: 'DAO not found' });
    }
    const formattedHistory = formatData(
      dao.history.map((h) => ({
        timestamp: h.timestamp,
        value: h.proposalsCount,
      })),
      timeframe
    );
    res.json(formattedHistory);
  } catch (error) {
    console.error('Error getting proposals history', error);
    res.status(500).send({ message: 'Error getting proposals history' });
  }
};
