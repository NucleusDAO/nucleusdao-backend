const moment = require('moment');
const cron = require('node-cron');
const {
  _MiddlewareSubscriber,
  AeSdkAepp,
  Node,
  formatAmount,
} = require('@aeternity/aepp-sdk');
const DAO = require('../models/daoModel');
const {
  notifyUsersOnDaoCreation,
  notifyUsersOnProposalCreation,
} = require('./notificationController');
const nucleusdaoACI = require('../aci/NucleusDAO.json');

const nucleusdao = 'ct_FVFpGujmmLv4UEuJczdTMG3RekDt5jJBe32H9e2PHPMn2UrBb';
const TESTNET_NODE_URL = 'https://testnet.aeternity.io';
const MAINNET_NODE_URL = 'https://mainnet.aeternity.io';
const COMPILER_URL = 'https://compiler.aepps.com';
const aeSdk = new AeSdkAepp({
  nodes: [
    { name: 'testnet', instance: new Node(TESTNET_NODE_URL) },
    // { name: 'mainnet', instance: new Node(MAINNET_NODE_URL) },
  ],
});

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
    // const filteredValues = values.filter((num) => num != 0);
    // const average =
    //   filteredValues.length > 0
    //     ? filteredValues.reduce((a, b) => a + b) / values.length
    //     : 0;
    formattedHistory[index].value = Math.max(...values).toString();
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
    let dao = await DAO.findOne({ id: req.params.id });
    if (!dao) {
      dao = { history: [] };
    }
    const formattedHistory = formatData(
      dao.history.map((h) => ({
        timestamp: h.timestamp,
        value: h.balance,
      })),
      timeframe
    );
    res.json(
      formattedHistory.map((balanceHistory) => {
        balanceHistory.value = formatAmount(balanceHistory.value, {
          denomination: 'aettos',
          targetDenomination: 'ae',
        });
        return balanceHistory;
      })
    );
  } catch (error) {
    console.error('Error getting balance history', error);
    res.status(500).send({ message: 'Error getting balance history' });
  }
};

exports.getMembersHistory = async (req, res) => {
  try {
    const { timeframe } = req.query;
    let dao = await DAO.findOne({ id: req.params.id });
    if (!dao) {
      dao = { history: [] };
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
    let dao = await DAO.findOne({ id: req.params.id });
    if (!dao) {
      dao = { history: [] };
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

exports.getTransactionsHistory = async (req, res) => {
  try {
    let id = req.params.id;
    let dao = await DAO.findOne({ id });
    if (!dao) {
      return res.json([]);
    }
    const apiRes = await fetch(
      `https://testnet.aeternity.io/mdw/v2/txs?contract=${dao.contractAddress}`
    );
    const transactions = await apiRes.json();
    const transactionHistory = [];
    transactions.data.forEach((transaction) => {
      const { amount, sender_id, caller_id, contract_id, recipient_id } =
        transaction.tx;
      if (amount > 0) {
        const sender = caller_id ?? sender_id;
        const receiver = contract_id ?? recipient_id;
        const date = new Date(transaction.micro_time);
        transactionHistory.push({
          date,
          amount: formatAmount(amount, {
            denomination: 'aettos',
            targetDenomination: 'ae',
          }),
          sender,
          receiver,
        });
      }
    });
    res.json(transactionHistory);
  } catch (error) {
    console.error('Error getting transaction history', error);
    res.status(500).send({ message: 'Error getting transactioin history' });
  }
};

exports.createDao = async (req, res) => {
  try {
    const {
      name,
      id,
      members,
      contractAddress,
      currentProposalsCount,
      currentBalance,
    } = req.body;
    if (!name || !id || !members) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    const dao = await DAO.create({
      name,
      id,
      members,
      contractAddress,
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
  if (
    dao.members.length == members.length &&
    dao.balance == balance &&
    dao.currentProposalsCount == currentProposalsCount
  ) {
    return;
  }
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
    balance: dao.currentBalance,
    proposalsCount: dao.currentProposalsCount,
  });

  await dao.save();
}

const transactionCallback = (payload, error) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (payload.tx.function == 'createdDAO') {
    const { micro_time, hash } = payload;
    const {
      arguments: function_args,
      caller_id,
      return: return_value,
    } = payload.tx;
    const name = function_args[0];
    const id = function_args[1];
    const members = function_args[5].push(caller_id);
    const balance = Number(function_args[6]);
    const contractAddress = return_value.value;

    const newDao = {
      name,
      id,
      description: function_args[2],
      image: function_args[3],
      creator: caller_id,
      createdAt: new Date(micro_time),
      contractAddress,
      txHash: hash,
      members,
      balance,
      totalProposals: 0,
      totalVotes: 0,
      activeProposals: 0,
    };
    DAO.create({
      name,
      id,
      members,
      contractAddress,
      currentProposalsCount: 0,
      currentBalance: balance,
      history: [
        {
          membersCount: members.length,
          balance,
          proposalsCount: 0,
        },
      ],
    }).catch((error) => console.log('Error creating dao', error));
    notifyUsersOnDaoCreation(newDao);
  }
};

handleDaoTransaction = async (payload, error) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(payload);
};

const getDAOs = async () => {
  const daos = [];
  const contract = await aeSdk.initializeContract({
    aci: nucleusdaoACI,
    address: nucleusdao,
  });
  const res = await contract.getDAOs();
  for (let i = 0; i < res.decodedResult.length; i++) {
    let dao = res.decodedResult[i];
    for (let key in dao) {
      if (typeof dao[key] == 'bigint') {
        dao[key] = Number(dao[key]);
      }
    }
    daos.push(dao);
  }
  daos.forEach(async (dao) => {
    const {
      name,
      id,
      members,
      contractAddress,
      totalProposals: currentProposalsCount,
      balance: currentBalance,
    } = dao;
    DAO.findOne({ id }).then((existingDao) => {
      if (!existingDao) {
        notifyUsersOnDaoCreation({ name, id });
        DAO.create({
          name,
          id,
          contractAddress,
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
        }).catch((error) => console.log('Error creating dao', error));
      } else {
        if (currentProposalsCount > existingDao.currentProposalsCount) {
          notifyUsersOnProposalCreation(id, currentProposalsCount - 1);
        }
        saveDao(id, {
          members,
          balance: currentBalance,
          currentProposalsCount,
        });
      }
    });
  });
};

// Subscribe to Nucleus DAO and existing DAOs
// exports.updateDaoDB = async () => {
//   const subscriber = new _MiddlewareSubscriber(
//     'wss://testnet.aeternity.io/mdw/v2/websocket'
//   );
//   subscriber.subscribeObject(nucleusdao, transactionCallback);

//   subscriber.reconnect();

//   getDAOs();
// };

cron.schedule('*/10 * * * * *', () => {
  getDAOs();
});
