import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiHeart, FiCompass, FiArrowRight } from "react-icons/fi";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import * as bookingService from "../../services/bookingService";
import * as userService from "../../services/userService";

const Overview = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, f] = await Promise.all([bookingService.getMyBookings(), userService.getFavorites()]);
        setBookings(b);
        setFavorites(f);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader full />;

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const upcoming = activeBookings
    .filter((b) => new Date(b.travelDate) > new Date())
    .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate))[0];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="text-ink/50 text-sm mb-8">Here's a summary of your travel activity.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="card p-6">
          <FiBookOpen className="text-coral-500 mb-3" size={22} />
          <p className="font-display font-bold text-2xl">{activeBookings.length}</p>
          <p className="text-xs text-ink/50">Active bookings</p>
        </div>
        <div className="card p-6">
          <FiHeart className="text-coral-500 mb-3" size={22} />
          <p className="font-display font-bold text-2xl">{favorites.length}</p>
          <p className="text-xs text-ink/50">Saved favorites</p>
        </div>
        <div className="card p-6">
          <FiCompass className="text-coral-500 mb-3" size={22} />
          <p className="font-display font-bold text-2xl">{bookings.length}</p>
          <p className="text-xs text-ink/50">Total trips booked</p>
        </div>
      </div>

      {upcoming && (
        <div className="card p-6 mb-10 bg-ocean-gradient text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Next trip</p>
            <h3 className="font-display font-bold text-xl">{upcoming.tour?.title}</h3>
            <p className="text-white/70 text-sm mt-1">
              {new Date(upcoming.travelDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Link to="/dashboard/bookings" className="btn bg-white text-ocean-700 hover:bg-white/90">
            View details <FiArrowRight />
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">Recent bookings</h2>
        <Link to="/dashboard/bookings" className="text-sm font-semibold text-coral-600 hover:underline">View all</Link>
      </div>
      {bookings.length === 0 ? (
        <div className="card p-10 text-center text-ink/50 text-sm">No bookings yet. <Link to="/packages" className="text-coral-600 font-semibold">Browse tours</Link></div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 3).map((b) => (
            <div key={b._id} className="card p-4 flex items-center gap-4">
              <img src={b.tour?.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{b.tour?.title}</p>
                <p className="text-xs text-ink/40">{new Date(b.travelDate).toLocaleDateString()}</p>
              </div>
              <span className={`badge capitalize ${
                b.status === "confirmed" ? "bg-ocean-50 text-ocean-700" :
                b.status === "cancelled" ? "bg-coral-50 text-coral-700" : "bg-sand-100 text-ink/60"
              }`}>{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;
