import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiTag } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import RatingStars from "../components/RatingStars";
import TourCard from "../components/TourCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import * as destinationService from "../services/destinationService";

const DestinationDetails = () => {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle(destination?.name);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await destinationService.getDestinationBySlug(slug);
        setDestination(data.destination);
        setTours(data.tours);
      } catch (err) {
        setError("Destination not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <Loader full />;
  if (error || !destination) return <EmptyState title="Destination not found" />;

  return (
    <div>
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={destination.coverImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200"}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-app pb-10 text-white">
          <p className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-2">
            <FiMapPin /> {destination.country} · {destination.continent}
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3">{destination.name}</h1>
          <RatingStars rating={destination.rating} reviews={destination.numReviews} />
        </div>
      </div>

      <div className="container-app py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-display font-bold mb-4">About {destination.name}</h2>
          <p className="text-ink/60 leading-relaxed whitespace-pre-line">{destination.description}</p>

          {destination.popularAttractions?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-semibold text-lg mb-3">Popular attractions</h3>
              <div className="flex flex-wrap gap-2">
                {destination.popularAttractions.map((a) => (
                  <span key={a} className="badge bg-ocean-50 text-ocean-700">{a}</span>
                ))}
              </div>
            </div>
          )}

          {destination.tags?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2"><FiTag /> Tags</h3>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((t) => (
                  <span key={t} className="badge bg-coral-50 text-coral-700 capitalize">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-semibold text-lg mb-4">Quick facts</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <FiCalendar className="text-coral-500 mt-0.5" />
                <div>
                  <p className="text-ink/40">Best time to visit</p>
                  <p className="font-semibold">{destination.bestTimeToVisit || "Year-round"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaRupeeSign className="text-coral-500 mt-0.5" />
                <div>
                  <p className="text-ink/40">Average trip budget</p>
                  <p className="font-semibold">₹{destination.averageBudget || "N/A"}</p>
                </div>
              </div>
            </div>
          <Link to="/ai-planner" className="btn-primary w-full mt-6">Plan with AI</Link>
          <a href="#destination-tours" className="btn-outline w-full mt-3">Browse Tours</a>
          </div>
        </div>
      </div>

      <div id="destination-tours" className="container-app pb-24 scroll-mt-24">
        {tours.length === 0 ? (
          <EmptyState title="No tours available yet" message="Check back soon for new packages in this destination." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => (
              <TourCard key={t._id} tour={{ ...t, destination }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetails;
