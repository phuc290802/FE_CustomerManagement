import axios from 'axios';

// Lấy API URL từ environment variable
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Thêm header cho ngrok
    if (API_URL.includes('ngrok-free.dev')) {
      config.headers['ngrok-skip-browser-warning'] = '69420';
    }
    
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (giữ nguyên)
// ...

export default api;