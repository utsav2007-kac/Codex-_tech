import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach admin JWT if present
api.interceptors.request.use((reqConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('codex_admin_token') : null;
  if (token && reqConfig.headers) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

// Response error formatting interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rawError = error.response?.data?.error;
    const message =
      (typeof rawError === 'object' && rawError?.message) ||
      (typeof rawError === 'string' && rawError) ||
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to server. Please check your connection.';

    const errorData: any = {
      code: error.response?.data?.error?.code || 'REQUEST_ERROR',
      message,
      response: error.response,
    };
    return Promise.reject(errorData);
  }
);
