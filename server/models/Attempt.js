const mongoose = require('mongoose');

const attemptAnswerSchema = new mongoose.Schema({
  questionId: { type: Number },
  selected: { type: String }
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  testId: {
    type: String,
    required: true
  },
  answers: [attemptAnswerSchema],
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number, // seconds
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
