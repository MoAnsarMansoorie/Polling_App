const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  optionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  voterId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure one vote per poll per voter
voteSchema.index({ pollId: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);