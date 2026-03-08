// src/components/common/StatusBadge.jsx
const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusColor = () => {
    const colors = {
      // Booking statuses
      'Completed': 'bg-green-500/20 text-green-400',
      'InProgress': 'bg-blue-500/20 text-blue-400',
      'Pending': 'bg-yellow-500/20 text-yellow-400',
      'Approved': 'bg-purple-500/20 text-purple-400',
      'Cancelled': 'bg-red-500/20 text-red-400',
      'Rejected': 'bg-gray-500/20 text-gray-400',
      
      // User statuses
      'Active': 'bg-green-500/20 text-green-400',
      'Inactive': 'bg-red-500/20 text-red-400',
      
      // Availability statuses
      'Available': 'bg-green-500/20 text-green-400',
      'Busy': 'bg-yellow-500/20 text-yellow-400',
      'Offline': 'bg-gray-500/20 text-gray-400',
      
      // Category status
      'default': 'bg-gray-500/20 text-gray-400'
    };
    
    return colors[status] || colors.default;
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;