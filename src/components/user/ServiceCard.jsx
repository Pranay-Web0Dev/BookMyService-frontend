// src/components/user/ServiceCard.jsx
import { motion } from 'framer-motion';
import { FaWrench, FaBolt, FaSnowflake, FaTools, FaPaintBrush, FaBroom } from 'react-icons/fa';

const iconMap = {
  FaWrench,
  FaBolt,
  FaSnowflake,
  FaTools,
  FaPaintBrush,
  FaBroom
};

const ServiceCard = ({ category, isSelected, onSelect }) => {
  const IconComponent = iconMap[category.icon] || FaWrench;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-500 border-blue-500'
          : 'bg-white/5 border-white/10 hover:border-blue-500'
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center">
        <IconComponent className={`text-2xl mb-2 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
        <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
          {category.name}
        </p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;