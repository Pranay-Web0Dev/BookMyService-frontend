// src/pages/serviceman/ServiceManBookingDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import servicemanService from '../../services/servicemanService';
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
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock as FaClockIcon
} from 'react-icons/fa';

const ServiceManBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await servicemanService.getMyBookings({ page: 1, limit: 1 });
      const booking = response.data.find(b => b._id === id);
      if (booking) {
        setBooking(booking);
      } else {
        toast.error('Booking not found');
        navigate('/serviceman/bookings');
      }
    } catch (error) {
      toast.error('Failed to fetch booking details');
      navigate('/serviceman/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setUpdating(true);
    try {
      const response = await servicemanService.updateBookingStatus(id, newStatus);
      toast.success(response.message);
      setShowStatusModal(false);
      setNewStatus('');
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
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

  const availableStatusUpdates = {
    'Pending': ['Approved', 'Rejected'],
    'Approved': ['InProgress', 'Cancelled'],
    'InProgress': ['Completed', 'Cancelled']
  };

  const statusOptions = booking 
    ? availableStatusUpdates[booking.status] || []
    : [];

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
          onClick={() => navigate('/serviceman/bookings')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">Booking Details</h1>
        <div className="flex items-center gap-2 ml-auto">
          {getStatusIcon(booking.status)}
          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
            {booking.status}
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
                  <p className="text-white">{booking.categoryId?.name}</p>
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
        </motion.div>

        {/* Customer Info & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{booking.userId?.name}</h4>
                <p className="text-sm text-gray-400">Customer</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="text-gray-500" />
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{booking.userId?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="text-gray-500" />
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{booking.userId?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {statusOptions.length > 0 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              
              <button
                onClick={() => {
                  setNewStatus('');
                  setShowStatusModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
              >
                <FaClockIcon />
                <span>Update Status</span>
              </button>
            </div>
          )}
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
              Change status for this booking
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              disabled={updating}
            >
              <option value="">Select Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        }
        confirmText={updating ? 'Updating...' : 'Update Status'}
        confirmColor="blue"
        disabled={updating || !newStatus}
      />
    </DashboardLayout>
  );
};

export default ServiceManBookingDetails;