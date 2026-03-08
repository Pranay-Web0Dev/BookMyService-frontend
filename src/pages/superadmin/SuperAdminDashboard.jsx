// src/pages/superadmin/SuperAdminDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import superAdminService from '../../services/superAdminService';
import { FaUsers, FaUserCheck, FaUserTimes, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    inactiveAdmins: 0,
    recentAdmins: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await superAdminService.getAllAdmins({ limit: 5 });
      
      const activeCount = response.data.filter(admin => admin.isActive).length;
      
      setStats({
        totalAdmins: response.total,
        activeAdmins: activeCount,
        inactiveAdmins: response.total - activeCount,
        recentAdmins: response.data
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Admins',
      value: stats.activeAdmins,
      icon: FaUserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Inactive Admins',
      value: stats.inactiveAdmins,
      icon: FaUserTimes,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10'
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`text-2xl text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/superadmin/create-admin"
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all text-center"
          >
            Create New Admin
          </Link>
          <Link
            to="/superadmin/admins"
            className="p-4 bg-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-all text-center"
          >
            View All Admins
          </Link>
        </div>
      </motion.div>

      {/* Recent Admins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Admins</h2>
          <Link to="/superadmin/admins" className="text-blue-400 hover:text-blue-300 text-sm">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentAdmins.map((admin, index) => (
            <Link
              key={admin._id}
              to={`/superadmin/admin/${admin._id}`}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {admin.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{admin.name}</h3>
                  <p className="text-sm text-gray-400">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  admin.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-sm text-gray-400">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;