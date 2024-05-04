const DAO = require('../models/daoModel');

async function saveDao(daoInfo) {
  const { id, members, balance, proposals } = daoInfo;
  const dao = await DAO.findOne({ id });
  // Update current values
  dao.currentMembers = members;
  dao.currentBalance = balance;
  dao.currentProposalsCount = proposals;

  // Push new history entry
  dao.history.push({
    membersCount: members,
    balance: balance,
    proposalsCount: proposals,
  });

  await dao.save();
}

exports.createDao = async (req, res) => {
  try {
    const {
      name,
      id,
      members,
      currentMembers,
      currentProposalsCount,
      currentBalance,
    } = req.body;
    if (
      !name ||
      !id ||
      !members ||
      !currentMembers ||
      !currentProposalsCount ||
      !currentBalance
    ) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    await DAO.create({
      name,
      id,
      members,
      currentMembers,
      currentProposalsCount,
      currentBalance,
    });
    res.status(201).send({ message: 'DAO created successfully', dao: newDao });
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

    const updatedDao = await DAO.findByIdAndUpdate(daoInfo.id);

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
    const dao = await DAO.findById(req.params.id);
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
    const dao = await DAO.findById(req.params.id);
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
    const dao = await DAO.findById(req.params.id);
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
