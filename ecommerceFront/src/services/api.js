import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
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

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
};

// Items API calls
export const itemsAPI = {
  getAllItems: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    return API.get(`/items?${params.toString()}`);
  },
  getItem: (id) => API.get(`/items/${id}`),
  createItem: (itemData) => API.post('/items', itemData),
  updateItem: (id, itemData) => API.put(`/items/${id}`, itemData),
  deleteItem: (id) => API.delete(`/items/${id}`),
  getCategories: () => API.get('/items/categories'),
  getItemsByCategory: (category) => API.get(`/items/category/${category}`),
};

// Cart API calls
export const cartAPI = {
  getCart: () => API.get('/cart'),
  getCartCount: () => API.get('/cart/count'),
  addToCart: (itemData) => API.post('/cart/add', itemData),
  updateCartItem: (itemData) => API.put('/cart/update', itemData),
  removeFromCart: (itemId) => API.delete(`/cart/remove/${itemId}`),
  clearCart: () => API.delete('/cart/clear'),
};

export default API;
