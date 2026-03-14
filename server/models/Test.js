const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  marks: { type: Number, default: 2 },
  answer: { type: String } // The correct answer (option text)
}, { _id: false });

const testSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
    unique: true
  },
  topic: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // minutes
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questions: [questionSchema],
  published: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: String,
    default: 'Staff'
  }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
