// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <Navbar />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <motion.main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-400 mt-1">
                {user?.role === 'superadmin' && 'Manage admins and platform settings'}
                {user?.role === 'admin' && 'Monitor platform activity and manage users'}
                {user?.role === 'serviceman' && 'Manage your jobs and availability'}
                {user?.role === 'user' && 'Browse services and track your bookings'}
              </p>
            </div>

            {/* Page Content */}
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;