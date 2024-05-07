const moment = require('moment'); // Ensure moment is installed
const DAO = require('../models/daoModel'); // Ensure your DAO model path is correct
const { notifyUsersOnDaoCreation } = require('./notificationController');

// Helper function to format data based on the specified timeframe
function formatData(history, timeframe = 'daily') {
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
      unit = 'weeks';
      interval = 4;
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
    title:
      unit == 'weeks'
        ? `Week ${index + 1}`
        : start
            .clone()
            .add(index, unit)
            .format(
              unit === 'hours' ? 'H:mm' : unit === 'days' ? 'dddd' : 'MMMM'
            ),
    value: null, // Initially null, will be filled later
  }));

  // Fill the formattedHistory with actual values from the database
  const formattedHistoryValues = {};
  history.forEach((data) => {
    const momentTime = moment(data.timestamp);
    if (momentTime.isBetween(start, now, unit, '[]')) {
      const index = momentTime.diff(start, unit);
      if (index < interval) {
        if (formattedHistoryValues[index]) {
          formattedHistoryValues[index].push(data.value);
        } else {
          formattedHistoryValues[index] = [data.value];
        }
      }
    }
  });

  Object.entries(formattedHistoryValues).forEach(([index, values]) => {
    // Find average of values (sum / length)
    const average = values.reduce((a, b) => a + b) / values.length;
    formattedHistory[index].value = average.toString();
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

exports.createDao = async (req, res) => {
  try {
    const { name, id, members, currentProposalsCount, currentBalance } =
      req.body;
    if (!name || !id || !members) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    const dao = await DAO.create({
      name,
      id,
      members,
      currentProposalsCount,
      currentBalance,
      history: [
        {
          membersCount: members.length,
          balance: currentBalance ?? 0,
          proposalsCount: currentProposalsCount ?? 0,
        },
      ],
    });
    console.log(dao.history);
    await notifyUsersOnDaoCreation({ name, id });
    res.status(201).send({ message: 'DAO created successfully', dao });
  } catch (error) {
    console.error('Error creating DAO', error);
    res.status(500).send({ message: 'Error creating DAO' });
  }
};

exports.updateDao = async (req, res) => {
  try {
    const daoId = req.params.id;
    const daoInfo = req.body;

    const updatedDao = await DAO.findOneAndUpdate({ id: daoId }, daoInfo);
    await saveDao(daoId, daoInfo);

    if (!updatedDao) {
      return res.status(404).send({ message: 'DAO not found' });
    }
    console.log(updatedDao.history);
    res.send({ message: 'DAO successfully updated', dao: updatedDao });
  } catch (error) {
    console.error('Error updating DAO', error);
    res.status(500).send({ message: 'Error updating DAO' });
  }
};

async function saveDao(id, daoInfo) {
  const { members, balance, currentProposalsCount } = daoInfo;
  const dao = await DAO.findOne({ id });
  // Update current values
  if (members) {
    dao.members = members;
  }
  if (balance != undefined) {
    dao.currentBalance = balance;
  }
  if (currentProposalsCount != undefined) {
    dao.currentProposalsCount = currentProposalsCount;
  }

  // Push new history entry
  dao.history.push({
    membersCount: dao.members.length,
    balance: dao.balance,
    proposalsCount: dao.currentProposalsCount,
  });

  await dao.save();
}
