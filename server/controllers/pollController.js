const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({
      question,
      options: options.map(text => ({ text }))
    });
    const newPoll = await poll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    poll.question = question;
    poll.options = options;
    
    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.vote = async (req, res) => {
//   try {
//     const { pollId, optionId } = req.params;
//     const poll = await Poll.findById(pollId);
    
//     if (!poll) {
//       return res.status(404).json({ message: 'Poll not found' });
//     }

//     const option = poll.options.id(optionId);
//     if (!option) {
//       return res.status(404).json({ message: 'Option not found' });
//     }

//     option.votes += 1;
//     await poll.save();
    
//     res.json(poll);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.vote = async (req, res) => {
    try {
      const { pollId, optionId } = req.params;
      const voterId = new mongoose.Types.ObjectId();
  
      // Check if voter ID has already voted
      const existingVote = await Vote.findOne({ pollId, voterId });
      if (existingVote) {
        return res.status(400).json({ message: 'You have already voted on this poll' });
      }
  
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
  
      const option = poll.options.id(optionId);
      if (!option) {
        return res.status(404).json({ message: 'Option not found' });
      }
  
      // Record the vote with voter ID
      await Vote.create({ pollId, optionId, voterId });
  
      // Increment the vote count
      option.votes += 1;
      await poll.save();
      
      // Return both poll data and voter ID
      res.json({ poll, voterId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };