// src/services/adminService.js
import api from './api';

const adminService = {
  // Dashboard totals
  getTotalCounts: async () => {
    try {
      const response = await api.get('/admin/dashboard/totals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Booking statistics
  getBookingStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/booking-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Revenue data
  getRevenue: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/admin/dashboard/revenue?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Top performers
  getTopPerformers: async (limit = 5) => {
    try {
      const response = await api.get(`/admin/dashboard/top-performers?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Category-wise top performers
  getCategoryTopPerformers: async (categoryId = '') => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      
      const response = await api.get(`/admin/dashboard/category-top-performers?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Recent bookings
  getRecentBookings: async (limit = 5) => {
    try {
      const response = await api.get(`/admin/dashboard/recent-bookings?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Monthly trends
  getMonthlyTrends: async (months = 6) => {
    try {
      const response = await api.get(`/admin/dashboard/monthly-trends?months=${months}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllCategories: async () => {
  try {
    const response = await api.get('/admin/category'); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
};



export default adminService;