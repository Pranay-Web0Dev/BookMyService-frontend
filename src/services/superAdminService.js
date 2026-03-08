// src/services/superAdminService.js
import api from './api';

const superAdminService = {
  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/superadmin/create-admin', adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all admins with pagination and filters
  getAllAdmins: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.isActive !== undefined && params.isActive !== '') {
  queryParams.append('isActive', params.isActive);
}
      
      const response = await api.get(`/superadmin/admins?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single admin by ID
  getAdminById: async (id) => {
    try {
      const response = await api.get(`/superadmin/admin/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete admin (soft or permanent)
  deleteAdmin: async (id, permanent = false) => {
    try {
      const response = await api.delete(`/superadmin/admin/${id}?permanent=${permanent}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update admin status (activate/deactivate)
  updateAdminStatus: async (id, isActive) => {
    try {
      const response = await api.put(`/superadmin/admin/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default superAdminService;