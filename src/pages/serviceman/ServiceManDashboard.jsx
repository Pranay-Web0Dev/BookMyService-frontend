// src/pages/serviceman/ServiceManDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/serviceman/StatsCard';
import BookingCard from '../../components/serviceman/BookingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/common/RatingStars';
import servicemanService from '../../services/servicemanService';
import toast from 'react-hot-toast';
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaDollarSign,
  FaStar,
  FaUser,
  FaEye,
  FaChartLine,
  FaArrowRight,
  FaMapMarkerAlt,
  FaWrench
} from 'react-icons/fa';

const ServiceManDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalEarnings: 0,
      averageRating: 0,
      totalReviews: 0
    },
    profile: null,
    recentBookings: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await servicemanService.getDashboardStats();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (booking) => {
    // This will be handled in the booking details page
    // or through a modal, but for now we'll navigate
    window.location.href = `/serviceman/bookings/${booking._id}`;
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.stats.totalBookings,
      icon: FaCalendarCheck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Completed Jobs',
      value: dashboardData.stats.completedBookings,
      icon: FaCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Pending',
      value: dashboardData.stats.pendingBookings,
      icon: FaClock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Total Earnings',
      value: `₹${dashboardData.stats.totalEarnings?.toLocaleString() || 0}`,
      icon: FaDollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Average Rating',
      value: dashboardData.stats.averageRating?.toFixed(1) || '0.0',
      icon: FaStar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      suffix: <RatingStars rating={dashboardData.stats.averageRating || 0} size="text-xs" />
    },
    {
      title: 'Total Reviews',
      value: dashboardData.stats.totalReviews || 0,
      icon: FaStar,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10'
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
        <h1 className="text-3xl font-bold text-white">Service Provider Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back! Here's your performance overview.
        </p>
      </motion.div>

      {/* Profile Quick View - Show if profile exists */}
      {dashboardData.profile ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{dashboardData.profile.userId?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={dashboardData.profile.averageRating || 0} size="text-sm" showValue />
                  <span className="text-white/80 text-sm">• {dashboardData.profile.totalReviews} reviews</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    dashboardData.profile.availabilityStatus === 'Available' ? 'bg-green-500/20 text-green-400' :
                    dashboardData.profile.availabilityStatus === 'Busy' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {dashboardData.profile.availabilityStatus}
                  </span>
                  <span className="text-white/80 text-sm">
                    <FaWrench className="inline mr-1" />
                    {dashboardData.profile.category?.name}
                  </span>
                  <span className="text-white/80 text-sm">
                    <FaDollarSign className="inline mr-1" />
                    {dashboardData.profile.pricePerHour}/hr
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/serviceman/profile"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                View Profile
              </Link>
              <Link
                to="/serviceman/availability"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Update Availability
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-yellow-400">Complete Your Profile</h2>
              <p className="text-gray-300 mt-1">
                Set up your profile to start receiving booking requests from customers.
              </p>
            </div>
            <Link
              to="/serviceman/profile"
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Create Profile Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatsCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/serviceman/bookings"
          className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FaCalendarCheck className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">My Bookings</h3>
              <p className="text-sm text-gray-400">View and manage bookings</p>
            </div>
          </div>
          <FaArrowRight className="text-gray-500" />
        </Link>

        <Link
          to="/serviceman/reviews"
          className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FaStar className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">My Reviews</h3>
              <p className="text-sm text-gray-400">See what customers say</p>
            </div>
          </div>
          <FaArrowRight className="text-gray-500" />
        </Link>

        <Link
          to="/serviceman/availability"
          className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FaClock className="text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Availability</h3>
              <p className="text-sm text-gray-400">Set your working hours</p>
            </div>
          </div>
          <FaArrowRight className="text-gray-500" />
        </Link>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <Link
            to="/serviceman/bookings"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            View All
            <FaArrowRight size={12} />
          </Link>
        </div>

        {dashboardData.recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No recent bookings</p>
            <p className="text-sm text-gray-500 mt-2">
              When customers book your services, they'll appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Performance Chart Section - Optional, can be added later */}
      {dashboardData.stats.totalBookings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-400" />
              Completion Rate
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray={`${(dashboardData.stats.completedBookings / dashboardData.stats.totalBookings) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {Math.round((dashboardData.stats.completedBookings / dashboardData.stats.totalBookings) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {dashboardData.stats.completedBookings} completed out of {dashboardData.stats.totalBookings} total bookings
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {dashboardData.stats.pendingBookings} pending • {dashboardData.stats.cancelledBookings} cancelled
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" />
              Service Area
            </h3>
            {dashboardData.profile?.userId?.location ? (
              <div>
                <p className="text-gray-400 text-sm">
                  Your service location is set
                </p>
                <p className="text-white text-sm mt-2">
                  Lat: {dashboardData.profile.userId.location.coordinates[1].toFixed(4)},
                  Lng: {dashboardData.profile.userId.location.coordinates[0].toFixed(4)}
                </p>
                <Link
                  to="/serviceman/availability"
                  className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Update Location →
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm">
                  Set your service location to appear in nearby searches
                </p>
                <Link
                  to="/serviceman/availability"
                  className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Set Location
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default ServiceManDashboard;