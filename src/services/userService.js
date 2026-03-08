// src/services/userService.js
import api from './api';

const userService = {
  // Categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/user/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Nearby Servicemen
 getNearbyServicemen: async (
  lat,
  lng,
  category = '',
  maxDistance = 10000,
  sort = 'rating'
) => {
  try {
    const response = await api.get(
      `/user/nearby?lat=${lat}&lng=${lng}&category=${category}&maxDistance=${maxDistance}&sort=${sort}`
    );

    // Always return array safely
    return response?.data?.data || [];
  } catch (error) {
    console.error("getNearbyServicemen error:", error);
    return [];
  }
},

  // Get Serviceman Details (for public profile)
  getServicemanDetails: async (servicemanId) => {
    try {
      // You'll need to create this endpoint
      const response = await api.get(`/user/serviceman/${servicemanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Serviceman Reviews
  getServicemanReviews: async (servicemanId) => {
    try {
      // You'll need to create this endpoint
      const response = await api.get(`/user/serviceman/${servicemanId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Book Service
  bookService: async (bookingData) => {
    try {
      const response = await api.post('/user/book-service', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // My Bookings
  getMyBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get(`/user/bookings?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/user/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/user/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reviews
  // addReview: async (bookingId, reviewData) => {
  //   try {
  //     const response = await api.post(`/user/review/${bookingId}`, reviewData);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  // Reviews
addReview: async (reviewData) => {
  try {
    // Remove the bookingId from URL - your backend route might be '/user/review'
    // Based on your userController, it should be just '/user/review'
    const response = await api.post('/user/review', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/user/review/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/user/review/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getMyReviews: async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/user/my-reviews?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// Mark review as helpful
markReviewHelpful: async (reviewId) => {
  try {
    const response = await api.post(`/user/review/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
};



export default userService;