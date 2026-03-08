// src/components/common/RatingStars.jsx
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, size = 'text-sm', showValue = false }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className={`${size} text-yellow-400`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${size} text-gray-500`} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">{stars}</div>
      {showValue && (
        <span className={`${size} text-gray-300 ml-1`}>({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default RatingStars;