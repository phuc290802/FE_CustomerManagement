import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Thêm header cho ngrok nếu cần
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Chỉ thêm header này nếu đang dùng ngrok
    if (import.meta.env.MODE === 'development') {
      config.headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          window.location.href = '/login';
          break;
        case 403:
          alert('Bạn không có quyền thực hiện thao tác này');
          break;
        case 409:
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Cannot connect to server');
      alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
    }
    return Promise.reject(error);
  }
);

export default api;