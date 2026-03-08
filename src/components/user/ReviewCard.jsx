// src/components/user/ReviewCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import RatingStars from '../common/RatingStars';
import ConfirmationModal from '../common/ConfirmationModal';
import { FaUser, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

const ReviewCard = ({ review, onEdit, onDelete, canManage = false }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(review._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/50 transition-all"
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

        {review.response && (
          <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <FaCheckCircle className="text-blue-400 text-xs" />
              <span className="text-xs text-blue-400">Service Provider Response</span>
            </div>
            <p className="text-gray-300 text-sm">{review.response}</p>
            {review.responseDate && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(review.responseDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {canManage && (
          <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-white/10">
            <button
              onClick={() => onEdit(review)}
              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
              title="Edit Review"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              title="Delete Review"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmColor="red"
      />
    </>
  );
};

export default ReviewCard;