const Proposal = require('../models/proposalModel');
const { notifyUsersOnProposalCreation } = require('./notificationController');

exports.createProposal = async (req, res) => {
  try {
    const newProposal = new Proposal(req.body);
    await newProposal.save();
    await notifyUsersOnProposalCreation(req.body.daoId, req.body.id);
    res
      .status(201)
      .send({ message: 'Proposal successfully created', newProposal });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating proposal' });
  }
};

exports.updateProposal = async (req, res) => {
  try {
    const updatedProposal = await Proposal.findOneAndUpdate(
      { id: req.params.id, daoId: req.params.daoId },
      req.body,
      { new: true }
    );
    if (!updatedProposal) {
      return res.status(404).send({ message: 'Proposal not found' });
    }
    res.send({ message: 'Proposal updated successfully', updatedProposal });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating proposal' });
  }
};

exports.getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({
      id: req.params.id,
      daoId: req.params.daoId,
    });
    if (!proposal) {
      return res.status(404).send({ message: 'Proposal not found' });
    }
    res.status.send(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting proposal' });
  }
};

exports.getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.status(200).send(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting all proposals' });
  }
};
