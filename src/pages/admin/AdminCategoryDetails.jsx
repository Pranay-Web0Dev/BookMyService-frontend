// src/pages/admin/AdminCategoryDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import ImageUpload from '../../components/common/ImageUpload';
import adminCategoryService from '../../services/adminCategoryService';
import adminServicemanService from '../../services/adminServicemanService';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaWrench,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const AdminCategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [servicemen, setServicemen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteType, setDeleteType] = useState('soft');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      const [categoryRes, servicemenRes] = await Promise.all([
        adminCategoryService.getCategoryById(id),
        adminServicemanService.getByCategory(id)
      ]);
      
      setCategory(categoryRes.data);
      setServicemen(servicemenRes.data);
      setFormData({
        name: categoryRes.data.name,
        description: categoryRes.data.description,
        image: categoryRes.data.image,
        isActive: categoryRes.data.isActive
      });
    } catch (error) {
      toast.error('Failed to fetch category details');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const response = await adminCategoryService.updateCategory(id, {
        isActive: !category.isActive
      });
      toast.success(response.message);
      setCategory({ ...category, isActive: !category.isActive });
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
      const response = await adminCategoryService.deleteCategory(
        id,
        deleteType === 'permanent',
        deleteType === 'permanent'
      );
      toast.success(response.message);
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminCategoryService.updateCategory(id, formData);
      toast.success(response.message);
      setShowEditModal(false);
      fetchCategoryDetails();
    } catch (error) {
      toast.error(error.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="text-center text-white">Category not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/categories')}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaArrowLeft className="text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">Category Details</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Category Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaWrench className="text-4xl text-white" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">{category.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{category.description}</p>
              
              <div className="flex gap-2 mb-4">
                <StatusBadge status={category.isActive ? 'Active' : 'Inactive'} />
              </div>

              {/* Stats */}
              <div className="w-full space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Total Servicemen</span>
                  <span className="text-white font-bold">{servicemen.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleStatusToggle}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    category.isActive
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {category.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  <span>{category.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
                
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => handleDeleteClick('soft')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <FaTrash />
                  <span>Deactivate</span>
                </button>
                
                <button
                  onClick={() => handleDeleteClick('permanent')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Servicemen List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Servicemen in this Category ({servicemen.length})
            </h3>

            {servicemen.length === 0 ? (
              <div className="text-center py-8">
                <FaUsers className="text-4xl text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No servicemen in this category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {servicemen.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate(`/admin/servicemen/${item._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {item.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-green-400 font-bold">₹{item.profile?.pricePerHour || 0}</p>
                        <p className="text-xs text-gray-500">per hour</p>
                      </div>
                      <StatusBadge status={item.profile?.availabilityStatus || 'Offline'} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <ConfirmationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onConfirm={handleUpdate}
        title="Edit Category"
        message={
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 bg-white/5 border-gray-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-400">Active</label>
            </div>
          </div>
        }
        confirmText={submitting ? 'Updating...' : 'Update Category'}
        confirmColor="blue"
        disabled={submitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={`${deleteType === 'permanent' ? 'Permanently Delete' : 'Deactivate'} Category`}
        message={`Are you sure you want to ${
          deleteType === 'permanent' ? 'permanently delete' : 'deactivate'
        } ${category?.name}? ${
          deleteType === 'permanent' 
            ? 'This action cannot be undone! All associated servicemen will be affected.' 
            : 'It can be reactivated later.'
        }`}
        confirmText={deleteType === 'permanent' ? 'Delete Permanently' : 'Deactivate'}
        confirmColor={deleteType === 'permanent' ? 'red' : 'yellow'}
      />
    </DashboardLayout>
  );
};

export default AdminCategoryDetails;