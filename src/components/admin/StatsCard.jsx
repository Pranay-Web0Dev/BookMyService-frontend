// src/components/admin/StatsCard.jsx
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const StatsCard = ({ stat, index }) => {
  const getChangeIcon = () => {
    switch (stat.changeType) {
      case 'increase':
        return <FaArrowUp className="text-green-400 text-xs" />;
      case 'decrease':
        return <FaArrowDown className="text-red-400 text-xs" />;
      default:
        return <FaMinus className="text-gray-400 text-xs" />;
    }
  };

  const getChangeColor = () => {
    switch (stat.changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${stat.bgColor}`}>
          <stat.icon className={`text-xl text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`} />
        </div>
        <span className={`text-sm flex items-center gap-1 ${getChangeColor()}`}>
          {getChangeIcon()}
          {stat.change}
        </span>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
      <p className="text-gray-400 text-sm">{stat.title}</p>
    </motion.div>
  );
};

export default StatsCard;