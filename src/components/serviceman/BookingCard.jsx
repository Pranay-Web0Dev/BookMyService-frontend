// src/components/serviceman/BookingCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner, FaCheck, FaBan } from 'react-icons/fa';

const BookingCard = ({ booking, onStatusUpdate }) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="text-green-400" />;
      case 'InProgress': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'Pending': return <FaClock className="text-yellow-400" />;
      case 'Approved': return <FaCheck className="text-green-400" />;
      case 'Cancelled':
      case 'Rejected': return <FaBan className="text-red-400" />;
      default: return null;
    }
  };

  const availableStatusUpdates = {
    'Pending': ['Approved', 'Rejected'],
    'Approved': ['InProgress', 'Cancelled'],
    'InProgress': ['Completed', 'Cancelled']
  };

  const canUpdate = availableStatusUpdates[booking.status]?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-semibold">{booking.userId?.name}</h3>
            <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor()}`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-2">
            {booking.categoryId?.name} • {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
          </p>
          
          <p className="text-gray-500 text-sm line-clamp-2">
            {booking.problemDescription}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <span className="text-green-400 font-bold">₹{booking.price}</span>
            <span className="text-gray-500 text-sm">{booking.address}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canUpdate && (
            <button
              onClick={() => onStatusUpdate(booking)}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
            >
              Update Status
            </button>
          )}
          
          <Link
            to={`/serviceman/bookings/${booking._id}`}
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