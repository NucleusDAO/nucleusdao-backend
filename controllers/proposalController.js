const Proposal = require('../models/proposalModel');

exports.createProposal = async (req, res) => {
  try {
    const newProposal = new Proposal(req.body);
    await newProposal.save();
    res.status(201).send(newProposal);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
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
    res.send(updatedProposal);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
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
    res.send(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.status(200).send(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
