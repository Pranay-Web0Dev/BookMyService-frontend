// src/pages/admin/AdminBookingDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import adminBookingService from '../../services/adminBookingService';
import adminCategoryService from '../../services/adminCategoryService';
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
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock as FaClockIcon
} from 'react-icons/fa';

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchBookingDetails();
    fetchCategories();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await adminBookingService.getBookingById(id);
      setBooking(response.data);
    } catch (error) {
      toast.error('Failed to fetch booking details');
      navigate('/admin/bookings');
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
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      const response = await adminBookingService.updateBookingStatus(id, newStatus);
      toast.success(response.message);
      setShowStatusModal(false);
      setNewStatus('');
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'N/A';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="text-green-400 text-2xl" />;
      case 'InProgress': return <FaSpinner className="text-blue-400 text-2xl animate-spin" />;
      case 'Pending': return <FaClockIcon className="text-yellow-400 text-2xl" />;
      case 'Approved': return <FaCheckCircle className="text-purple-400 text-2xl" />;
      case 'Cancelled':
      case 'Rejected': return <FaTimesCircle className="text-red-400 text-2xl" />;
      default: return null;
    }
  };

  const bookingStatuses = [
    'Pending', 'Approved', 'Rejected', 'InProgress', 'Completed', 'Cancelled'
  ];

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
          onClick={() => navigate('/admin/bookings')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          Booking #{booking._id.slice(-8)}
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          {getStatusIcon(booking.status)}
          <StatusBadge status={booking.status} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Booking Details Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaCalendarAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Booking Date</p>
                  <p className="text-white">
                    {new Date(booking.bookingDate).toLocaleDateString('en-US', {
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
                  <p className="text-white">{booking.bookingTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaWrench className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Service Category</p>
                  <p className="text-white">{getCategoryName(booking.categoryId?._id)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaDollarSign className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-green-400">₹{booking.price}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg md:col-span-2">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Service Address</p>
                  <p className="text-white">{booking.address}</p>
                  {booking.location && booking.location.coordinates && (
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {booking.location.coordinates[1]}, {booking.location.coordinates[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg md:col-span-2">
                <FaFileAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Problem Description</p>
                  <p className="text-white">{booking.problemDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Booking Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-green-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium">Booking Created</p>
                  <p className="text-sm text-gray-400">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {booking.updatedAt !== booking.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaClockIcon className="text-blue-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Last Updated</p>
                    <p className="text-sm text-gray-400">
                      {new Date(booking.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  booking.status === 'Completed' ? 'bg-green-500/20' :
                  booking.status === 'InProgress' ? 'bg-blue-500/20' :
                  booking.status === 'Pending' ? 'bg-yellow-500/20' :
                  booking.status === 'Approved' ? 'bg-purple-500/20' :
                  'bg-red-500/20'
                }`}>
                  {getStatusIcon(booking.status)}
                </div>
                <div>
                  <p className="text-white font-medium">Current Status</p>
                  <p className="text-sm text-gray-400">{booking.status}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - User Info & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* User Info Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {booking.userId?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-white font-medium">{booking.userId?.name}</h4>
                <p className="text-sm text-gray-400">{booking.userId?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FaUser className="text-gray-500" />
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{booking.userId?.phone || 'N/A'}</span>
              </div>
            </div>

            <Link
              to={`/admin/users/${booking.userId?._id}`}
              className="mt-4 block text-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
            >
              View Customer Profile
            </Link>
          </div>

          {/* Serviceman Info Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Serviceman Information</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {booking.serviceManId?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-white font-medium">{booking.serviceManId?.name}</h4>
                <p className="text-sm text-gray-400">{booking.serviceManId?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FaUser className="text-gray-500" />
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{booking.serviceManId?.phone || 'N/A'}</span>
              </div>
            </div>

            <Link
              to={`/admin/servicemen/${booking.serviceManId?._id}`}
              className="mt-4 block text-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
            >
              View Serviceman Profile
            </Link>
          </div>

          {/* Actions Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            
            <button
              onClick={() => {
                setNewStatus(booking.status);
                setShowStatusModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all mb-3"
            >
              <FaClock />
              <span>Update Status</span>
            </button>

            {booking.reviewGiven && (
              <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <FaStar />
                  Review has been given for this booking
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Update Status Modal */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setNewStatus('');
        }}
        onConfirm={handleStatusUpdate}
        title="Update Booking Status"
        message={
          <div className="space-y-4">
            <p className="text-gray-400">
              Change status for booking #{booking._id.slice(-8)}
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="">Select Status</option>
              {bookingStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        }
        confirmText="Update Status"
        confirmColor="blue"
      />
    </DashboardLayout>
  );
};

export default AdminBookingDetails;