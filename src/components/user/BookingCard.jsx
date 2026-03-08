// src/components/user/BookingCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaStar } from 'react-icons/fa';

const BookingCard = ({ booking, onCancel, onReview }) => {
  const getStatusColor = () => {
    const colors = {
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'Approved': 'bg-green-500/20 text-green-400',
      'InProgress': 'bg-blue-500/20 text-blue-400',
      'Completed': 'bg-purple-500/20 text-purple-400',
      'Cancelled': 'bg-red-500/20 text-red-400',
      'Rejected': 'bg-gray-500/20 text-gray-400'
    };
    return colors[booking.status] || 'bg-gray-500/20 text-gray-400';
  };

  const canCancel = ['Pending', 'Approved'].includes(booking.status);
  const canReview = booking.status === 'Completed' && !booking.reviewGiven;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold">{booking.serviceManId?.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor()}`}>
              {booking.status}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mb-2">
            {booking.categoryId?.name} • {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
          </p>
          
          <p className="text-gray-500 text-sm line-clamp-2">
            {booking.problemDescription}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <span className="text-green-400 font-bold">₹{booking.price}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canCancel && (
            <button
              onClick={() => onCancel(booking)}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Cancel
            </button>
          )}
          
          {canReview && (
            <button
              onClick={() => onReview(booking)}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm flex items-center gap-1"
            >
              <FaStar />
              Review
            </button>
          )}
          
          <Link
            to={`/user/bookings/${booking._id}`}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <FaEye />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;