// src/pages/admin/AdminServicemen.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ServicemanFilters from '../../components/admin/ServicemanFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import adminServicemanService from '../../services/adminServicemanService';
import adminCategoryService from '../../services/adminCategoryService';
import toast from 'react-hot-toast';
import {
  FaUserPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

const AdminServicemen = () => {
  const [servicemen, setServicemen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: '',
    availability: '',
    isActive: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });
  const [selectedServiceman, setSelectedServiceman] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState('soft');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchServicemen();
    fetchCategories();
    fetchStatistics();
  }, [filters.page, filters.search, filters.category, filters.availability, filters.isActive, filters.limit]);

  const fetchServicemen = async () => {
    try {
      setLoading(true);
      const response = await adminServicemanService.getAllServicemen(filters);
      setServicemen(response.data);
      setPagination({
        total: response.total,
        pages: response.pages,
        page: response.page
      });
    } catch (error) {
      toast.error('Failed to fetch servicemen');
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
      const response = await adminServicemanService.getStatistics();
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

  const handleStatusToggle = async (serviceman) => {
    try {
      const response = await adminServicemanService.updateStatus(
        serviceman._id,
        !serviceman.isActive
      );
      toast.success(response.message);
      fetchServicemen();
      fetchStatistics();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (serviceman, type = 'soft') => {
    setSelectedServiceman(serviceman);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await adminServicemanService.deleteServiceman(
        selectedServiceman._id,
        deleteType === 'permanent'
      );
      toast.success(response.message);
      fetchServicemen();
      fetchStatistics();
    } catch (error) {
      toast.error(error.message || 'Failed to delete serviceman');
    } finally {
      setShowDeleteModal(false);
      setSelectedServiceman(null);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'N/A';
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Servicemen</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total {pagination.total} servicemen found
          </p>
        </div>
        <Link
          to="/admin/servicemen/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <FaUserPlus />
          <span>Add New Serviceman</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Total Servicemen</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {stats.averageRating?.toFixed(1)} <span className="text-sm text-gray-400">/5</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <p className="text-gray-400 text-sm">Total Jobs</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.totalCompletedJobs}</p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <ServicemanFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Servicemen Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Serviceman</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Rating</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Availability</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Price/hr</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {servicemen.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {item.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-400">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                          {item.profile?.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{item.phone || 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-white">
                            {item.profile?.averageRating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({item.profile?.totalReviews || 0})
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.isActive ? 'Active' : 'Inactive'} />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.profile?.availabilityStatus || 'Offline'} />
                      </td>
                      <td className="p-4">
                        <span className="text-green-400 font-medium">
                          ₹{item.profile?.pricePerHour || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/servicemen/${item._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          
                          <Link
                            to={`/admin/servicemen/${item._id}/edit`}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          
                          <button
                            onClick={() => handleStatusToggle(item)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.isActive
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(item, 'permanent')}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Permanently Delete Serviceman"
                          >
                            <FaTrash />
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} Serviceman`}
        message={`Are you sure you want to ${
          deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
        } ${selectedServiceman?.name}? ${
          deleteType === 'permanent' 
            ? 'This action cannot be undone! All data will be lost.' 
            : 'They can be reactivated later.'
        }`}
        confirmText={deleteType === 'permanent' ? 'Delete Permanently' : 'Deactivate'}
        confirmColor={deleteType === 'permanent' ? 'red' : 'yellow'}
      />
    </DashboardLayout>
  );
};

export default AdminServicemen;