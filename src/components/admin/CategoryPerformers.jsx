// src/components/admin/CategoryPerformers.jsx
import { useState, useEffect } from 'react';
import { FaStar, FaMedal, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const CategoryPerformers = ({ performers = [], selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // You'll need to add this function to your adminService
      const response = await adminService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get medal color based on rank
  const getMedalColor = (index) => {
    switch(index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-orange-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Category Top Performers</h2>
        
        {/* Category Filter */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
          disabled={loading}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {performers.length === 0 ? (
        <div className="text-center py-8 bg-white/5 rounded-lg">
          <FaMedal className="text-gray-600 text-4xl mx-auto mb-3" />
          <p className="text-gray-400">No performers data available</p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedCategory ? 'No performers in this category yet' : 'Select a category to view top performers'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {performers.map((performer, index) => (
            <motion.div
              key={performer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-500/50 transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Rank Medal */}
                <div className="relative">
                  <FaMedal className={`text-2xl ${getMedalColor(index)}`} />
                  <span className="absolute -top-1 -right-1 text-xs font-bold bg-gray-900 rounded-full w-4 h-4 flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                {/* Performer Info */}
                <div className="flex-1">
                  <Link 
                    to={`/admin/servicemen/${performer.userId?._id || performer.userId}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {performer.userInfo?.name ? (
                        <span className="text-white font-bold">
                          {performer.userInfo.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <FaUser className="text-white text-sm" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {performer.userInfo?.name || 'Unknown Serviceman'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {performer.categoryInfo?.name || 'Category'}
                      </p>
                    </div>
                  </Link>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Jobs</p>
                      <p className="text-white font-semibold">{performer.totalCompletedJobs || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Rating</p>
                      <p className="text-yellow-400 font-semibold flex items-center justify-center gap-1">
                        <FaStar className="text-xs" />
                        {performer.averageRating?.toFixed(1) || '0.0'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-green-400 font-semibold">₹{performer.pricePerHour || 0}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      performer.availabilityStatus === 'Available' 
                        ? 'bg-green-500/20 text-green-400'
                        : performer.availabilityStatus === 'Busy'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {performer.availabilityStatus || 'Offline'}
                    </span>
                    {performer.experience && (
                      <span className="text-xs text-blue-400">
                        {performer.experience} years exp.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPerformers;