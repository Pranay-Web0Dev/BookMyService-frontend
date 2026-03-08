// src/pages/user/MyReviews.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import {
  FaStar,
  FaUser,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaReply
} from 'react-icons/fa';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchMyReviews();
  }, [pagination.page]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyReviews({
        page: pagination.page,
        limit: pagination.limit
      });
      
      setReviews(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        pages: response.pages
      });
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await userService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      fetchMyReviews();
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && reviews.length === 0) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage all the reviews you've written
        </p>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
          <FaStar className="text-gray-600 text-5xl mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No Reviews Yet</h3>
          <p className="text-gray-400 text-sm mb-6">
            You haven't written any reviews yet
          </p>
          <Link
            to="/user/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Browse Servicemen
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Review Content */}
                  <div className="flex-1">
                    {/* Serviceman Info */}
                    <Link
                      to={`/user/serviceman/${review.serviceManId?._id}`}
                      className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {review.serviceManId?.name || 'Unknown Serviceman'}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {review.serviceManId?.email}
                        </p>
                      </div>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <RatingStars rating={review.rating} size="text-base" />
                      <span className="text-white font-medium">{review.rating}.0</span>
                      {review.isVerified && (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                          <FaCheckCircle />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-300 mb-3">{review.comment}</p>

                    {/* Date and Metadata */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {review.hasResponse && (
                        <span className="flex items-center gap-1 text-green-400">
                          <FaReply />
                          Serviceman responded
                        </span>
                      )}
                    </div>

                    {/* Serviceman Response */}
                    {review.response && (
                      <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-xs text-blue-400 mb-1">Serviceman's Response:</p>
                        <p className="text-sm text-gray-300">{review.response}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.responseDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    <Link
                      to={`/user/review/${review._id}/edit`}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="Edit Review"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Delete Review"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default MyReviews;