import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiClock, FiUsers, FiTrendingUp, FiCheck, FiX, FiCalendar, FiHeart, FiStar, FiLoader } from "react-icons/fi";
import RatingStars from "../components/RatingStars";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import * as tourService from "../services/tourService";
import * as userService from "../services/userService";
import * as reviewService from "../services/reviewService";
import { getErrorMessage } from "../services/api";
import toast from "react-hot-toast";

const TourDetails = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useDocumentTitle(tour?.title);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await tourService.getTourBySlug(slug);
        setTour(data.tour);
        setReviews(data.reviews);
      } catch (err) {
        setError("Tour not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const newReview = await reviewService.createReview({
        tourId: tour._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews([newReview, ...reviews]);
      setReviewRating(0);
      setReviewComment("");
      toast.success("Review submitted — thank you!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save favorites");
      return;
    }
    try {
      await userService.toggleFavorite(tour._id);
      toast.success("Favorites updated");
    } catch {
      toast.error("Could not update favorites");
    }
  };

  if (loading) return <Loader full />;
  if (error || !tour) return <EmptyState title="Tour not found" />;

  const price = tour.discountPrice > 0 ? tour.discountPrice : tour.price;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "inclusions", label: "Inclusions" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
  ];

  return (
    <div>
      <div className="relative h-[45vh] min-h-[380px]">
        <img src={tour.coverImage || "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200"} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-app pb-8 text-white">
          <p className="text-white/70 text-sm font-semibold mb-2">
            {tour.destination?.name}, {tour.destination?.country}
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-bold mb-3 max-w-2xl">{tour.title}</h1>
          <RatingStars rating={tour.rating} reviews={tour.numReviews} />
        </div>
      </div>

      <div className="container-app py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-6 py-6 border-y border-ink/10 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="text-coral-500" /> {tour.duration} days
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiUsers className="text-coral-500" /> Max {tour.maxGroupSize} people
            </div>
            <div className="flex items-center gap-2 text-sm capitalize">
              <FiTrendingUp className="text-coral-500" /> {tour.difficulty}
            </div>
            <span className="badge bg-ocean-50 text-ocean-700 capitalize">{tour.category}</span>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === t.id ? "bg-coral-500 text-white" : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div>
              <h2 className="font-display font-semibold text-xl mb-3">About this tour</h2>
              <p className="text-ink/60 leading-relaxed whitespace-pre-line">{tour.description}</p>
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="space-y-6">
              {tour.itinerary?.length === 0 && <p className="text-ink/50">Itinerary details coming soon.</p>}
              {tour.itinerary?.map((day) => (
                <div key={day.day} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {day.day}
                  </div>
                  <div className="pb-6 border-b border-ink/5 flex-1">
                    <h3 className="font-semibold text-ink mb-1">{day.title}</h3>
                    <p className="text-sm text-ink/50">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "inclusions" && (
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-ink mb-3 flex items-center gap-2"><FiCheck className="text-ocean-600" /> Included</h3>
                <ul className="space-y-2">
                  {tour.inclusions?.map((item) => (
                    <li key={item} className="text-sm text-ink/60 flex items-start gap-2">
                      <FiCheck className="text-ocean-500 mt-0.5 shrink-0" size={14} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-3 flex items-center gap-2"><FiX className="text-coral-500" /> Not included</h3>
                <ul className="space-y-2">
                  {tour.exclusions?.map((item) => (
                    <li key={item} className="text-sm text-ink/60 flex items-start gap-2">
                      <FiX className="text-coral-400 mt-0.5 shrink-0" size={14} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-5">
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="card p-5">
                  <h3 className="font-semibold mb-3">Leave a review</h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <FiStar
                          size={24}
                          className={star <= (hoverRating || reviewRating) ? "fill-coral-500 text-coral-500" : "fill-ink/10 text-ink/10"}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={3}
                    maxLength={500}
                    placeholder="Share your experience on this tour..."
                    className="input-field resize-none mb-4"
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? <FiLoader className="animate-spin" /> : "Submit Review"}
                  </button>
                  <p className="text-xs text-ink/40 mt-2">You can only review tours you've booked and completed.</p>
                </form>
              ) : (
                <div className="card p-5 text-sm text-ink/50">
                  <Link to="/login" className="text-coral-600 font-semibold">Log in</Link> to leave a review.
                </div>
              )}

              {reviews.length === 0 ? (
                <EmptyState title="No reviews yet" message="Be the first to review this tour after booking." />
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ocean-gradient text-white flex items-center justify-center text-xs font-bold">
                          {r.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-sm">{r.user?.name}</p>
                      </div>
                      <RatingStars rating={r.rating} showValue={false} />
                    </div>
                    <p className="text-sm text-ink/60">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline justify-between mb-1">
              <div>
                {tour.discountPrice > 0 && <p className="text-sm text-ink/30 line-through">₹{tour.price}</p>}
                <p className="font-display font-bold text-3xl text-ocean-700">₹{price}</p>
              </div>
              <span className="text-xs text-ink/40">per person</span>
            </div>

            {tour.startDates?.length > 0 && (
              <div className="mt-4 mb-5">
                <p className="text-xs font-semibold text-ink/50 mb-2 flex items-center gap-1"><FiCalendar /> Upcoming dates</p>
                <div className="flex flex-wrap gap-2">
                  {tour.startDates.slice(0, 3).map((d) => (
                    <span key={d} className="badge bg-sand-100 text-ink/70">
                      {new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link to={`/booking/${tour.slug}`} className="btn-primary w-full">Book This Tour</Link>
            <button onClick={handleFavorite} className="btn-outline w-full mt-3">
              <FiHeart /> Save to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;