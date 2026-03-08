// src/components/superadmin/AdminCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaToggleOn, FaToggleOff, FaTrash } from 'react-icons/fa';

const AdminCard = ({ admin, onStatusToggle, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {admin.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{admin.name}</h3>
            <p className="text-sm text-gray-400">{admin.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${
          admin.isActive 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {admin.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-400">
          <span className="text-gray-500">Phone:</span>{' '}
          <span className="text-white">{admin.phone || 'N/A'}</span>
        </p>
        <p className="text-sm text-gray-400">
          <span className="text-gray-500">Created:</span>{' '}
          <span className="text-white">
            {new Date(admin.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
        <Link
          to={`/superadmin/admin/${admin._id}`}
          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          title="View Details"
        >
          <FaEye />
        </Link>
        
        <button
          onClick={() => onStatusToggle(admin)}
          className={`p-2 rounded-lg transition-colors ${
            admin.isActive
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
          }`}
          title={admin.isActive ? 'Deactivate' : 'Activate'}
        >
          {admin.isActive ? <FaToggleOn /> : <FaToggleOff />}
        </button>
        
        <button
          onClick={() => onDelete(admin)}
          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          title="Delete Admin"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
};

export default AdminCard;