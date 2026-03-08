// src/services/adminBookingService.js
import api from './api';

const adminBookingService = {
  // Get all bookings with filters
  getAllBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.search) queryParams.append('search', params.search);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/admin/bookings?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/admin/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/admin/bookings/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminBookingService;