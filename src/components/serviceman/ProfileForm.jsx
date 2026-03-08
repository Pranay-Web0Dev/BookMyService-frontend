// src/components/serviceman/ProfileForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import adminCategoryService from '../../services/adminCategoryService';
import toast from 'react-hot-toast';

const ProfileForm = ({ initialData, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    experience: initialData?.experience || 0,
    skills: initialData?.skills?.join(', ') || '',
    pricePerHour: initialData?.pricePerHour || 0,
    bio: initialData?.bio || '',
    availabilityStatus: initialData?.availabilityStatus || 'Available'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminCategoryService.getAllCategories({ limit: 100 });
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert skills string to array
    const submitData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };

    await onSubmit(submitData);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
    >
      <h2 className="text-xl font-bold text-white mb-6">
        {initialData ? 'Edit Profile' : 'Create Profile'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Service Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Experience (years) *
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            min="0"
            step="0.5"
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>

        {/* Price Per Hour */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price Per Hour (₹) *
          </label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Skills (comma separated) *
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            placeholder="e.g., Plumbing, Pipe Repair, Installation"
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
          <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bio / Description
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell customers about yourself and your experience..."
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>

        {/* Availability Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Availability Status
          </label>
          <select
            name="availabilityStatus"
            value={formData.availabilityStatus}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Form Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : (initialData ? 'Update Profile' : 'Create Profile')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-4 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileForm;