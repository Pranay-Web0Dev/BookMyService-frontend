// src/services/adminCategoryService.js
import api from './api';

const adminCategoryService = {
  // Get all categories
  getAllCategories: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (typeof params.isActive === "boolean") {
        queryParams.append("isActive", params.isActive);
      }
      const response = await api.get(`/serviceman/category?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/admin/category', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/serviceman/category/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/admin/category/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete category
  deleteCategory: async (id, permanent = false, force = false) => {
    try {
      const response = await api.delete(`/admin/category/${id}?permanent=${permanent}&force=${force}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminCategoryService;