import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

/**
 * Request interceptor - add auth token
 */
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor - handle errors
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized - dispatch event for AuthContext to listen to
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event that AuthContext can listen for
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: 'Unauthorized' }));
    }
    
    // Pass error to caller
    return Promise.reject(error);
  }
);

export default axiosClient;
