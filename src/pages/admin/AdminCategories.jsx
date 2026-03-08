// src/pages/admin/AdminCategories.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CategoryFilters from '../../components/admin/CategoryFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';
import ImageUpload from '../../components/common/ImageUpload';
import adminCategoryService from '../../services/adminCategoryService';
import toast from 'react-hot-toast';
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaImage
} from 'react-icons/fa';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    fetchCategories();
  }, [filters.page, filters.search, filters.isActive, filters.limit]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminCategoryService.getAllCategories(filters);
      setCategories(response.data);
      setPagination({
        total: response.total,
        pages: response.pages,
        page: response.page
      });
    } catch (error) {
      toast.error('Failed to fetch categories');
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

  const handleCreate = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you'd upload the image first and get URL
      const categoryData = {
        ...formData,
        image: formData.image || 'https://via.placeholder.com/150'
      };
      
      const response = await adminCategoryService.createCategory(categoryData);
      toast.success(response.message);
      setShowCreateModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminCategoryService.updateCategory(
        selectedCategory._id,
        formData
      );
      toast.success(response.message);
      setShowEditModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (category) => {
    try {
      const response = await adminCategoryService.updateCategory(category._id, {
        isActive: !category.isActive
      });
      toast.success(response.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (category, type = 'soft') => {
    setSelectedCategory(category);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await adminCategoryService.deleteCategory(
        selectedCategory._id,
        deleteType === 'permanent',
        deleteType === 'permanent'
      );
      toast.success(response.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      isActive: category.isActive
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true
    });
    setImageFile(null);
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total {pagination.total} categories found
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filters */}
      <CategoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Categories Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all"
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover opacity-50"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={category.isActive ? 'Active' : 'Inactive'} />
                    <span className="text-xs text-gray-500">
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <Link
                      to={`/admin/categories/${category._id}`}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </Link>
                    
                    <button
                      onClick={() => handleEditClick(category)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      onClick={() => handleStatusToggle(category)}
                      className={`p-2 rounded-lg transition-colors ${
                        category.isActive
                          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                      title={category.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {category.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(category, 'soft')}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Deactivate Category"
                    >
                      <FaTrash />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(category, 'permanent')}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Permanently Delete"
                    >
                      <FaTrash className="text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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

      {/* Create Category Modal */}
      <ConfirmationModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onConfirm={handleCreate}
        title="Create New Category"
        message={
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows="3"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image</label>
              <ImageUpload
                onImageSelect={(file) => setImageFile(file)}
                currentImage={formData.image}
                onRemove={() => {
                  setImageFile(null);
                  setFormData({ ...formData, image: '' });
                }}
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
        confirmText={submitting ? 'Creating...' : 'Create Category'}
        confirmColor="blue"
        disabled={submitting}
      />

      {/* Edit Category Modal */}
      <ConfirmationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
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
                placeholder="Enter category name"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows="3"
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image</label>
              <ImageUpload
                onImageSelect={(file) => setImageFile(file)}
                currentImage={formData.image}
                onRemove={() => {
                  setImageFile(null);
                  setFormData({ ...formData, image: '' });
                }}
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
        } ${selectedCategory?.name}? ${
          deleteType === 'permanent' 
            ? 'This action cannot be undone! All associated data will be lost.' 
            : 'It can be reactivated later.'
        }`}
        confirmText={deleteType === 'permanent' ? 'Delete Permanently' : 'Deactivate'}
        confirmColor={deleteType === 'permanent' ? 'red' : 'yellow'}
      />
    </DashboardLayout>
  );
};

export default AdminCategories;