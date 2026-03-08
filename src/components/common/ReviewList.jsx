// src/components/common/ReviewList.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import { FaUser, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ReviewList = ({ reviews, onEdit, onDelete, canManage = false }) => {
  const { user } = useAuth();

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <h4 className="text-white font-medium">{review.userId?.name || 'Anonymous'}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <RatingStars rating={review.rating} size="text-sm" />
          </div>

          <p className="text-gray-300 text-sm mb-3">{review.comment}</p>

          {canManage && review.userId?._id === user?._id && (
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onEdit(review)}
                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(review._id)}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;