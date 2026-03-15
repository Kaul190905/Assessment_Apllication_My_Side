export const MOCK_TESTS = [
  {
    testId: 'mock-1',
    topic: 'Data Structures & Algorithms',
    count: 20,
    duration: 60,
    difficulty: 'Hard',
    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    questions: []
  },
  {
    testId: 'mock-2',
    topic: 'General Aptitude - Live',
    count: 15,
    duration: 30,
    difficulty: 'Easy',
    startDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    questions: []
  },
  {
    testId: 'mock-3',
    topic: 'Web Development (React)',
    count: 25,
    duration: 45,
    difficulty: 'Medium',
    startDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    endDate: new Date(Date.now() + 14400000).toISOString(), // 4 hours later
    createdAt: new Date().toISOString(),
    questions: []
  },
  {
    testId: 'mock-4',
    topic: 'Database Management Systems',
    count: 12,
    duration: 20,
    difficulty: 'Medium',
    startDate: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    createdAt: new Date().toISOString(),
    questions: []
  },
  {
    testId: 'mock-5',
    topic: 'Machine Learning Basics',
    count: 30,
    duration: 90,
    difficulty: 'Hard',
    startDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    endDate: new Date(Date.now() + 259200000).toISOString(),
    createdAt: new Date().toISOString(),
    questions: []
  }
];

export const MOCK_ATTEMPTS = [
  {
    _id: 'attempt-1',
    testId: {
      testId: 'mock-prev-1',
      topic: 'Java Basics',
      count: 20
    },
    studentId: 'STU2025001',
    score: 35,
    percentage: 87.5,
    status: 'completed',
    createdAt: new Date(Date.now() - 604800000).toISOString()
  }
];

export const MOCK_USER = {
  name: 'Demo Student',
  email: 'STU2025001',
  role: 'student'
};
