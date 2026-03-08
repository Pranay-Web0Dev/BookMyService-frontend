// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/admin/StatsCard';
import BookingStatusChart from '../../components/admin/BookingStatusChart';
import MonthlyTrendsChart from '../../components/admin/MonthlyTrendsChart';
import TopPerformersList from '../../components/admin/TopPerformersList';
import RecentBookingsTable from '../../components/admin/RecentBookingsTable';
import CategoryPerformers from '../../components/admin/CategoryPerformers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaDollarSign,
  FaChartLine,
  FaStar,
  FaUserCheck
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalUsers: 0,
    totalServicemen: 0,
    activeServicemen: 0,
    totalBookings: 0
  });
  const [bookingStats, setBookingStats] = useState({});
  const [revenue, setRevenue] = useState({ totalRevenue: 0, monthlyRevenue: 0 });
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [categoryPerformers, setCategoryPerformers] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedCategory !== undefined) {
      fetchCategoryPerformers();
    }
  }, [selectedCategory]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        totalsRes,
        bookingStatsRes,
        revenueRes,
        topPerformersRes,
        recentBookingsRes,
        monthlyTrendsRes
      ] = await Promise.all([
        adminService.getTotalCounts(),
        adminService.getBookingStats(),
        adminService.getRevenue(),
        adminService.getTopPerformers(5),
        adminService.getRecentBookings(5),
        adminService.getMonthlyTrends(6)
      ]);

      setTotals(totalsRes.data);
      setBookingStats(bookingStatsRes.data);
      setRevenue(revenueRes.data);
      setTopPerformers(topPerformersRes.data);
      setRecentBookings(recentBookingsRes.data);
      setMonthlyTrends(monthlyTrendsRes.data);
      
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryPerformers = async () => {
    try {
      const response = await adminService.getCategoryTopPerformers(selectedCategory);
      setCategoryPerformers(response.data);
    } catch (error) {
      toast.error('Failed to fetch category performers');
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: totals.totalUsers,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Servicemen',
      value: totals.totalServicemen,
      icon: FaUserTie,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Active Servicemen',
      value: totals.activeServicemen,
      icon: FaUserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      change: `${((totals.activeServicemen / (totals.totalServicemen || 1)) * 100).toFixed(1)}%`,
      changeType: 'neutral'
    },
    {
      title: 'Total Bookings',
      value: totals.totalBookings,
      icon: FaCalendarCheck,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      change: '+23%',
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: `₹${revenue.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      change: `₹${revenue.monthlyRevenue.toLocaleString()} this month`,
      changeType: 'increase'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      icon: FaStar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      change: 'Top rated',
      changeType: 'neutral'
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
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your platform today.</p>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Status Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Booking Status Distribution</h2>
          <BookingStatusChart data={bookingStats} />
        </motion.div>

        {/* Monthly Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Monthly Trends</h2>
          <MonthlyTrendsChart data={monthlyTrends} />
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8"
      >
        <RecentBookingsTable bookings={recentBookings} />
      </motion.div>

      {/* Performers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <TopPerformersList performers={topPerformers} />
        </motion.div>

        {/* Category Performers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <CategoryPerformers 
            performers={categoryPerformers}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;