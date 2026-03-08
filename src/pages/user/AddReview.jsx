// src/pages/user/AddReview.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import {
    FaArrowLeft,
    FaUser,
    FaStar,
    FaRegStar,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';

const AddReview = () => {
    const { id } = useParams(); // This is now the SERVICEMAN ID
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serviceman, setServiceman] = useState(null);
    const [formData, setFormData] = useState({
        rating: 0,
        comment: '',
        servicemanId: id,
        bookingId: location.state?.bookingId || null
    });
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        // Check if we have serviceman data in location state
        if (location.state?.servicemanName) {
            setServiceman({
                name: location.state.servicemanName,
                profile: {
                    category: { name: location.state.categoryName }
                }
            });
            setLoading(false);
        } else {
            fetchServicemanDetails();
        }
    }, [id, location.state]);

    const fetchServicemanDetails = async () => {
        try {
            const response = await userService.getServicemanDetails(id);
            setServiceman(response.data);
        } catch (error) {
            toast.error('Failed to fetch serviceman details');
            navigate('/user/bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (formData.rating === 0) {
            toast.error('Please select a rating');
            return false;
        }
        if (!formData.comment.trim()) {
            toast.error('Please write a review comment');
            return false;
        }
        if (formData.comment.length < 10) {
            toast.error('Review must be at least 10 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);

            const reviewData = {
                rating: formData.rating,
                comment: formData.comment,
                servicemanId: formData.servicemanId,
                bookingId: formData.bookingId
            };

            const response = await userService.addReview(reviewData);

            toast.success('Review submitted successfully!');

            if (formData.bookingId) {
                navigate(`/user/bookings/${formData.bookingId}`);
            } else {
                navigate(`/user/serviceman/${formData.servicemanId}`);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to submit review');
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

    if (!serviceman) {
        return (
            <DashboardLayout>
                <div className="text-center text-white">Serviceman not found</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <FaArrowLeft className="text-gray-400" />
                </button>
                <h1 className="text-2xl font-bold text-white">Write a Review</h1>
            </div>

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10"
                >
                    {/* Serviceman Info */}
                    <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/10">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                {serviceman?.user?.name || serviceman?.name}
                            </h2>
                            <p className="text-gray-400">
                                {serviceman?.category?.name || serviceman?.profile?.category?.name}
                            </p>
                            {formData.bookingId && (
                                <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                    <FaCheckCircle />
                                    Verified Booking
                                </p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Rating Selection */}
                        <div>
                            <label className="block text-white font-medium mb-3">
                                How would you rate your experience?
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingClick(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transform hover:scale-110 transition-transform"
                                    >
                                        {star <= (hoverRating || formData.rating) ? (
                                            <FaStar className="text-yellow-400 text-4xl" />
                                        ) : (
                                            <FaRegStar className="text-gray-500 text-4xl hover:text-yellow-400" />
                                        )}
                                    </button>
                                ))}
                                <span className="ml-2 text-white font-medium">
                                    {formData.rating > 0 ? `${formData.rating}.0` : ''}
                                </span>
                            </div>
                        </div>

                        {/* Review Comment */}
                        <div>
                            <label htmlFor="comment" className="block text-white font-medium mb-3">
                                Write your review
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                rows="5"
                                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                                placeholder="Share your experience with this serviceman... (minimum 10 characters)"
                                maxLength="500"
                            />
                            <div className="flex justify-between mt-2 text-sm">
                                <span className="text-gray-400">
                                    Minimum 10 characters
                                </span>
                                <span className={`${formData.comment.length >= 500 ? 'text-red-400' : 'text-gray-400'}`}>
                                    {formData.comment.length}/500
                                </span>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="p-4 bg-blue-500/10 rounded-lg">
                            <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                                <FaExclamationCircle />
                                Review Guidelines
                            </h3>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                                <li>Be honest and constructive</li>
                                <li>Focus on the service quality and professionalism</li>
                                <li>Avoid using offensive language</li>
                                <li>Do not share personal contact information</li>
                                <li>Your review helps other users make informed decisions</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    <FaCheckCircle />
                                    <span>Submit Review</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default AddReview;