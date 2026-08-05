import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import RatingStars from "./RatingStars";

const DestinationCard = ({ destination }) => {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link to={`/destinations/${destination.slug}`} className="card group block relative">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={destination.coverImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600"}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiArrowUpRight className="text-white" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">{destination.country}</p>
            <h3 className="font-display font-bold text-xl mb-2">{destination.name}</h3>
            <div className="flex items-center justify-between">
              <RatingStars rating={destination.rating} showValue reviews={null} size={12} />
              {destination.averageBudget > 0 && (
                <span className="text-xs font-semibold bg-white/15 backdrop-blur-md rounded-full px-3 py-1">
                  from ₹{destination.averageBudget}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;
