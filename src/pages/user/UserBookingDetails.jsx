// src/pages/user/UserBookingDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUser,
  FaWrench,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock as FaClockIcon
} from 'react-icons/fa';

const UserBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await userService.getBookingById(id);
      setBooking(response.data);
    } catch (error) {
      toast.error('Failed to fetch booking details');
      navigate('/user/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await userService.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setShowCancelModal(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'Approved': 'bg-green-500/20 text-green-400',
      'InProgress': 'bg-blue-500/20 text-blue-400',
      'Completed': 'bg-purple-500/20 text-purple-400',
      'Cancelled': 'bg-red-500/20 text-red-400',
      'Rejected': 'bg-gray-500/20 text-gray-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="text-green-400 text-2xl" />;
      case 'InProgress': return <FaSpinner className="text-blue-400 text-2xl animate-spin" />;
      case 'Pending': return <FaClockIcon className="text-yellow-400 text-2xl" />;
      case 'Approved': return <FaCheckCircle className="text-green-400 text-2xl" />;
      case 'Cancelled':
      case 'Rejected': return <FaTimesCircle className="text-red-400 text-2xl" />;
      default: return null;
    }
  };

  const canCancel = booking?.booking && ['Pending', 'Approved'].includes(booking.booking.status);
  const canReview = booking?.booking?.status === 'Completed' && !booking?.booking?.reviewGiven;

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="text-center text-white">Booking not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/user/bookings')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">Booking Details</h1>
        <div className="flex items-center gap-2 ml-auto">
          {getStatusIcon(booking.booking?.status)}
          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.booking?.status)}`}>
            {booking.booking?.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaCalendarAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Booking Date</p>
                  <p className="text-white">
                    {new Date(booking.booking?.bookingDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaClock className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Booking Time</p>
                  <p className="text-white">{booking.booking?.bookingTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaWrench className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Service Category</p>
                  <p className="text-white">{booking.booking?.categoryId?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaDollarSign className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-green-400">₹{booking.booking?.price}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg md:col-span-2">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Service Address</p>
                  <p className="text-white">{booking.booking?.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg md:col-span-2">
                <FaFileAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Problem Description</p>
                  <p className="text-white">{booking.booking?.problemDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section (if exists) */}
          {booking.review && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Your Review</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <RatingStars rating={booking.review.rating} size="text-lg" />
                <span className="text-white font-medium">{booking.review.rating}.0</span>
              </div>
              
              <p className="text-gray-300 mb-4">{booking.review.comment}</p>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Posted on {new Date(booking.review.createdAt).toLocaleDateString()}
                </p>
                
                <Link
                  to={`/user/review/${booking.review._id}/edit`}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Edit Review
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Serviceman Info & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Service Provider</h3>
            
            <Link
              to={`/user/serviceman/${booking.booking?.serviceManId?._id}`}
              className="flex items-center gap-3 mb-4 hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{booking.booking?.serviceManId?.name}</h4>
                <p className="text-sm text-gray-400">View Profile →</p>
              </div>
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="text-gray-500" />
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{booking.booking?.serviceManId?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="text-gray-500" />
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{booking.booking?.serviceManId?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            
            <div className="space-y-3">
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <FaTimesCircle />
                  <span>Cancel Booking</span>
                </button>
              )}
              
              {canReview && (
                <Link
                  to={`/user/add-review/${booking.booking?.serviceManId?._id}`}
                  state={{ 
                    bookingId: id,
                    servicemanName: booking.booking?.serviceManId?.name,
                    categoryName: booking.booking?.categoryId?.name
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
                >
                  <FaStar />
                  <span>Write a Review</span>
                </Link>
              )}
              
              <Link
                to={`/user/serviceman/${booking.booking?.serviceManId?._id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <FaUser />
                <span>View Provider Profile</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        confirmColor="red"
      />
    </DashboardLayout>
  );
};

export default UserBookingDetails;