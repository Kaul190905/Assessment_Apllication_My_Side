// API base URL - points to your GradeFlow backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Test endpoints
  GET_PUBLISHED_TESTS: '/tests/published',
  GET_TEST_BY_ID: '/tests',
  
  // Attempt endpoints
  SUBMIT_ATTEMPT: '/attempts/submit',
  GET_ATTEMPTS: '/attempts',
  GET_ANALYSIS: '/attempts/analysis',
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};
