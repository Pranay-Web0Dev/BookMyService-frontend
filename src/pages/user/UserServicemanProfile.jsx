// src/pages/user/UserServicemanProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ReviewList from '../../components/common/ReviewList';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaStar,
  FaDollarSign,
  FaBriefcase,
  FaWrench,
  FaClock,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt
} from 'react-icons/fa';

const UserServicemanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serviceman, setServiceman] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchServicemanDetails();
  }, [id]);

  const fetchServicemanDetails = async () => {
    try {
      setLoading(true);
      const [servicemanRes, reviewsRes] = await Promise.all([
        userService.getServicemanDetails(id),
        userService.getServicemanReviews(id)
      ]);
      
      setServiceman(servicemanRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      toast.error('Failed to fetch serviceman details');
      navigate('/user/browse');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate('/user/book-service', {
      state: { serviceman }
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!serviceman) {
    return (
      <DashboardLayout>
        <div className="text-center text-white">Serviceman not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/user/browse')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">Service Provider Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {serviceman.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white">{serviceman.user?.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <RatingStars rating={serviceman.averageRating || 0} showValue />
                <span className="text-gray-400 text-sm">({serviceman.totalReviews || 0} reviews)</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  serviceman.availabilityStatus === 'Available' ? 'bg-green-500/20 text-green-400' :
                  serviceman.availabilityStatus === 'Busy' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {serviceman.availabilityStatus}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {serviceman.category?.name}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Experience</span>
                <span className="text-white font-medium">{serviceman.experience} years</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Price per hour</span>
                <span className="text-green-400 font-bold text-lg">₹{serviceman.pricePerHour}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Completed Jobs</span>
                <span className="text-white font-medium">{serviceman.totalCompletedJobs || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Member since</span>
                <span className="text-white font-medium">
                  {new Date(serviceman.user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Skills */}
            {serviceman.skills && serviceman.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {serviceman.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {serviceman.bio && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">About</h3>
                <p className="text-gray-400 text-sm">{serviceman.bio}</p>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookNow}
              disabled={serviceman.availabilityStatus !== 'Available'}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                serviceman.availabilityStatus === 'Available'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
            >
              {serviceman.availabilityStatus === 'Available' ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              Customer Reviews ({reviews.length})
            </h3>
            
            <ReviewList
              reviews={reviews}
              canManage={false}
            />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UserServicemanProfile;