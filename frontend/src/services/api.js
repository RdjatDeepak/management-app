import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';
// ✅ This handles both: 
// 1. Production (Render) using the VITE_API_URL variable
// 2. Local Development using the localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Project APIs
export const projectAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  addMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),
  getMembers: (projectId) => api.get(`/projects/${projectId}/members`),
};

// Task APIs
export const taskAPI = {
  create: (projectId, data) => api.post(`/tasks/project/${projectId}`, data),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, {}, { params: { status } }),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: (projectId) => api.get(`/dashboard/project/${projectId}`),
};

export default api;
