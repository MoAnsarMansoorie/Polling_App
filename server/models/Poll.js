const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [optionSchema],
  totalVotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save middleware to calculate total votes
pollSchema.pre('save', function(next) {
  this.totalVotes = this.options.reduce((sum, option) => sum + option.votes, 0);
  next();
});

module.exports = mongoose.model('Poll', pollSchema);