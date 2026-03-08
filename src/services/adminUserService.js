// src/services/adminUserService.js
import api from './api';

const adminUserService = {
  // Get all users with filters
  getAllUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.isActive !== "" && params.isActive !== undefined) queryParams.append('isActive', params.isActive);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/admin/users?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (id, permanent = false) => {
    try {
      const response = await api.delete(`/admin/users/${id}?permanent=${permanent}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset user password
  resetPassword: async (id, newPassword) => {
    try {
      const response = await api.post(`/admin/users/${id}/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk update user status
  bulkUpdateStatus: async (userIds, isActive) => {
    try {
      const response = await api.patch('/admin/users/bulk-status', { userIds, isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminUserService;