const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/attempts', require('./routes/attempts'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GradeFlow Assessment API is running' });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'GradeFlow API',
    endpoints: {
      auth: '/api/auth (login, register, profile)',
      tests: '/api/tests (published, :id)',
      attempts: '/api/attempts (submit, list, analysis)'
    }
  });
});

// Export app for Vercel
module.exports = app;

// Start server only if not in production (Vercel handles this for serverless functions)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 GradeFlow Backend running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
  });
}

