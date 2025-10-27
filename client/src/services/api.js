import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle token expiration
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refresh: () => api.post('/auth/refresh'),
};

// User API
export const userAPI = {
  updateRole: (roleData) => api.put('/auth/update-role', roleData),
};

// Assignment API
export const assignmentAPI = {
  create: (assignmentData) => api.post('/assignments', assignmentData),
  getAll: () => api.get('/assignments'),
  getById: (id) => api.get(`/assignments/${id}`),
  getByCode: (code) => api.get(`/assignments/search/${code}`),
  update: (id, assignmentData) => api.put(`/assignments/${id}`, assignmentData),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Submission API
export const submissionAPI = {
  upload: (formData) => api.post('/submissions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getByAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  getStudentSubmissions: () => api.get('/submissions/student'),
  getTeacherSubmissions: () => api.get('/submissions/teacher'),
  grade: (id, gradeData) => api.post(`/submissions/${id}/grade`, gradeData),
  gradeWithFile: (id, formData) => api.post(`/submissions/${id}/grade`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateStatus: (id, status) => api.put(`/submissions/${id}/status?status=${status}`),
  download: (id) => api.get(`/submissions/download/${id}`, {
    responseType: 'blob',
  }),
  getStats: () => api.get('/submissions/stats'),
};

export default api;