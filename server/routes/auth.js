const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email OR rollNumber (frontend sends rollNumber as "email")
    const user = await User.findOne({
      $or: [
        { email: email },
        { rollNumber: email }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      rollNumber: user.rollNumber,
      department: user.department,
      id: user._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, rollNumber, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      name,
      rollNumber: rollNumber || email,
      department: department || 'Computer Science'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      rollNumber: user.rollNumber,
      department: user.department,
      id: user._id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/profile (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
