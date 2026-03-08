// src/components/admin/TopPerformersList.jsx
import { motion } from 'framer-motion';
import { FaStar, FaMedal } from 'react-icons/fa';

const TopPerformersList = ({ performers }) => {
  const getMedalColor = (index) => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-yellow-700';
      default: return 'text-gray-600';
    }
  };

  if (performers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No top performers data available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Top Performing Servicemen</h2>
      
      <div className="space-y-4">
        {performers.map((performer, index) => (
          <motion.div
            key={performer._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {performer.userInfo?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                {index < 3 && (
                  <FaMedal className={`absolute -top-1 -right-1 text-lg ${getMedalColor(index)}`} />
                )}
              </div>
              
              <div>
                <h3 className="text-white font-medium">{performer.userInfo?.name}</h3>
                <p className="text-sm text-gray-400">{performer.categoryInfo?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-xs text-gray-300">{performer.averageRating?.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-300">{performer.totalCompletedJobs} jobs</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-green-400">₹{performer.pricePerHour}</p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformersList;