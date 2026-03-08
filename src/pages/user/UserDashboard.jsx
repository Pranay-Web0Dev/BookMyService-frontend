// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/user/BookingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaCalendarCheck,
  FaStar,
  FaWrench,
  FaUser,
  FaArrowRight,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalReviews: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyBookings({ limit: 5 });
      setRecentBookings(response.data);

      // Calculate stats
      const allBookings = response.data;
      setStats({
        totalBookings: response.total,
        completedBookings: allBookings.filter(b => b.status === 'Completed').length,
        pendingBookings: allBookings.filter(b => b.status === 'Pending').length,
        totalReviews: allBookings.filter(b => b.reviewGiven).length
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await userService.cancelBooking(booking._id);
        toast.success('Booking cancelled successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error(error.message || 'Failed to cancel booking');
      }
    }
  };

  const handleReview = (booking) => {
    navigate(`/user/bookings/${booking._id}/review`);
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: FaCalendarCheck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: FaCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: FaClock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Reviews Given',
      value: stats.totalReviews,
      icon: FaStar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400 mt-2">
          Find trusted professionals for all your service needs
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <Link
          to="/user/browse"
          className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <FaWrench className="text-3xl text-white/80 mb-2" />
              <h2 className="text-xl font-bold text-white">Find Services</h2>
              <p className="text-white/80 text-sm">Browse and book trusted professionals near you</p>
            </div>
            <FaArrowRight className="text-2xl text-white/60" />
          </div>
        </Link>

        <Link
          to="/user/bookings"
          className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <FaCalendarCheck className="text-3xl text-blue-400 mb-2" />
              <h2 className="text-xl font-bold text-white">My Bookings</h2>
              <p className="text-gray-400 text-sm">Track and manage your service bookings</p>
            </div>
            <FaArrowRight className="text-2xl text-gray-600" />
          </div>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className={`p-2 rounded-full ${stat.bgColor} w-fit mb-3`}>
              <stat.icon className={`text-lg text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <Link
            to="/user/bookings"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            View All
            <FaArrowRight size={12} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No bookings yet</p>
            <Link
              to="/user/browse"
              className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Find Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map(booking => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelBooking}
                onReview={handleReview}
              />
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default UserDashboard;