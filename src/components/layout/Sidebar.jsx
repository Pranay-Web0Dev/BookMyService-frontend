// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaWrench,
  FaCalendarAlt,
  FaStar,
  FaMapMarkerAlt,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaClipboardList,
  FaChartBar
} from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();

  // Menu items based on role
  const getMenuItems = () => {
    switch (user?.role) {
      case 'superadmin':
        return [
          { path: '/superadmin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
          // { path: '/superadmin/create-admin', icon: FaUserPlus, label: 'Create Admin' },
          { path: '/superadmin/admins', icon: FaUsers, label: 'Manage Admins' },
          { path: '/admin/users', icon: FaUsers, label: 'Manage Users' },
          { path: '/admin/servicemen', icon: FaUserTie, label: 'Manage ServiceMen' },
          { path: '/admin/categories', icon: FaWrench, label: 'Categories' },
          { path: '/admin/bookings', icon: FaClipboardList, label: 'All Bookings' },
          { path: '/admin/reports', icon: FaChartBar, label: 'Reports' }
          // { path: '/superadmin/settings', icon: FaCog, label: 'Settings' }
        ];

      case 'admin':
        return [
          { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
          { path: '/admin/users', icon: FaUsers, label: 'Manage Users' },
          { path: '/admin/servicemen', icon: FaUserTie, label: 'Manage ServiceMen' },
          { path: '/admin/categories', icon: FaWrench, label: 'Categories' },
          { path: '/admin/bookings', icon: FaClipboardList, label: 'All Bookings' },
          { path: '/admin/reports', icon: FaChartBar, label: 'Reports' }
        ];

      case 'serviceman':
        return [
          { path: '/serviceman/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
          { path: '/serviceman/profile', icon: FaUserTie, label: 'My Profile' },
          { path: '/serviceman/bookings', icon: FaCalendarAlt, label: 'My Jobs' },
          { path: '/serviceman/availability', icon: FaMapMarkerAlt, label: 'Availability' },
          { path: '/serviceman/reviews', icon: FaStar, label: 'My Reviews' }
        ];

      case 'user':
        return [
          { path: '/user/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
          { path: '/user/browse', icon: FaWrench, label: 'Browse Services' },
          { path: '/user/bookings', icon: FaCalendarAlt, label: 'My Bookings' },
          { path: '/user/my-reviews', icon: FaStar, label: 'My Reviews' },
          { path: '/user/profile', icon: FaUserTie, label: 'Profile' }
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <motion.aside
      initial={{ width: sidebarOpen ? 256 : 80 }}
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-full bg-white/5 backdrop-blur-lg border-r border-white/10 overflow-hidden z-40"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors z-50"
      >
        {sidebarOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
      </button>

      {/* Menu Items */}
      <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="text-xl flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;