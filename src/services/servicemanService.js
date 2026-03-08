// src/services/servicemanService.js
import api from './api';

const servicemanService = {
  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/serviceman/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createProfile: async (profileData) => {
    try {
      const response = await api.post('/serviceman/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/serviceman/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/serviceman/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bookings
  getMyBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/serviceman/bookings?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.put(`/serviceman/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Location
  updateLocation: async (coordinates) => {
    try {
      const response = await api.put('/serviceman/update-location', { coordinates });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default servicemanService;