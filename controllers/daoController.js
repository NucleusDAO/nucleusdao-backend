const DAO = require('../models/daoModel');
const { notifyUsersOnDaoCreation } = require('./notificationController');

async function saveDao(daoInfo) {
  const { id, members, balance, currentProposalsCount } = daoInfo;
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

exports.createDao = async (req, res) => {
  try {
    const { name, id, members, currentProposalsCount, currentBalance } =
      req.body;
    if (!name || !id || !members) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    await DAO.create({
      name,
      id,
      members,
      currentProposalsCount,
      currentBalance,
    });
    await notifyUsersOnDaoCreation({ name, id });
    res.status(201).send({ message: 'DAO created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.updateDao = async (req, res) => {
  try {
    const daoInfo = req.body;
    if (!daoInfo.id) {
      return res.status(400).send({ message: 'DAO ID is required' });
    }

    const updatedDao = await DAO.findOneAndUpdate({ id: daoInfo.id }, daoInfo);
    await saveDao(daoInfo);

    if (!updatedDao) {
      return res.status(404).send({ message: 'DAO not found' });
    }
    res.send({ message: 'DAO successfully updated', dao: updatedDao });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getBalanceHistory = async (req, res) => {
  try {
    const dao = await DAO.findOne({ id: req.params.id });
    const history = dao.history.map((h) => ({
      timestamp: h.timestamp,
      balance: h.balance,
    }));
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getMembersHistory = async (req, res) => {
  try {
    const dao = await DAO.findOne({ id: req.params.id });
    const history = dao.history.map((h) => ({
      timestamp: h.timestamp,
      membersCount: h.membersCount,
    }));
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getProposalsHistory = async (req, res) => {
  try {
    const dao = await DAO.findOne({ id: req.params.id });
    const history = dao.history.map((h) => ({
      timestamp: h.timestamp,
      proposalsCount: h.proposalsCount,
    }));
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
