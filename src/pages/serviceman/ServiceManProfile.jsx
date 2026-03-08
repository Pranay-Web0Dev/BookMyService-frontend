// src/pages/serviceman/ServiceManProfile.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfileForm from '../../components/serviceman/ProfileForm';
import ReviewList from '../../components/common/ReviewList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import servicemanService from '../../services/servicemanService';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import {
  FaEdit,
  FaStar,
  FaDollarSign,
  FaBriefcase,
  FaWrench,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const ServiceManProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await servicemanService.getProfile();
      setUser(response.data.user);
      setProfile(response.data.profile);
      
      // Fetch reviews for this serviceman
      if (response.data.profile?.userId) {
        const reviewsRes = await userService.getServicemanReviews(response.data.profile.userId);
        setReviews(reviewsRes.data);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const response = await servicemanService.updateProfile(profileData);
      setProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    // You can implement edit review modal here
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await userService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile</h2>
          <p className="text-gray-400 mb-8">
            Set up your profile to start receiving booking requests
          </p>
          <ProfileForm
            onSubmit={async (data) => {
              try {
                const response = await servicemanService.createProfile(data);
                setProfile(response.data);
                toast.success('Profile created successfully');
              } catch (error) {
                toast.error(error.message || 'Failed to create profile');
              }
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <FaEdit />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing ? (
          <ProfileForm
            initialData={profile}
            onSubmit={handleUpdateProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="text-white font-bold">
                        {profile.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({profile.totalReviews || 0})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Price per hour</span>
                    <span className="text-green-400 font-bold">₹{profile.pricePerHour}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white">{profile.experience} years</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Completed Jobs</span>
                    <span className="text-white">{profile.totalCompletedJobs}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Availability</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      profile.availabilityStatus === 'Available' ? 'bg-green-500/20 text-green-400' :
                      profile.availabilityStatus === 'Busy' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {profile.availabilityStatus}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-6">
                  <h3 className="text-white font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-2">About</h3>
                    <p className="text-gray-400 text-sm">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">
                  Reviews ({reviews.length})
                </h3>
                
                <ReviewList
                  reviews={reviews}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  canManage={false} // Serviceman cannot edit/delete reviews
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServiceManProfile;