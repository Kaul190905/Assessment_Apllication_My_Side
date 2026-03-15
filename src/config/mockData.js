export const MOCK_TESTS = [
  {
    testId: 'mock-1',
    topic: 'Data Structures - Mock Test',
    count: 20,
    duration: 60,
    difficulty: 'Medium',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    questions: []
  },
  {
    testId: 'mock-2',
    topic: 'General Aptitude - Live Mock',
    count: 15,
    duration: 30,
    difficulty: 'Easy',
    startDate: new Date(Date.now() - 3600000).toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
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
