const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

// Public routes
// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single poll
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vote on a poll
router.post('/:pollId/vote/:optionId', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const option = poll.options.id(req.params.optionId);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Check if user has already voted
    const voterId = req.body.voterId;
    if (voterId) {
      const existingVote = await Vote.findOne({
        pollId: req.params.pollId,
        voterId: voterId
      });
      if (existingVote) {
        return res.status(400).json({ message: 'You have already voted on this poll' });
      }
    }

    // Record the vote
    option.votes += 1;
    await poll.save();

    // Create a new vote record
    const vote = new Vote({
      pollId: req.params.pollId,
      optionId: req.params.optionId,
      voterId: voterId || new mongoose.Types.ObjectId()
    });
    await vote.save();

    res.json({
      poll,
      voterId: vote.voterId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (admin only)
// Create a poll
router.post('/', async (req, res) => {
  try {
    const poll = new Poll({
      question: req.body.question,
      options: req.body.options.map(option => ({
        text: option,
        votes: 0
      }))
    });

    const newPoll = await poll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a poll
router.put('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Update question if provided
    if (req.body.question) {
      poll.question = req.body.question;
    }

    // Update options if provided
    if (req.body.options) {
      // Preserve existing votes
      const existingOptions = poll.options.reduce((acc, option) => {
        acc[option.text] = option.votes;
        return acc;
      }, {});

      poll.options = req.body.options.map(text => ({
        text,
        votes: existingOptions[text] || 0
      }));
    }

    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a poll
router.delete('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Delete associated votes
    await Vote.deleteMany({ pollId: req.params.id });

    await poll.deleteOne();
    res.json({ message: 'Poll deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 