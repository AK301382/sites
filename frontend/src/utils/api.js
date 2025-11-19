import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Services
  getServices: () => apiClient.get('/services'),
  getService: (id) => apiClient.get(`/services/${id}`),
  createService: (data) => apiClient.post('/services', data),
  updateService: (id, data) => apiClient.put(`/services/${id}`, data),
  deleteService: (id) => apiClient.delete(`/services/${id}`),

  // Artists
  getArtists: () => apiClient.get('/artists'),
  getArtist: (id) => apiClient.get(`/artists/${id}`),
  createArtist: (data) => apiClient.post('/artists', data),
  updateArtist: (id, data) => apiClient.put(`/artists/${id}`, data),
  deleteArtist: (id) => apiClient.delete(`/artists/${id}`),

  // Gallery
  getGallery: (params) => apiClient.get('/gallery', { params }),
  createGalleryItem: (data) => apiClient.post('/gallery', data),
  updateGalleryItem: (id, data) => apiClient.put(`/gallery/${id}`, data),
  deleteGalleryItem: (id) => apiClient.delete(`/gallery/${id}`),

  // Appointments
  getAppointments: () => apiClient.get('/appointments'),
  getAppointment: (id) => apiClient.get(`/appointments/${id}`),
  createAppointment: (data) => apiClient.post('/appointments', data),
  updateAppointment: (id, data) => apiClient.put(`/appointments/${id}`, data),
  updateAppointmentStatus: (id, status) => apiClient.patch(`/appointments/${id}/status?status=${status}`),
  deleteAppointment: (id) => apiClient.delete(`/appointments/${id}`),

  // Contact
  getContactMessages: () => apiClient.get('/contact'),
  createContactMessage: (data) => apiClient.post('/contact', data),
  deleteContactMessage: (id) => apiClient.delete(`/contact/${id}`),

  // Admin
  adminLogin: (credentials) => apiClient.post('/admin/login', credentials),
  adminLogout: () => apiClient.post('/admin/logout'),
  getAdminStats: () => apiClient.get('/admin/stats'),
};

export default api;
