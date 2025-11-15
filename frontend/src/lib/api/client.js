import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (development)
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error handling with user-friendly messages
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        userMessage = data.detail || 'Invalid request. Please check your input.';
      } else if (status === 404) {
        userMessage = 'Resource not found.';
      } else if (status === 500) {
        userMessage = 'Server error. Our team has been notified.';
      } else {
        userMessage = data.detail || data.message || userMessage;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', status, data);
      }
    } else if (error.request) {
      // Request made but no response
      userMessage = 'Network error. Please check your internet connection.';
      if (process.env.NODE_ENV === 'development') {
        console.error('Network Error:', error.message);
      }
    } else if (process.env.NODE_ENV === 'development') {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    // Attach user-friendly message to error
    error.userMessage = userMessage;
    return Promise.reject(error);
  }
);

// ==================== Contact API ====================
export const contactAPI = {
  submit: async (data) => {
    const response = await api.post('/api/contact', data);
    return response.data;
  },
  getSubmissions: async (status = null, limit = 50, skip = 0) => {
    const response = await api.get('/api/contact/submissions', {
      params: { status, limit, skip },
    });
    return response.data;
  },
};

// ==================== Newsletter API ====================
export const newsletterAPI = {
  subscribe: async (email) => {
    const response = await api.post('/api/newsletter/subscribe', { email });
    return response.data;
  },
  unsubscribe: async (email) => {
    const response = await api.post('/api/newsletter/unsubscribe', null, {
      params: { email },
    });
    return response.data;
  },
  getSubscribers: async (status = 'active', limit = 100, skip = 0) => {
    const response = await api.get('/api/newsletter/subscribers', {
      params: { status, limit, skip },
    });
    return response.data;
  },
};

// ==================== Portfolio API ====================
export const portfolioAPI = {
  getAll: async (category = null, featured = null, status = 'published', limit = 50, skip = 0) => {
    const response = await api.get('/api/portfolio', {
      params: { category, featured, status, limit, skip },
    });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/api/portfolio/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/portfolio', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/portfolio/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/portfolio/${id}`);
    return response.data;
  },
};

// ==================== Blog API ====================
export const blogAPI = {
  getAll: async (category = null, featured = null, status = 'published', limit = 50, skip = 0) => {
    const response = await api.get('/api/blog', {
      params: { category, featured, status, limit, skip },
    });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/api/blog/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/blog', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/blog/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/blog/${id}`);
    return response.data;
  },
};

// ==================== Services API ====================
export const servicesAPI = {
  submitInquiry: async (data) => {
    const response = await api.post('/api/services/inquiry', data);
    return response.data;
  },
  bookConsultation: async (data) => {
    const response = await api.post('/api/services/book-consultation', data);
    return response.data;
  },
  getInquiries: async (status = null, service_type = null, limit = 50, skip = 0) => {
    const response = await api.get('/api/services/inquiries', {
      params: { status, service_type, limit, skip },
    });
    return response.data;
  },
  getConsultations: async (status = null, limit = 50, skip = 0) => {
    const response = await api.get('/api/services/consultations', {
      params: { status, limit, skip },
    });
    return response.data;
  },
};

export default api;