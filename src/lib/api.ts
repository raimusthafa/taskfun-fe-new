import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
