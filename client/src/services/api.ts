import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach admin JWT and set proper Content-Type for FormData
api.interceptors.request.use((reqConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('codex_admin_token') : null;
  if (token && reqConfig.headers) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set multipart/form-data boundary automatically when sending FormData
  if (reqConfig.data instanceof FormData && reqConfig.headers) {
    delete reqConfig.headers['Content-Type'];
  }
  return reqConfig;
});

// Response error formatting interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Unable to connect to server. Please check your connection.';

    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'string' && data.includes('<!DOCTYPE')) {
        message = `Backend API returned HTML instead of JSON (${error.response.status}). Please check Vercel API routing or VITE_API_URL configuration.`;
      } else if (typeof data?.error === 'object' && data.error?.message) {
        message = data.error.message;
      } else if (typeof data?.error === 'string') {
        message = data.error;
      } else if (typeof data?.message === 'string') {
        message = data.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    const errorData: any = {
      code: error.response?.data?.error?.code || 'REQUEST_ERROR',
      message,
      response: error.response,
      status: error.response?.status,
    };
    return Promise.reject(errorData);
  }
);
