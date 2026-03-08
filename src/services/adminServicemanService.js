// src/services/adminServicemanService.js
import api from './api';

const adminServicemanService = {
  // Get all servicemen with filters
  getAllServicemen: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.isActive !== "") queryParams.append('isActive', params.isActive);
      if (params.category !== undefined && params.category !== "") queryParams.append('category', params.category);
      if (params.availability !== undefined && params.availability !== "") queryParams.append('availability', params.availability);
      
      const response = await api.get(`/admin/servicemen?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get serviceman by ID
  getServicemanById: async (id) => {
    try {
      const response = await api.get(`/admin/servicemen/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update serviceman
  updateServiceman: async (id, data) => {
    try {
      const response = await api.put(`/admin/servicemen/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete serviceman
  deleteServiceman: async (id, permanent = false) => {
    try {
      const response = await api.delete(`/admin/servicemen/${id}?permanent=${permanent}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update serviceman status
  updateStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/admin/servicemen/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get servicemen by category
  getByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/admin/servicemen/by-category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get servicemen statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/admin/servicemen/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminServicemanService;