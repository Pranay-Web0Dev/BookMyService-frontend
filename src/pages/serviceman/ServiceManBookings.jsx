// src/pages/serviceman/ServiceManBookings.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import servicemanService from '../../services/servicemanService';
import toast from 'react-hot-toast';
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaCheck,
  FaBan
} from 'react-icons/fa';

const ServiceManBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters.page, filters.status, filters.limit]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await servicemanService.getMyBookings(filters);
      setBookings(response.data);
      setPagination({
        total: response.total,
        pages: response.pages,
        page: response.page
      });
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setUpdating(true);
    try {
      const response = await servicemanService.updateBookingStatus(
        selectedBooking._id,
        newStatus
      );
      toast.success(response.message);
      setShowStatusModal(false);
      setSelectedBooking(null);
      setNewStatus('');
      fetchBookings();
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
      case 'Completed': return <FaCheckCircle className="text-green-400" />;
      case 'InProgress': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'Pending': return <FaClock className="text-yellow-400" />;
      case 'Approved': return <FaCheck className="text-green-400" />;
      case 'Cancelled':
      case 'Rejected': return <FaBan className="text-red-400" />;
      default: return null;
    }
  };

  const availableStatusUpdates = {
    'Pending': ['Approved', 'Rejected'],
    'Approved': ['InProgress', 'Cancelled'],
    'InProgress': ['Completed', 'Cancelled']
  };

  const statusOptions = selectedBooking 
    ? availableStatusUpdates[selectedBooking.status] || []
    : [];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Total {pagination.total} bookings found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
            className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{booking.userId?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2">
                      {booking.categoryId?.name} • {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                    </p>
                    
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {booking.problemDescription}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-green-400 font-bold">₹{booking.price}</span>
                      <span className="text-gray-500 text-sm">{booking.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {availableStatusUpdates[booking.status] && availableStatusUpdates[booking.status].length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus('');
                          setShowStatusModal(true);
                        }}
                        className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
                      >
                        Update Status
                      </button>
                    )}
                    
                    <Link
                      to={`/serviceman/bookings/${booking._id}`}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <FaEye />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No bookings found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </>
      )}

      {/* Update Status Modal */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedBooking(null);
          setNewStatus('');
        }}
        onConfirm={handleStatusUpdate}
        title="Update Booking Status"
        message={
          <div className="space-y-4">
            <p className="text-gray-400">
              Change status for booking with {selectedBooking?.userId?.name}
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

export default ServiceManBookings;