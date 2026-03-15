import { MOCK_TESTS, MOCK_ATTEMPTS, MOCK_USER } from './mockData';

// API base URL - points to your GradeFlow backend
export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isProd = import.meta.env.PROD;
  
  // In production, if VITE_API_BASE_URL is missing or points to localhost, default to '/api'
  if (isProd) {
    if (!envUrl || envUrl.includes('localhost')) {
      return '/api';
    }
    return envUrl;
  }
  
  // In development, use environment variable or fallback to localhost
  return envUrl || 'http://localhost:5000/api';
})();


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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    console.info('Falling back to dummy data...');

    // Return dummy data based on the endpoint
    if (endpoint.includes(API_ENDPOINTS.GET_PUBLISHED_TESTS)) {
      return MOCK_TESTS;
    }
    if (endpoint.includes(API_ENDPOINTS.GET_ATTEMPTS)) {
      return MOCK_ATTEMPTS;
    }
    if (endpoint.includes(API_ENDPOINTS.PROFILE)) {
      return MOCK_USER;
    }
    if (endpoint.includes(API_ENDPOINTS.LOGIN)) {
      return { token: 'mock-token', user: MOCK_USER };
    }

    // Rethrow if no mock data available
    throw error;
  }
};

