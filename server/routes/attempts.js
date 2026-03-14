const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const Test = require('../models/Test');

// POST /api/attempts/submit — submit a test attempt
router.post('/submit', async (req, res) => {
  try {
    const { studentId, testId, answers, timeTaken } = req.body;

    if (!studentId || !testId) {
      return res.status(400).json({ message: 'studentId and testId are required' });
    }

    // Check if already submitted
    const existingAttempt = await Attempt.findOne({ studentId, testId });
    if (existingAttempt) {
      return res.status(400).json({ message: 'You have already submitted this test' });
    }

    // Fetch the test to auto-score
    const test = await Test.findOne({ testId });
    let score = 0;
    let totalMarks = 0;

    if (test && test.questions) {
      totalMarks = test.questions.reduce((sum, q) => sum + (q.marks || 2), 0);

      // Score: compare selected answer with correct answer
      answers.forEach(ans => {
        const question = test.questions.find(q => q.id === ans.questionId);
        if (question && question.answer && ans.selected === question.answer) {
          score += question.marks || 2;
        }
      });
    } else {
      // If test not found, give partial credit based on answered count
      totalMarks = (answers.length || 1) * 2;
      score = answers.length * 2;
    }

    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    const attempt = await Attempt.create({
      studentId,
      testId,
      answers,
      score,
      percentage,
      timeTaken: timeTaken || 0
    });

    res.status(201).json({
      message: 'Test submitted successfully',
      score,
      totalMarks,
      percentage,
      attemptId: attempt._id
    });
  } catch (error) {
    console.error('Submit attempt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/attempts — get all attempts
router.get('/', async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ submittedAt: -1 });
    res.json(attempts);
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/attempts/analysis/:studentId/:testId — get analysis
router.get('/analysis/:studentId/:testId', async (req, res) => {
  try {
    const { studentId, testId } = req.params;

    const attempt = await Attempt.findOne({ studentId, testId });
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    const test = await Test.findOne({ testId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Build question-by-question analysis
    const questionAnalysis = test.questions.map(q => {
      const studentAnswer = attempt.answers.find(a => a.questionId === q.id);
      return {
        questionId: q.id,
        questionText: q.text,
        correctAnswer: q.answer,
        selectedAnswer: studentAnswer ? studentAnswer.selected : null,
        isCorrect: studentAnswer ? studentAnswer.selected === q.answer : false,
        marks: q.marks || 2
      };
    });

    res.json({
      studentId: attempt.studentId,
      testId: attempt.testId,
      score: attempt.score,
      percentage: attempt.percentage,
      timeTaken: attempt.timeTaken,
      submittedAt: attempt.submittedAt,
      totalQuestions: test.questions.length,
      correctAnswers: questionAnalysis.filter(q => q.isCorrect).length,
      wrongAnswers: questionAnalysis.filter(q => !q.isCorrect && q.selectedAnswer).length,
      unanswered: questionAnalysis.filter(q => !q.selectedAnswer).length,
      questions: questionAnalysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
