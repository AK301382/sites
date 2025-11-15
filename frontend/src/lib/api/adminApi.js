import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeader();
    config.headers = { ...config.headers, ...authHeaders };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// ==================== Dashboard API ====================
export const dashboardAPI = {
  getStats: async () => {
    const response = await adminApi.get('/dashboard/stats');
    return response.data;
  },
  getRecentActivity: async (limit = 10) => {
    const response = await adminApi.get('/dashboard/recent-activity', {
      params: { limit }
    });
    return response.data;
  },
};

// ==================== Contacts API ====================
export const adminContactsAPI = {
  getAll: async (statusFilter = null, limit = 100, skip = 0) => {
    const response = await adminApi.get('/contacts', {
      params: { status_filter: statusFilter, limit, skip }
    });
    return response.data;
  },
  getById: async (contactId) => {
    const response = await adminApi.get(`/contacts/${contactId}`);
    return response.data;
  },
  updateStatus: async (contactId, newStatus) => {
    const response = await adminApi.put(`/contacts/${contactId}/status`, null, {
      params: { new_status: newStatus }
    });
    return response.data;
  },
  delete: async (contactId) => {
    const response = await adminApi.delete(`/contacts/${contactId}`);
    return response.data;
  },
};

// ==================== Newsletter API ====================
export const adminNewsletterAPI = {
  getAll: async (statusFilter = 'active', limit = 100, skip = 0) => {
    const response = await adminApi.get('/newsletter', {
      params: { status_filter: statusFilter, limit, skip }
    });
    return response.data;
  },
  updateStatus: async (subscriberId, newStatus) => {
    const response = await adminApi.put(`/newsletter/${subscriberId}/status`, null, {
      params: { new_status: newStatus }
    });
    return response.data;
  },
  delete: async (subscriberId) => {
    const response = await adminApi.delete(`/newsletter/${subscriberId}`);
    return response.data;
  },
};

// ==================== Blog API (Admin) ====================
export const adminBlogAPI = {
  getAll: async (category = null, status = null, limit = 50, skip = 0) => {
    const response = await axios.get(`${API_BASE_URL}/api/blog`, {
      params: { category, status, limit, skip },
      headers: getAuthHeader()
    });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await axios.get(`${API_BASE_URL}/api/blog/${slug}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/api/blog`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/api/blog/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/blog/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};

// ==================== Portfolio API (Admin) ====================
export const adminPortfolioAPI = {
  getAll: async (category = null, status = null, limit = 50, skip = 0) => {
    const response = await axios.get(`${API_BASE_URL}/api/portfolio`, {
      params: { category, status, limit, skip },
      headers: getAuthHeader()
    });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await axios.get(`${API_BASE_URL}/api/portfolio/${slug}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/api/portfolio`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/api/portfolio/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/portfolio/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};

export default adminApi;
