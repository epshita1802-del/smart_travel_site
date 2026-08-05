import { FiStar } from "react-icons/fi";

const RatingStars = ({ rating = 0, size = 14, showValue = true, reviews = null }) => {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={size}
            className={star <= rounded ? "fill-coral-500 text-coral-500" : "fill-ink/10 text-ink/10"}
          />
        ))}
      </div>
      {showValue && rating > 0 && (
        <span className="text-sm font-semibold text-ink/80">{rating.toFixed(1)}</span>
      )}
      {reviews !== null && (
        <span className="text-sm text-ink/40">({reviews} review{reviews === 1 ? "" : "s"})</span>
      )}
    </div>
  );
};

export default RatingStars;
