const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// GET /api/tests/published — public endpoint
router.get('/published', async (req, res) => {
  try {
    const tests = await Test.find({ published: true }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    console.error('Get published tests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tests/:id — get test by testId
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findOne({ testId: req.params.id });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error('Get test by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
