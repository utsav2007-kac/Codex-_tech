import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response error formatting interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Unable to connect to server. Please check your connection.',
    };
    return Promise.reject(errorData);
  }
);
