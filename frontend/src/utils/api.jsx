import axios from 'axios';
// require('dotenv').config();
 

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },  
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Task API functions
export const taskAPI = {
  // Get all tasks
  getTasks: () => api.get('/tasks'),
  
  // Create new task
  createTask: (title) => api.post('/tasks', { title }),
  
  // Update task status
  updateTaskStatus: (id, status) => api.put(`/tasks/${id}`, { status }),
  
  // Delete task (bonus feature)
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export default api;