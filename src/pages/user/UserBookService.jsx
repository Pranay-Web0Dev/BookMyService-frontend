// src/pages/user/UserBookService.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaTools,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaFileAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaLocationArrow
} from 'react-icons/fa';

const UserBookService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [serviceman, setServiceman] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    serviceManId: '',
    categoryId: '',
    bookingDate: null,
    bookingTime: '',
    address: '',
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    problemDescription: '',
    price: 0
  });

  // Available time slots (you can modify these based on your requirements)
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    // Get serviceman data from navigation state
    if (location.state?.serviceman) {
      setServiceman(location.state.serviceman);
      setFormData(prev => ({
        ...prev,
        serviceManId: location.state.serviceman.userId._id,
        categoryId: location.state.serviceman.category._id,
        price: location.state.serviceman.pricePerHour || 0
      }));
    } else {
      // If no serviceman data, redirect to browse page
      toast.error('Please select a serviceman first');
      navigate('/user/browse');
    }

    fetchCategories();
    
    // Set user's address from profile if available
    if (user?.address) {
      setFormData(prev => ({ ...prev, address: user.address }));
    }
    
    // Set user's location from profile if available
    if (user?.location?.coordinates) {
      setFormData(prev => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates: user.location.coordinates
        }
      }));
    }
  }, [location.state, navigate, user]);

  const fetchCategories = async () => {
    try {
      const response = await userService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = [position.coords.longitude, position.coords.latitude];
        setFormData(prev => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates
          }
        }));
        
        // Reverse geocode to get address (optional)
        // You can implement reverse geocoding here using a service like Google Maps or OpenStreetMap
        
        setGettingLocation(false);
        toast.success('Location updated successfully');
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get your location. Please enable location services.');
        setGettingLocation(false);
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      bookingDate: date
    }));
  };

  const calculateTotalPrice = () => {
    // You can add more complex pricing logic here
    // For now, just return the base price
    return formData.price;
  };

  const validateForm = () => {
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return false;
    }
    if (!formData.bookingDate) {
      toast.error('Please select a booking date');
      return false;
    }
    if (!formData.bookingTime) {
      toast.error('Please select a booking time');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      toast.error('Please set your location');
      return false;
    }
    if (!formData.problemDescription.trim()) {
      toast.error('Please describe the problem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const bookingData = {
        ...formData,
        bookingDate: formData.bookingDate.toISOString()
      };

      const response = await userService.bookService(bookingData);
      
      toast.success('Booking created successfully!');
      
      // Navigate to booking details page
      navigate(`/user/bookings/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!serviceman) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Book Service</h1>
          <p className="text-gray-400 text-sm mt-1">
            Complete the form below to book your service
        </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form - Left Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaTools className="text-blue-400" />
                Service Category
              </h2>
              
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Date & Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                Schedule
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Booking Date</label>
                  <DatePicker
                    selected={formData.bookingDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select date"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Booking Time</label>
                  <select
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Location & Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                Service Location
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Complete Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Enter your complete address"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-400">Location Coordinates</label>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      <FaLocationArrow className={gettingLocation ? 'animate-spin' : ''} />
                      <span>{gettingLocation ? 'Getting...' : 'Use My Location'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.location.coordinates[1] || ''}
                      placeholder="Latitude"
                      readOnly
                      className="px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white/50"
                    />
                    <input
                      type="text"
                      value={formData.location.coordinates[0] || ''}
                      placeholder="Longitude"
                      readOnly
                      className="px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Problem Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaFileAlt className="text-blue-400" />
                Problem Description
              </h2>
              
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Describe the problem in detail..."
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Confirm Booking</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Booking Summary - Right Column */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 sticky top-24"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Booking Summary</h2>
            
            {/* Serviceman Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-white font-medium">{serviceman.userId?.name}</h3>
                <p className="text-sm text-gray-400">{serviceman.category?.name}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="py-4 border-b border-white/10 space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Price per hour</span>
                <span className="text-white">₹{serviceman.pricePerHour}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated duration</span>
                <span className="text-white">1 hour</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Service fee</span>
                <span className="text-white">Free</span>
              </div>
            </div>

            {/* Total */}
            <div className="py-4">
              <div className="flex justify-between text-lg">
                <span className="text-white font-semibold">Total Amount</span>
                <span className="text-blue-400 font-bold">₹{calculateTotalPrice()}</span>
              </div>
            </div>

            {/* Serviceman Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <FaTools className="text-blue-400" />
                <span>{serviceman.experience} years experience</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaClock className="text-blue-400" />
                <span>{serviceman.totalCompletedJobs} jobs completed</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>Rating: {serviceman.averageRating?.toFixed(1)} / 5</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="text-white text-sm font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {serviceman.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-xs text-yellow-400">
                <strong>Note:</strong> Your booking will be pending until the serviceman confirms it. 
                You can cancel the booking anytime before it's confirmed.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserBookService;