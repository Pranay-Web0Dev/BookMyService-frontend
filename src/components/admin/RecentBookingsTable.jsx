// src/components/admin/RecentBookingsTable.jsx
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RecentBookingsTable = ({ bookings }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-500/20 text-green-400',
      'InProgress': 'bg-blue-500/20 text-blue-400',
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'Approved': 'bg-purple-500/20 text-purple-400',
      'Cancelled': 'bg-red-500/20 text-red-400',
      'Rejected': 'bg-gray-500/20 text-gray-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No recent bookings available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        <Link 
          to="/admin/bookings" 
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-gray-400 font-medium text-sm">User</th>
              <th className="text-left p-3 text-gray-400 font-medium text-sm">Service Provider</th>
              <th className="text-left p-3 text-gray-400 font-medium text-sm">Category</th>
              <th className="text-left p-3 text-gray-400 font-medium text-sm">Date & Time</th>
              <th className="text-left p-3 text-gray-400 font-medium text-sm">Price</th>
              <th className="text-left p-3 text-gray-400 font-medium text-sm">Status</th>
              <th className="text-right p-3 text-gray-400 font-medium text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-3">
                  <p className="text-white text-sm">{booking.userId?.name}</p>
                  <p className="text-gray-500 text-xs">{booking.userId?.email}</p>
                </td>
                <td className="p-3">
                  <p className="text-white text-sm">{booking.serviceManId?.name}</p>
                  <p className="text-gray-500 text-xs">{booking.serviceManId?.email}</p>
                </td>
                <td className="p-3">
                  <span className="text-white text-sm">{booking.categoryId?.name}</span>
                </td>
                <td className="p-3">
                  <p className="text-white text-sm">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-xs">{booking.bookingTime}</p>
                </td>
                <td className="p-3">
                  <span className="text-green-400 font-medium">₹{booking.price}</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    to={`/admin/bookings/${booking._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    <FaEye size={12} />
                    <span>View</span>
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookingsTable;