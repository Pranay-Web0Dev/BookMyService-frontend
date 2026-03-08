// src/pages/admin/AdminBookings.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingFilters from '../../components/admin/BookingFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import adminBookingService from '../../services/adminBookingService';
import adminCategoryService from '../../services/adminCategoryService';
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

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    categoryId: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });
  const [stats, setStats] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchCategories();
    fetchStatistics();
  }, [filters.page, filters.search, filters.status, filters.categoryId, filters.startDate, filters.endDate, filters.limit]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminBookingService.getAllBookings(filters);
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

  const fetchCategories = async () => {
    try {
      const response = await adminCategoryService.getAllCategories({ limit: 100 });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await adminBookingService.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      const response = await adminBookingService.updateBookingStatus(
        selectedBooking._id,
        newStatus
      );
      toast.success(response.message);
      setShowStatusModal(false);
      setSelectedBooking(null);
      setNewStatus('');
      fetchBookings();
      fetchStatistics();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'N/A';
  };

  const bookingStatuses = [
    'Pending', 'Approved', 'Rejected', 'InProgress', 'Completed', 'Cancelled'
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="text-green-400" />;
      case 'InProgress': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'Pending': return <FaClock className="text-yellow-400" />;
      case 'Approved': return <FaCheck className="text-purple-400" />;
      case 'Cancelled':
      case 'Rejected': return <FaBan className="text-red-400" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Total {pagination.total} bookings found
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Today's Bookings</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.today}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              ₹{stats.totalRevenue?.toLocaleString() || 0}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {stats.byStatus?.find(s => s._id === 'Pending')?.count || 0}
            </p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Bookings Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Booking ID</th>
                    <th className="text-left p-4 text-gray-400 font-medium">User</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Serviceman</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Date & Time</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-white font-mono text-sm">
                          {booking._id.slice(-8)}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-white text-sm">{booking.userId?.name}</p>
                        <p className="text-gray-500 text-xs">{booking.userId?.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white text-sm">{booking.serviceManId?.name}</p>
                        <p className="text-gray-500 text-xs">{booking.serviceManId?.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                          {getCategoryName(booking.categoryId?._id)}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-white text-sm">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-xs">{booking.bookingTime}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-medium">₹{booking.price}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <StatusBadge status={booking.status} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/bookings/${booking._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNewStatus(booking.status);
                              setShowStatusModal(true);
                            }}
                            className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                            title="Update Status"
                          >
                            <FaClock />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              Change status for booking #{selectedBooking?._id.slice(-8)}
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

export default AdminBookings;