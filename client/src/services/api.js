import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotelpro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    
    // Auto logout if 401 Unauthorized
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('hotelpro_token');
      localStorage.removeItem('hotelpro_user');
      window.location.href = '/login?expired=true';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
