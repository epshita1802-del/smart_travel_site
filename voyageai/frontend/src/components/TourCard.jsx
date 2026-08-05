import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiUsers, FiHeart, FiMapPin } from "react-icons/fi";
import RatingStars from "./RatingStars";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import * as userService from "../services/userService";

const TourCard = ({ tour, favorited = false, onFavoriteChange = () => {} }) => {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(favorited);
  const [busy, setBusy] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to save favorites");
      return;
    }
    setBusy(true);
    try {
      await userService.toggleFavorite(tour._id);
      setIsFav((v) => !v);
      onFavoriteChange(tour._id, !isFav);
      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.error("Could not update favorites");
    } finally {
      setBusy(false);
    }
  };

  const price = tour.discountPrice > 0 ? tour.discountPrice : tour.price;
  const hasDiscount = tour.discountPrice > 0 && tour.discountPrice < tour.price;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card group h-full flex flex-col"
    >
      <Link to={`/packages/${tour.slug}`} className="relative block overflow-hidden aspect-[4/3]">
        <img
          src={tour.coverImage || "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

        {hasDiscount && (
          <span className="absolute top-3 left-3 badge bg-coral-500 text-white">Save ₹{tour.price - tour.discountPrice}</span>
        )}

        <button
          onClick={handleFavorite}
          disabled={busy}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Toggle favorite"
        >
          <FiHeart className={isFav ? "fill-coral-500 text-coral-500" : "text-ink/60"} size={16} />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-semibold">
          <FiMapPin size={13} />
          {tour.destination?.name}, {tour.destination?.country}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <RatingStars rating={tour.rating} reviews={tour.numReviews} size={13} />

        <Link to={`/packages/${tour.slug}`}>
          <h3 className="font-display font-semibold text-lg text-ink mt-2 mb-1.5 leading-snug group-hover:text-coral-600 transition-colors line-clamp-2">
            {tour.title}
          </h3>
        </Link>

        <p className="text-sm text-ink/50 line-clamp-2 mb-4">{tour.summary}</p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-ink/5">
          <div className="flex items-center gap-4 text-xs text-ink/50">
            <span className="flex items-center gap-1"><FiClock size={13} /> {tour.duration}d</span>
            <span className="flex items-center gap-1"><FiUsers size={13} /> {tour.maxGroupSize}</span>
          </div>
          <div className="text-right">
            {hasDiscount && <p className="text-xs text-ink/30 line-through">₹{tour.price}</p>}
            <p className="font-display font-bold text-lg text-ocean-700">₹{price}<span className="text-xs font-body font-normal text-ink/40">/person</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
