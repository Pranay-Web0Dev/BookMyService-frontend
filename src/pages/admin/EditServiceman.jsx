// src/pages/admin/EditServiceman.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import adminServicemanService from '../../services/adminServicemanService';
import adminCategoryService from '../../services/adminCategoryService';
import { 
  ROLES, 
  VALIDATION_MESSAGES,
  FILE_UPLOAD,
  AVAILABILITY_STATUS
} from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaTools,
  FaClock,
  FaToggleOn,
  FaToggleOff,
  FaGlobe,
  FaIdCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaUpload,
  FaWrench,
  FaStar,
  FaBriefcase
} from 'react-icons/fa';

const EditServiceman = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showLocation, setShowLocation] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // User data (from User model)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
    location: {
      type: 'Point',
      coordinates: ['', '']
    }
  });

  // Profile data (from ServiceManProfile model)
  const [profileData, setProfileData] = useState({
    category: '',
    skills: [],
    experience: 0,
    pricePerHour: 0,
    bio: '',
    availabilityStatus: AVAILABILITY_STATUS.OFFLINE,
    documents: [],
    averageRating: 0,
    totalReviews: 0,
    totalCompletedJobs: 0
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchServicemanData();
    fetchCategories();
  }, [id]);

  const fetchServicemanData = async () => {
    try {
      setLoading(true);
      const response = await adminServicemanService.getServicemanById(id);
      const serviceman = response.data;
      
      // Set user data
      setUserData({
        name: serviceman.name || '',
        email: serviceman.email || '',
        phone: serviceman.phone || '',
        address: serviceman.address || '',
        isActive: serviceman.isActive,
        location: serviceman.location || {
          type: 'Point',
          coordinates: ['', '']
        }
      });

      // Set profile data if exists
      if (serviceman.profile) {
        setProfileData({
          category: serviceman.profile.category?._id || serviceman.profile.category || '',
          skills: serviceman.profile.skills || [],
          experience: serviceman.profile.experience || 0,
          pricePerHour: serviceman.profile.pricePerHour || 0,
          bio: serviceman.profile.bio || '',
          availabilityStatus: serviceman.profile.availabilityStatus || AVAILABILITY_STATUS.OFFLINE,
          documents: serviceman.profile.documents || [],
          averageRating: serviceman.profile.averageRating || 0,
          totalReviews: serviceman.profile.totalReviews || 0,
          totalCompletedJobs: serviceman.profile.totalCompletedJobs || 0
        });
      }

      // Show location fields if coordinates exist
      if (serviceman.location?.coordinates?.some(coord => coord)) {
        setShowLocation(true);
      }

    } catch (error) {
      toast.error(error.message || 'Failed to fetch serviceman data');
      navigate('/admin/servicemen');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminCategoryService.getAllCategories({ limit: 100 });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Handle user data changes
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle location coordinates
    if (name === 'longitude' || name === 'latitude') {
      setUserData({
        ...userData,
        location: {
          ...userData.location,
          coordinates: name === 'longitude' 
            ? [value, userData.location.coordinates[1]]
            : [userData.location.coordinates[0], value]
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle profile data changes - FIXED VERSION
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    // Handle different field types appropriately
    if (name === 'experience' || name === 'pricePerHour') {
      // Numeric fields
      setProfileData({
        ...profileData,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'availabilityStatus') {
      // Enum field - keep as string, don't parse
      setProfileData({
        ...profileData,
        [name]: value
      });
    } else {
      // Other string fields
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  // Handle skills
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      if (!profileData.skills.includes(skillInput.trim())) {
        setProfileData({
          ...profileData,
          skills: [...profileData.skills, skillInput.trim()]
        });
        setSkillInput('');
      } else {
        toast.error('Skill already added');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Handle documents
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        toast.error(`File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`);
        return;
      }
      
      // In a real app, you'd upload to server here and get URL
      const newDoc = file.name;
      setProfileData({
        ...profileData,
        documents: [...profileData.documents, newDoc]
      });
      
      toast.success('Document added successfully');
    }
  };

  const handleRemoveDocument = (index) => {
    setProfileData({
      ...profileData,
      documents: profileData.documents.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (!profileData.category) {
      toast.error('Please select a category');
      setSubmitting(false);
      return;
    }

    if (profileData.skills.length === 0) {
      toast.error(VALIDATION_MESSAGES.INVALID_SKILLS);
      setSubmitting(false);
      return;
    }

    if (profileData.pricePerHour <= 0) {
      toast.error(VALIDATION_MESSAGES.INVALID_PRICE);
      setSubmitting(false);
      return;
    }

    if (profileData.experience < 0) {
      toast.error(VALIDATION_MESSAGES.INVALID_EXPERIENCE);
      setSubmitting(false);
      return;
    }

    try {
      // Prepare user data for update
      const userPayload = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        isActive: userData.isActive
      };

      // Add location if provided
      if (showLocation && 
          userData.location.coordinates[0] && 
          userData.location.coordinates[1]) {
        userPayload.location = {
          type: 'Point',
          coordinates: [
            parseFloat(userData.location.coordinates[0]),
            parseFloat(userData.location.coordinates[1])
          ]
        };
      } else {
        userPayload.location = null; // Remove location if not wanted
      }

      // Prepare profile data for update
      const profilePayload = {
        category: profileData.category,
        skills: profileData.skills,
        experience: profileData.experience,
        pricePerHour: profileData.pricePerHour,
        bio: profileData.bio,
        availabilityStatus: profileData.availabilityStatus, // This will now be properly sent
        documents: profileData.documents
      };

      // Log the payload to verify availabilityStatus is included correctly
      console.log('Sending profile payload:', profilePayload);

      // Send update request
      const response = await adminServicemanService.updateServiceman(id, {
        userData: userPayload,
        profileData: profilePayload
      });

      toast.success(response.message || 'Serviceman updated successfully!');
      navigate('/admin/servicemen');
    } catch (error) {
      toast.error(error.message || 'Failed to update serviceman');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/servicemen')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Serviceman</h1>
          <p className="text-gray-400 text-sm mt-1">Update serviceman information</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FaStar className="text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Average Rating</p>
              <p className="text-xl font-bold text-white">
                {profileData.averageRating.toFixed(1)} <span className="text-sm text-gray-400">/5</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FaBriefcase className="text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completed Jobs</p>
              <p className="text-xl font-bold text-white">{profileData.totalCompletedJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FaCheckCircle className="text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Reviews</p>
              <p className="text-xl font-bold text-white">{profileData.totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaUser className="text-blue-400" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    value={userData.name}
                    onChange={handleUserChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter serviceman's full name"
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
                    value={userData.email}
                    onChange={handleUserChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="serviceman@example.com"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaPhone className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleUserChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaTools className="text-green-400" />
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaWrench className="text-gray-500" />
                  </div>
                  <select
                    name="category"
                    value={profileData.category}
                    onChange={handleProfileChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaClock className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="experience"
                    value={profileData.experience}
                    onChange={handleProfileChange}
                    required
                    min="0"
                    step="1"
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Years of experience"
                  />
                </div>
              </div>

              {/* Price Per Hour Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Per Hour (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaMoneyBillWave className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={profileData.pricePerHour}
                    onChange={handleProfileChange}
                    required
                    min="0"
                    step="50"
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              {/* Availability Status - FIXED: Now properly updates */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Availability Status
                </label>
                <div className="relative">
                  <select
                    name="availabilityStatus"
                    value={profileData.availabilityStatus}
                    onChange={handleProfileChange}
                    className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value={AVAILABILITY_STATUS.AVAILABLE}>Available</option>
                    <option value={AVAILABILITY_STATUS.BUSY}>Busy</option>
                    <option value={AVAILABILITY_STATUS.OFFLINE}>Offline</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-purple-400" />
              Skills & Expertise <span className="text-red-400">*</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Enter a skill (e.g., Plumbing, Electrical)"
                  className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FaPlus />
                  <span>Add</span>
                </button>
              </div>

              {/* Skills Tags */}
              {profileData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-blue-300 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaIdCard className="text-indigo-400" />
              Professional Bio
            </h2>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              rows="4"
              maxLength="500"
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              placeholder="Describe the serviceman's experience, expertise, and services offered... (max 500 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
          </div>

          {/* Address and Location */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              Address & Location
            </h2>
            
            {/* Address Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FaMapMarkerAlt className="text-gray-500" />
                </div>
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleUserChange}
                  rows="2"
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter serviceman's address"
                />
              </div>
            </div>

            {/* Location Toggle */}
            <button
              type="button"
              onClick={() => setShowLocation(!showLocation)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
            >
              <FaGlobe />
              <span>{showLocation ? 'Hide location coordinates' : 'Add location coordinates for service area'}</span>
            </button>

            {/* Location Fields */}
            {showLocation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={userData.location.coordinates[0]}
                    onChange={handleUserChange}
                    step="any"
                    className="block w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., 77.5946"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={userData.location.coordinates[1]}
                    onChange={handleUserChange}
                    step="any"
                    className="block w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., 12.9716"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Documents Section */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaUpload className="text-pink-400" />
              Documents (Optional)
            </h2>
            
            <div className="space-y-4">
              {/* File Upload */}
              <div className="flex gap-2">
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  accept={FILE_UPLOAD.ACCEPTED_DOC_TYPES.join(',')}
                  className="flex-1 px-4 py-2 bg-white/5 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
              </div>

              {/* Uploaded Documents List */}
              {profileData.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Uploaded Documents:</p>
                  {profileData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-sm text-white truncate max-w-xs">{doc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaToggleOn className="text-orange-400" />
              Account Status
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUserData({ ...userData, isActive: !userData.isActive })}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  userData.isActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                }`}
              >
                {userData.isActive ? (
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
                {userData.isActive 
                  ? 'Serviceman can accept bookings' 
                  : 'Serviceman will not appear in search results'}
              </span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate('/admin/servicemen')}
              className="flex-1 py-3 px-4 bg-white/5 rounded-lg text-gray-300 font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Serviceman'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default EditServiceman;