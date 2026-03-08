// src/pages/admin/AdminReports.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminService from '../../services/adminService';
import adminBookingService from '../../services/adminBookingService';
import adminServicemanService from '../../services/adminServicemanService';
import adminUserService from '../../services/adminUserService';
import adminCategoryService from '../../services/adminCategoryService';
import toast from 'react-hot-toast';
import {
  FaDownload,
  FaCalendarAlt,
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaDollarSign,
  FaStar,
  FaFilePdf,
  FaFileExcel,
  FaChartPie,
  FaChartBar,
  FaChartLine,
  FaUserCheck,
  FaUserClock,
  FaUserTimes
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    userStats: null,
    servicemanStats: null,
    bookingStats: null,
    revenueData: null,
    monthlyTrends: [],
    categoryStats: [],
    topPerformers: []
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllReportData();
  }, [dateRange]);

  const fetchAllReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        usersRes,
        servicemenStatsRes,
        bookingsStatsRes,
        revenueRes,
        trendsRes,
        categoriesRes,
        topPerformersRes
      ] = await Promise.all([
        adminUserService.getAllUsers({ limit: 1000 }),
        adminServicemanService.getStatistics(),
        adminBookingService.getStatistics(),
        adminService.getRevenue(dateRange.startDate, dateRange.endDate),
        adminService.getMonthlyTrends(12),
        adminCategoryService.getAllCategories({ limit: 100 }),
        adminService.getTopPerformers(10)
      ]);

      // Calculate user distribution by role
      const users = usersRes.data || [];
      const userRoles = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      // Process category stats for pie chart
      const categoryStats = (servicemenStatsRes.data?.byCategory || []).map(item => ({
        name: item._id,
        value: item.count
      }));

      setReportData({
        userStats: {
          total: usersRes.total || users.length,
          byRole: userRoles,
          active: users.filter(u => u.isActive).length,
          inactive: users.filter(u => !u.isActive).length
        },
        servicemanStats: servicemenStatsRes.data,
        bookingStats: bookingsStatsRes.data,
        revenueData: revenueRes.data,
        monthlyTrends: trendsRes.data || [],
        categoryStats,
        topPerformers: topPerformersRes.data || []
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      setExporting(true);
      
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Overview Sheet
      const overviewData = [
        ['Report Generated On', new Date().toLocaleString()],
        ['Date Range', `${dateRange.startDate} to ${dateRange.endDate}`],
        [],
        ['OVERVIEW STATISTICS'],
        ['Metric', 'Value'],
        ['Total Users', reportData.userStats?.total || 0],
        ['Active Users', reportData.userStats?.active || 0],
        ['Total Servicemen', reportData.servicemanStats?.total || 0],
        ['Active Servicemen', reportData.servicemanStats?.active || 0],
        ['Total Bookings', reportData.bookingStats?.total || 0],
        ["Today's Bookings", reportData.bookingStats?.today || 0],
        ['Total Revenue', `₹${reportData.revenueData?.totalRevenue?.toLocaleString() || 0}`],
        ['Monthly Revenue', `₹${reportData.revenueData?.monthlyRevenue?.toLocaleString() || 0}`]
      ];
      
      const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, overviewWs, 'Overview');

      // User Distribution Sheet
      const userDistData = [
        ['User Role Distribution'],
        ['Role', 'Count'],
        ...Object.entries(reportData.userStats?.byRole || {}).map(([role, count]) => [role, count])
      ];
      const userDistWs = XLSX.utils.aoa_to_sheet(userDistData);
      XLSX.utils.book_append_sheet(wb, userDistWs, 'User Distribution');

      // Serviceman Stats Sheet
      const servicemanData = [
        ['Serviceman Statistics'],
        ['Metric', 'Value'],
        ['Total Servicemen', reportData.servicemanStats?.total || 0],
        ['Active Servicemen', reportData.servicemanStats?.active || 0],
        ['Average Rating', reportData.servicemanStats?.averageRating?.toFixed(1) || '0.0'],
        ['Total Completed Jobs', reportData.servicemanStats?.totalCompletedJobs || 0],
        [],
        ['Availability Breakdown'],
        ['Status', 'Count'],
        ...(reportData.servicemanStats?.availability || []).map(a => [a._id, a.count])
      ];
      const servicemanWs = XLSX.utils.aoa_to_sheet(servicemanData);
      XLSX.utils.book_append_sheet(wb, servicemanWs, 'Servicemen');

      // Booking Stats Sheet
      const bookingData = [
        ['Booking Statistics'],
        ['Status', 'Count'],
        ...(reportData.bookingStats?.byStatus || []).map(b => [b._id, b.count])
      ];
      const bookingWs = XLSX.utils.aoa_to_sheet(bookingData);
      XLSX.utils.book_append_sheet(wb, bookingWs, 'Bookings');

      // Monthly Trends Sheet
      const trendsData = [
        ['Monthly Trends'],
        ['Month', 'Year', 'Bookings', 'Revenue (₹)'],
        ...(reportData.monthlyTrends || []).map(t => [t.month, t.year, t.bookings, t.revenue])
      ];
      const trendsWs = XLSX.utils.aoa_to_sheet(trendsData);
      XLSX.utils.book_append_sheet(wb, trendsWs, 'Monthly Trends');

      // Category Distribution Sheet
      const categoryData = [
        ['Servicemen by Category'],
        ['Category', 'Count'],
        ...(reportData.categoryStats || []).map(c => [c.name, c.value])
      ];
      const categoryWs = XLSX.utils.aoa_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, categoryWs, 'Categories');

      // Top Performers Sheet
      const performersData = [
        ['Top Performing Servicemen'],
        ['Name', 'Category', 'Jobs Completed', 'Rating', 'Price/Hour']
      ];
      
      reportData.topPerformers.forEach(p => {
        performersData.push([
          p.userInfo?.name || 'N/A',
          p.categoryInfo?.name || 'N/A',
          p.totalCompletedJobs || 0,
          p.averageRating?.toFixed(1) || '0.0',
          `₹${p.pricePerHour || 0}`
        ]);
      });
      
      const performersWs = XLSX.utils.aoa_to_sheet(performersData);
      XLSX.utils.book_append_sheet(wb, performersWs, 'Top Performers');

      // Save file
      XLSX.writeFile(wb, `admin_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    try {
      setExporting(true);
      
      const doc = new jsPDF();
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text('Admin Reports', 105, yPos, { align: 'center' });
      
      yPos += 10;
      
      // Date Range
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
      doc.text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, 20, yPos + 5);
      
      yPos += 15;

      // Overview Statistics
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Overview Statistics', 20, yPos);
      yPos += 8;

      const overviewRows = [
        ['Total Users', reportData.userStats?.total || 0],
        ['Active Users', reportData.userStats?.active || 0],
        ['Total Servicemen', reportData.servicemanStats?.total || 0],
        ['Active Servicemen', reportData.servicemanStats?.active || 0],
        ['Total Bookings', reportData.bookingStats?.total || 0],
        ["Today's Bookings", reportData.bookingStats?.today || 0],
        ['Total Revenue', `₹${reportData.revenueData?.totalRevenue?.toLocaleString() || 0}`]
      ];

      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: overviewRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Booking Status
      doc.setFontSize(14);
      doc.text('Booking Status Distribution', 20, yPos);
      yPos += 8;

      const bookingRows = (reportData.bookingStats?.byStatus || []).map(b => [b._id, b.count]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Status', 'Count']],
        body: bookingRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Top Performers
      doc.setFontSize(14);
      doc.text('Top 10 Performers', 20, yPos);
      yPos += 8;

      const performerRows = reportData.topPerformers.slice(0, 5).map(p => [
        p.userInfo?.name || 'N/A',
        p.categoryInfo?.name || 'N/A',
        p.totalCompletedJobs || 0,
        p.averageRating?.toFixed(1) || '0.0'
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Name', 'Category', 'Jobs', 'Rating']],
        body: performerRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });

      // Save PDF
      doc.save(`admin_report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Available': return <FaUserCheck className="text-green-400" />;
      case 'Busy': return <FaUserClock className="text-yellow-400" />;
      case 'Offline': return <FaUserTimes className="text-gray-400" />;
      default: return <FaUserTie />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Comprehensive platform statistics and insights
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            <FaFilePdf />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
          >
            <FaFileExcel />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <span className="text-white">Date Range:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FaUsers className="text-2xl text-blue-400" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{reportData.userStats?.total || 0}</h3>
          <p className="text-gray-400 text-sm">Total Users</p>
          <div className="mt-3 text-xs text-gray-500">
            {reportData.userStats?.active || 0} Active | {reportData.userStats?.inactive || 0} Inactive
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FaUserTie className="text-2xl text-purple-400" />
            </div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{reportData.servicemanStats?.active || 0}</h3>
          <p className="text-gray-400 text-sm">Active Servicemen</p>
          <div className="mt-3 flex gap-2">
            {(reportData.servicemanStats?.availability || []).map((item, i) => (
              <div key={i} className="flex items-center gap-1 text-xs">
                {getStatusIcon(item._id)}
                <span className="text-gray-400">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FaCalendarCheck className="text-2xl text-green-400" />
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{reportData.bookingStats?.today || 0}</h3>
          <p className="text-gray-400 text-sm">Today's Bookings</p>
          <div className="mt-3 text-xs text-gray-500">
            Total: {reportData.bookingStats?.total || 0}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-6 border border-yellow-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FaDollarSign className="text-2xl text-yellow-400" />
            </div>
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            ₹{(reportData.revenueData?.totalRevenue || 0).toLocaleString()}
          </h3>
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <div className="mt-3 text-xs text-green-400">
            +₹{(reportData.revenueData?.monthlyRevenue || 0).toLocaleString()} this month
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['overview', 'users', 'servicemen', 'bookings', 'trends'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Distribution Chart */}
        {(activeTab === 'overview' || activeTab === 'users') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartPie className="text-blue-400" />
              User Distribution by Role
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(reportData.userStats?.byRole || {}).map(([name, value]) => ({
                    name,
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.keys(reportData.userStats?.byRole || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Servicemen by Category Chart */}
        {(activeTab === 'overview' || activeTab === 'servicemen') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartBar className="text-purple-400" />
              Servicemen by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6">
                  {reportData.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Booking Status Chart */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartPie className="text-green-400" />
              Booking Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.bookingStats?.byStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                  label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                >
                  {(reportData.bookingStats?.byStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Monthly Trends Chart */}
        {(activeTab === 'overview' || activeTab === 'trends') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-yellow-400" />
              Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={reportData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3B82F6"
                  name="Bookings"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  name="Revenue (₹)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Top Performers Table */}
      {(activeTab === 'overview' || activeTab === 'servicemen') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Servicemen</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Jobs</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Rating</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Price/Hour</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topPerformers.map((performer, index) => (
                  <tr key={performer._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'}`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">{performer.userInfo?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-300">{performer.categoryInfo?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-center text-white">{performer.totalCompletedJobs || 0}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-white">{performer.averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-green-400 font-medium">₹{performer.pricePerHour || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;