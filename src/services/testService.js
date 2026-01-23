import { apiCall, API_ENDPOINTS } from '../config/api';

export const testService = {
  // Get all published tests
  getPublishedTests: async () => {
    return await apiCall(API_ENDPOINTS.GET_PUBLISHED_TESTS);
  },

  // Get specific test by ID
  getTestById: async (testId) => {
    return await apiCall(`${API_ENDPOINTS.GET_TEST_BY_ID}/${testId}`);
  },

  // Submit test attempt
  submitAttempt: async (attemptData) => {
    return await apiCall(API_ENDPOINTS.SUBMIT_ATTEMPT, {
      method: 'POST',
      body: JSON.stringify(attemptData),
    });
  },

  // Get student's attempts
  getMyAttempts: async () => {
    return await apiCall(API_ENDPOINTS.GET_ATTEMPTS);
  },

  // Get analysis for a specific attempt
  getAttemptAnalysis: async (studentId, testId) => {
    return await apiCall(`${API_ENDPOINTS.GET_ANALYSIS}/${studentId}/${testId}`);
  },
};

export const authService = {
  // Login
  login: async (email, password) => {
    return await apiCall(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  register: async (userData) => {
    return await apiCall(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get profile
  getProfile: async () => {
    return await apiCall(API_ENDPOINTS.PROFILE);
  },
};
