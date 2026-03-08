// src/pages/admin/AdminServicemanDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import adminServicemanService from '../../services/adminServicemanService';
import adminUserService from '../../services/adminUserService';
import adminCategoryService from '../../services/adminCategoryService';
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
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaWrench,
  FaDollarSign,
  FaClock,
  FaBriefcase,
  FaAward,
  FaFileAlt,
  FaKey
} from 'react-icons/fa';

const AdminServicemanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceman, setServiceman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [deleteType, setDeleteType] = useState('soft');

  useEffect(() => {
    fetchServicemanDetails();
    fetchCategories();
  }, [id]);

  const fetchServicemanDetails = async () => {
    try {
      setLoading(true);
      const response = await adminServicemanService.getServicemanById(id);
      setServiceman(response.data);
    } catch (error) {
      toast.error('Failed to fetch serviceman details');
      navigate('/admin/servicemen');
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

  const handleStatusToggle = async () => {
    try {
      const response = await adminServicemanService.updateStatus(id, !serviceman.isActive);
      toast.success(response.message);
      setServiceman({ ...serviceman, isActive: !serviceman.isActive });
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
      const response = await adminServicemanService.deleteServiceman(id, deleteType === 'permanent');
      toast.success(response.message);
      navigate('/admin/servicemen');
    } catch (error) {
      toast.error(error.message || 'Failed to delete serviceman');
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

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'N/A';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!serviceman) {
    return (
      <DashboardLayout>
        <div className="text-center text-white">Serviceman not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/servicemen')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">Serviceman Details</h1>
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
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white font-bold">
                  {serviceman.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{serviceman.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{serviceman.email}</p>
              
              <div className="flex gap-2 mb-4">
                <StatusBadge status={serviceman.isActive ? 'Active' : 'Inactive'} />
                <StatusBadge status={serviceman.profile?.availabilityStatus || 'Offline'} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-white font-bold">
                    {serviceman.profile?.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  ({serviceman.profile?.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Action Buttons - First Row */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleStatusToggle}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    serviceman.isActive
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {serviceman.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  <span>{serviceman.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
                
                <Link
                  to={`/admin/servicemen/${id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <FaEdit />
                  <span>Edit</span>
                </Link>
              </div>

              {/* Action Buttons - Second Row */}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaUser className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white">{serviceman.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaEnvelope className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white">{serviceman.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaPhone className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white">{serviceman.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaMapMarkerAlt className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{serviceman.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaCalendarAlt className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Joined Date</p>
                  <p className="text-white">
                    {new Date(serviceman.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                {serviceman.isActive ? (
                  <FaCheckCircle className="text-green-400 mt-1" />
                ) : (
                  <FaTimesCircle className="text-red-400 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className={`${serviceman.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {serviceman.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <h3 className="text-lg font-semibold text-white mt-6 mb-4">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaWrench className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white">
                    {serviceman.profile?.category?.name || getCategoryName(serviceman.profile?.category) || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaBriefcase className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="text-white">{serviceman.profile?.experience || 0} years</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaDollarSign className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Price Per Hour</p>
                  <p className="text-green-400 font-bold">₹{serviceman.profile?.pricePerHour || 0}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaAward className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Completed Jobs</p>
                  <p className="text-white">{serviceman.profile?.totalCompletedJobs || 0}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <FaClock className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Availability</p>
                  <StatusBadge status={serviceman.profile?.availabilityStatus || 'Offline'} />
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg md:col-span-2">
                <div className="w-full">
                  <p className="text-sm text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceman.profile?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {serviceman.profile?.bio && (
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg md:col-span-2">
                  <FaFileAlt className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Bio</p>
                    <p className="text-white">{serviceman.profile.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            {serviceman.location?.coordinates?.some(coord => coord) && (
              <>
                <h3 className="text-lg font-semibold text-white mt-6 mb-4">Location</h3>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">Coordinates</p>
                  <p className="text-white">
                    Longitude: {serviceman.location.coordinates[0]}, 
                    Latitude: {serviceman.location.coordinates[1]}
                  </p>
                </div>
              </>
            )}

            {/* Documents */}
            {serviceman.profile?.documents && serviceman.profile.documents.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-white mt-6 mb-4">Documents</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {serviceman.profile.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center"
                    >
                      <FaFileAlt className="text-purple-400 text-2xl mx-auto mb-2" />
                      <p className="text-xs text-gray-400 truncate">
                        {typeof doc === 'string' ? doc.split('/').pop() : `Document ${index + 1}`}
                      </p>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Danger Zone */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h4>
              <button
                onClick={() => handleDeleteClick('permanent')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
              >
                <FaTrash />
                <span>Permanently Delete Serviceman</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                This action cannot be undone. All data associated with this serviceman will be permanently removed.
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
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} Serviceman`}
        message={`Are you sure you want to ${
          deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
        } ${serviceman?.name}? ${
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
              Set a new password for {serviceman?.name}
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

export default AdminServicemanDetails;