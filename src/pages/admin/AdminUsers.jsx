// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UserFilters from '../../components/admin/UserFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import adminUserService from '../../services/adminUserService';
import toast from 'react-hot-toast';
import {
  FaUserPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaKey,
  FaUserCog
} from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    isActive: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [deleteType, setDeleteType] = useState('soft');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.search, filters.role, filters.isActive, filters.limit]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getAllUsers(filters);
      setUsers(response.data);
      setPagination({
        total: response.total,
        pages: response.pages,
        page: response.page
      });
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStatusToggle = async (user) => {
    try {
      const response = await adminUserService.updateUser(user._id, {
        isActive: !user.isActive
      });
      toast.success(response.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (user, type = 'soft') => {
    setSelectedUser(user);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await adminUserService.deleteUser(
        selectedUser._id,
        deleteType === 'permanent'
      );
      toast.success(response.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordConfirm = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await adminUserService.resetPassword(
        selectedUser._id,
        newPassword
      );
      toast.success(response.message);
      setShowResetPasswordModal(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u._id));
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      let response;
      if (bulkAction === 'activate') {
        response = await adminUserService.bulkUpdateStatus(selectedUsers, true);
      } else if (bulkAction === 'deactivate') {
        response = await adminUserService.bulkUpdateStatus(selectedUsers, false);
      }

      toast.success(response.message);
      setSelectedUsers([]);
      setBulkAction('');
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Bulk action failed');
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total {pagination.total} users found
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <FaUserPlus />
          <span>Add New User</span>
        </Link>
      </div>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-500/20 rounded-lg border border-blue-500/50 flex flex-wrap items-center justify-between gap-4"
        >
          <span className="text-white">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="">Select Action</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction}
              className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
            <button
              onClick={() => setSelectedUsers([])}
              className="px-4 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 bg-white/5 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-4 text-gray-400 font-medium">User</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          className="w-4 h-4 bg-white/5 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{user.phone || 'N/A'}</p>
                        <p className="text-sm text-gray-400">{user.address || 'No address'}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} />
                      </td>
                      <td className="p-4">
                        <p className="text-white text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          
                          <Link
                            to={`/admin/users/${user._id}/edit`}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          
                          <button
                            onClick={() => handleResetPasswordClick(user)}
                            className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                            title="Reset Password"
                          >
                            <FaKey />
                          </button>
                          
                          {/* <button
                            onClick={() => handleDeleteClick(user, 'soft')}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Deactivate User"
                          >
                            <FaTrash />
                          </button> */}
                          
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteClick(user, 'permanent')}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              title="Permanently Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
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
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} User`}
        message={`Are you sure you want to ${
          deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
        } ${selectedUser?.name}? ${
          deleteType === 'permanent' 
            ? 'This action cannot be undone! All data will be lost.' 
            : 'They can be reactivated later.'
        }`}
        confirmText={deleteType === 'permanent' ? 'Delete Permanently' : 'Deactivate'}
        confirmColor={deleteType === 'permanent' ? 'red' : 'yellow'}
      />

      {/* Reset Password Modal */}
      <ConfirmationModal
        isOpen={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false);
          setNewPassword('');
          setSelectedUser(null);
        }}
        onConfirm={handleResetPasswordConfirm}
        title="Reset Password"
        message={
          <div className="space-y-4">
            <p className="text-gray-400">
              Set a new password for {selectedUser?.name}
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              autoFocus
            />
          </div>
        }
        confirmText="Reset Password"
        confirmColor="blue"
      />
    </DashboardLayout>
  );
};

export default AdminUsers;