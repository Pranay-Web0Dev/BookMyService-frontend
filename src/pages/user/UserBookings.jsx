// src/pages/user/UserBookings.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/user/BookingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { FaFilter } from 'react-icons/fa';

const UserBookings = () => {
  const navigate = useNavigate();
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters.page, filters.status, filters.limit]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyBookings(filters);
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

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await userService.cancelBooking(selectedBooking._id);
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const handleReview = (booking) => {
    navigate(`/user/bookings/${booking._id}/review`);
  };

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
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors mb-4"
        >
          <FaFilter />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
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
          </motion.div>
        )}
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelClick}
                onReview={handleReview}
              />
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

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your booking with ${selectedBooking?.serviceManId?.name}?`}
        confirmText="Yes, Cancel"
        confirmColor="red"
      />
    </DashboardLayout>
  );
};

export default UserBookings;