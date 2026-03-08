// src/pages/superadmin/AdminDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import superAdminService from '../../services/superAdminService';
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
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const AdminDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState('soft');

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const fetchAdminDetails = async () => {
    try {
      setLoading(true);
      const response = await superAdminService.getAdminById(id);
      setAdmin(response.data);
    } catch (error) {
      toast.error('Failed to fetch admin details');
      navigate('/superadmin/admins');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const response = await superAdminService.updateAdminStatus(id, !admin.isActive);
      toast.success(response.message);
      setAdmin({ ...admin, isActive: !admin.isActive });
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
      const response = await superAdminService.deleteAdmin(id, deleteType === 'permanent');
      toast.success(response.message);
      navigate('/superadmin/admins');
    } catch (error) {
      toast.error(error.message || 'Failed to delete admin');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!admin) {
    return (
      <DashboardLayout>
        <div className="text-center text-white">Admin not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/superadmin/admins')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">Admin Details</h1>
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
                  {admin.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{admin.name}</h2>
              <p className="text-gray-400 text-sm mb-4">Administrator</p>
              
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  admin.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  Admin
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleStatusToggle}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    admin.isActive
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {admin.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  <span>{admin.isActive ? 'Deactivate' : 'Activate'}</span>
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
                <FaEnvelope className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaPhone className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white">{admin.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{admin.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaCalendarAlt className="text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="text-white">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', {
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
                {admin.isActive ? (
                  <FaCheckCircle className="text-green-400 mt-1" />
                ) : (
                  <FaTimesCircle className="text-red-400 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className={`${admin.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h4>
              <button
                onClick={() => handleDeleteClick('permanent')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
              >
                <FaTrash />
                <span>Permanently Delete Admin</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                This action cannot be undone. All data associated with this admin will be permanently removed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} Admin`}
        message={`Are you sure you want to ${
          deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
        } ${admin?.name}? ${
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

export default AdminDetails;