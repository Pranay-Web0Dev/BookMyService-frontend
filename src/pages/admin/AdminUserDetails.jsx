// src/pages/admin/AdminUserDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import adminUserService from '../../services/adminUserService';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaUserTag
} from 'react-icons/fa';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [deleteType, setDeleteType] = useState('soft');

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getUserById(id);
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to fetch user details');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const response = await adminUserService.updateUser(id, {
        isActive: !user.isActive
      });
      toast.success(response.message);
      setUser({ ...user, isActive: !user.isActive });
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (type) => {
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await adminUserService.deleteUser(id, deleteType === 'permanent');
      toast.success(response.message);
      navigate('/admin/users');
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleResetPasswordClick = () => {
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordConfirm = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await adminUserService.resetPassword(id, newPassword);
      toast.success(response.message);
      setShowResetPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center text-white">User not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">User Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>
              
              <div className="flex gap-2 mb-4">
                <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} />
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {user.role}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleStatusToggle}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    user.isActive
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  <span>{user.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
                
                <Link
                  to={`/admin/users/${id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <FaEdit />
                  <span>Edit</span>
                </Link>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={handleResetPasswordClick}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  <FaKey />
                  <span>Reset Password</span>
                </button>
                
                <button
                  onClick={() => handleDeleteClick('soft')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaUser className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaEnvelope className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaPhone className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{user.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaUserTag className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white capitalize">{user.role}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaCalendarAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                {user.isActive ? (
                  <FaCheckCircle className="text-green-400 mt-1" />
                ) : (
                  <FaTimesCircle className="text-red-400 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className={`${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {user.location && user.location.coordinates && (
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">
                      Longitude: {user.location.coordinates[0]}, Latitude: {user.location.coordinates[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            {user.role !== 'superadmin' && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h4>
                <button
                  onClick={() => handleDeleteClick('permanent')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                >
                  <FaTrash />
                  <span>Permanently Delete User</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone. All data associated with this user will be permanently removed.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} User`}
        message={`Are you sure you want to ${
          deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
        } ${user?.name}? ${
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
        }}
        onConfirm={handleResetPasswordConfirm}
        title="Reset Password"
        message={
          <div className="space-y-4">
            <p className="text-gray-400">
              Set a new password for {user?.name}
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

export default AdminUserDetails;