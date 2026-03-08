// src/components/user/ServicemanCard.jsx
import { motion } from 'framer-motion';
import RatingStars from '../common/RatingStars';
import { FaStar, FaDollarSign, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

const ServicemanCard = ({ serviceman, onBook, onViewProfile }) => {
  const getAvailabilityColor = () => {
    switch (serviceman.availabilityStatus) {
      case 'Available': return 'text-green-400';
      case 'Busy': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white font-bold">
            {serviceman.userId?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{serviceman.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{serviceman.category?.name}</p>
          
          <div className="flex items-center gap-2">
            <RatingStars rating={serviceman.averageRating || 0} size="text-xs" />
            <span className="text-xs text-gray-500">({serviceman.totalReviews || 0})</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FaBriefcase className="text-gray-500" />
          <span className="text-gray-400">Experience:</span>
          <span className="text-white">{serviceman.experience} years</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <FaDollarSign className="text-gray-500" />
          <span className="text-gray-400">Price:</span>
          <span className="text-green-400 font-bold">₹{serviceman.pricePerHour}/hr</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <FaMapMarkerAlt className="text-gray-500" />
          <span className="text-gray-400">Status:</span>
          <span className={`font-medium ${getAvailabilityColor()}`}>
            {serviceman.availabilityStatus}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewProfile}
          className="flex-1 py-2 px-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm"
        >
          View Profile
        </button>
        
        <button
          onClick={onBook}
          disabled={serviceman.availabilityStatus !== 'Available'}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            serviceman.availabilityStatus === 'Available'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
          }`}
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
};

export default ServicemanCard;