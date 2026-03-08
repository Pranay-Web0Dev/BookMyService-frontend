// src/pages/superadmin/AdminsList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import superAdminService from '../../services/superAdminService';
import toast from 'react-hot-toast';
import { FaSearch, FaFilter, FaEye, FaTrash, FaToggleOn, FaToggleOff, FaUserPlus } from 'react-icons/fa';

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    isActive: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [deleteType, setDeleteType] = useState('soft'); // 'soft' or 'permanent'

  useEffect(() => {
    fetchAdmins();
  }, [filters.page, filters.search, filters.isActive]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await superAdminService.getAllAdmins(filters);
      setAdmins(response.data);
      setPagination({
        total: response.total,
        pages: response.pages,
        page: response.page
      });
    } catch (error) {
      toast.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleStatusChange = async (admin) => {
    try {
      const response = await superAdminService.updateAdminStatus(
        admin._id,
        !admin.isActive
      );
      toast.success(response.message);
      fetchAdmins();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (admin, type = 'soft') => {
    setSelectedAdmin(admin);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await superAdminService.deleteAdmin(
        selectedAdmin._id,
        deleteType === 'permanent'
      );
      toast.success(response.message);
      fetchAdmins();
    } catch (error) {
      toast.error(error.message || 'Failed to delete admin');
    } finally {
      setShowDeleteModal(false);
      setSelectedAdmin(null);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Admins</h1>
        <Link
          to="/superadmin/create-admin"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <FaUserPlus />
          <span>Create New Admin</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="" className="bg-gray-800 text-white">All Status</option>
              <option value="true" className="bg-gray-800 text-white">Active</option>
              <option value="false" className="bg-gray-800 text-white">Inactive</option>
            </select>

            {/* <button
              type="submit"
              className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button> */}
          </div>
        </form>
      </div>

      {/* Admins Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Admin</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <motion.tr
                      key={admin._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
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
                      </td>
                      <td className="p-4">
                        <p className="text-white">{admin.phone || 'N/A'}</p>
                        <p className="text-sm text-gray-400">{admin.address || 'No address'}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${admin.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-white">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(admin.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/superadmin/admin/${admin._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>

                          <button
                            onClick={() => handleStatusChange(admin)}
                            className={`p-2 rounded-lg transition-colors ${admin.isActive
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                              }`}
                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {admin.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>

                          <button
                            onClick={() => handleDeleteClick(admin, 'soft')}
                            className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                            title="Soft Delete (Deactivate)"
                          >
                            <FaTrash />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(admin, 'permanent')}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Permanently Delete"
                          >
                            <FaTrash className="text-red-400" />
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
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} Admin`}
        message={`Are you sure you want to ${deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
          } ${selectedAdmin?.name}? ${deleteType === 'permanent'
            ? 'This action cannot be undone!'
            : 'They can be reactivated later.'
          }`}
        confirmText={deleteType === 'permanent' ? 'Delete Permanently' : 'Deactivate'}
        confirmColor={deleteType === 'permanent' ? 'red' : 'yellow'}
      />
    </DashboardLayout>
  );
};

export default AdminsList;