// src/services/authService.js
import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Get current user profile (with serviceman profile if applicable)
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile (name, phone, address, password)
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      
      // Update stored user data
      if (response.data.data) {
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        const updatedUser = { ...currentUser, ...response.data.data };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update serviceman profile (category, experience, skills, price, bio, availability)
  updateServicemanProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/update-serviceman-profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update location only (address with geocoding)
  updateLocation: async (address) => {
    try {
      const response = await api.put('/auth/update-location', { address });
      
      // Update stored user data
      if (response.data.data) {
        const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        const updatedUser = { 
          ...currentUser, 
          address: response.data.data.address,
          location: response.data.data.location 
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all categories for serviceman profile dropdown
  getCategories: async () => {
    try {
      const response = await api.get('/auth/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  }
};

export default authService;