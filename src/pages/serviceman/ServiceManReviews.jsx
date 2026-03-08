// src/pages/serviceman/ServiceManReviews.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ReviewCard from '../../components/user/ReviewCard';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaStar,
  FaChartLine,
  FaCalendarAlt,
  FaFilter,
  FaReply
} from 'react-icons/fa';

const ServiceManReviews = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    }
  });
  const [filters, setFilters] = useState({
    rating: '',
    sort: 'newest'
  });
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await userService.getServicemanReviews(user?._id);
      let filteredReviews = response.data;

      // Apply rating filter
      if (filters.rating) {
        filteredReviews = filteredReviews.filter(r => r.rating === parseInt(filters.rating));
      }

      // Apply sorting
      if (filters.sort === 'newest') {
        filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filters.sort === 'oldest') {
        filteredReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (filters.sort === 'highest') {
        filteredReviews.sort((a, b) => b.rating - a.rating);
      } else if (filters.sort === 'lowest') {
        filteredReviews.sort((a, b) => a.rating - b.rating);
      }

      setReviews(filteredReviews);

      // Calculate stats
      const total = filteredReviews.length;
      const sum = filteredReviews.reduce((acc, r) => acc + r.rating, 0);
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      
      filteredReviews.forEach(r => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });

      setStats({
        averageRating: total > 0 ? sum / total : 0,
        totalReviews: total,
        ratingDistribution: distribution
      });
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (review) => {
    setSelectedReview(review);
    setReplyText(review.response || '');
    setShowReplyModal(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);
    try {
      // You'll need to implement this endpoint
      // await userService.replyToReview(selectedReview._id, { response: replyText });
      toast.success('Reply posted successfully');
      setShowReplyModal(false);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to post reply');
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

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">
          See what customers are saying about your service
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <FaStar className="text-2xl text-yellow-400" />
            <span className="text-xs text-gray-500">Overall</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.averageRating.toFixed(1)}</h3>
          <p className="text-gray-400 text-sm">Average Rating</p>
          <RatingStars rating={stats.averageRating} size="text-sm" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="text-2xl text-blue-400" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalReviews}</h3>
          <p className="text-gray-400 text-sm">Total Reviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-2xl text-purple-400" />
            <span className="text-xs text-gray-500">This Month</span>
          </div>
          <h3 className="text-3xl font-bold text-white">
            {reviews.filter(r => {
              const date = new Date(r.createdAt);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length}
          </h3>
          <p className="text-gray-400 text-sm">New Reviews</p>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-4">
              <div className="w-12 flex items-center gap-1">
                <span className="text-white">{rating}</span>
                <FaStar className="text-yellow-400 text-xs" />
              </div>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100 || 0}%`
                  }}
                />
              </div>
              <span className="text-gray-400 text-sm w-12">
                {stats.ratingDistribution[rating]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-white">Filter:</span>
          </div>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={() => handleReplyClick(review)}
              canManage={false}
            />
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <ConfirmationModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedReview(null);
          setReplyText('');
        }}
        onConfirm={handleReplySubmit}
        title="Reply to Review"
        message={
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RatingStars rating={selectedReview?.rating || 0} size="text-sm" />
                <span className="text-xs text-gray-500">
                  {selectedReview?.userId?.name}
                </span>
              </div>
              <p className="text-gray-300 text-sm">"{selectedReview?.comment}"</p>
            </div>
            
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows="4"
              className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
        }
        confirmText={submitting ? 'Posting...' : 'Post Reply'}
        confirmColor="blue"
        disabled={submitting || !replyText.trim()}
      />
    </DashboardLayout>
  );
};

export default ServiceManReviews;