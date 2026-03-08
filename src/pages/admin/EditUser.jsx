// src/pages/admin/EditUser.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminUserService from '../../services/adminUserService';
import { ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaUserTag,
  FaToggleOn,
  FaToggleOff,
  FaGlobe,
  FaSave,
  FaTimes
} from 'react-icons/fa';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.USER,
    phone: '',
    address: '',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: ['', ''] // [longitude, latitude]
    }
  });

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getUserById(id);
      const user = response.data;
      
      // Set form data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || ROLES.USER,
        phone: user.phone || '',
        address: user.address || '',
        isActive: user.isActive,
        location: user.location || {
          type: 'Point',
          coordinates: ['', '']
        }
      });

      // Show location fields if coordinates exist
      if (user.location?.coordinates?.some(coord => coord)) {
        setShowLocation(true);
      }

    } catch (error) {
      toast.error('Failed to fetch user details');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'longitude' || name === 'latitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: name === 'longitude' 
            ? [value, formData.location.coordinates[1]]
            : [formData.location.coordinates[0], value]
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare data for submission
    const submitData = { 
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      address: formData.address,
      isActive: formData.isActive
    };
    
    // Add location if provided
    if (showLocation && 
        formData.location.coordinates[0] && 
        formData.location.coordinates[1]) {
      submitData.location = {
        type: 'Point',
        coordinates: [
          parseFloat(formData.location.coordinates[0]),
          parseFloat(formData.location.coordinates[1])
        ]
      };
    } else {
      // If location was previously set but now removed, we can set it to null
      // or undefined based on your API requirements
      submitData.location = null;
    }

    try {
      const response = await adminUserService.updateUser(id, submitData);
      toast.success(response.message || 'User updated successfully!');
      navigate(`/admin/users/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/admin/users/${id}`)}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit User</h1>
          <p className="text-gray-400 text-sm mt-1">Update user information</p>
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaUser className="text-gray-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter user's full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaEnvelope className="text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="user@example.com"
              />
            </div>
          </div>

          {/* Role and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaUserTag className="text-gray-500" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={formData.role === ROLES.SUPERADMIN}
                  className={`block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none ${
                    formData.role === ROLES.SUPERADMIN ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value={ROLES.USER}>User</option>
                  <option value={ROLES.SERVICEMAN}>Serviceman</option>
                  {formData.role === ROLES.SUPERADMIN && (
                  <option value={ROLES.ADMIN}>Admin</option>,
                    <option value={ROLES.SUPERADMIN}>Super Admin</option>
                  )}
                </select>
              </div>
              {formData.role === ROLES.SUPERADMIN && (
                <p className="text-xs text-yellow-400 mt-1">
                  Super admin role cannot be changed
                </p>
              )}
            </div>

            {/* Active Status Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="flex items-center gap-3 h-[50px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  disabled={formData.role === ROLES.SUPERADMIN}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    formData.isActive
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                  } ${formData.role === ROLES.SUPERADMIN ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {formData.isActive ? (
                    <>
                      <FaToggleOn className="text-xl" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="text-xl" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-400">
                  {formData.isActive 
                    ? 'User can login' 
                    : 'User cannot login'}
                </span>
              </div>
              {formData.role === ROLES.SUPERADMIN && (
                <p className="text-xs text-yellow-400 mt-1">
                  Super admin status cannot be changed
                </p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaPhone className="text-gray-500" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pl-0 flex items-start">
                <FaMapMarkerAlt className="text-gray-500" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter user's address"
              />
            </div>
          </div>

          {/* Location Toggle */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setShowLocation(!showLocation)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FaGlobe />
              <span>{showLocation ? 'Hide location coordinates' : 'Add location coordinates'}</span>
            </button>
          </div>

          {/* Location Fields (Conditional) */}
          {showLocation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.location.coordinates[0]}
                  onChange={handleChange}
                  step="any"
                  className="block w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="e.g., -73.935242"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.location.coordinates[1]}
                  onChange={handleChange}
                  step="any"
                  className="block w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="e.g., 40.712776"
                />
              </div>
              <p className="text-xs text-gray-500 md:col-span-2">
                Format: [longitude, latitude] - Used for location-based services
              </p>
            </motion.div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(`/admin/users/${id}`)}
              className="flex-1 py-3 px-4 bg-white/5 rounded-lg text-gray-300 font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Update User</span>
                </>
              )}
            </button>
          </div>

          {/* Note about password */}
          <p className="text-xs text-gray-500 text-center">
            Note: Password cannot be changed here. Use the "Reset Password" option in user details.
          </p>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default EditUser;