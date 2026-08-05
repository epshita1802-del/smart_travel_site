import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCalendar, FiUsers, FiX } from "react-icons/fi";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import * as bookingService from "../../services/bookingService";
import { getErrorMessage } from "../../services/api";

const statusStyles = {
  pending: "bg-sand-100 text-ink/60",
  confirmed: "bg-ocean-50 text-ocean-700",
  completed: "bg-coral-50 text-coral-700",
  cancelled: "bg-ink/5 text-ink/40",
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async () => {
    try {
      await bookingService.cancelBooking(cancelTarget._id, "Cancelled by user from dashboard");
      toast.success("Booking cancelled");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold">My Bookings</h1>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                filter === f ? "bg-coral-500 text-white" : "bg-white text-ink/50 hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No bookings found" message="You haven't made any bookings in this category yet." action={<Link to="/packages" className="btn-primary">Browse Tours</Link>} />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b._id} className="card p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
              <img src={b.tour?.coverImage} alt="" className="w-full sm:w-28 h-28 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold">{b.tour?.title}</h3>
                  <span className={`badge capitalize ${statusStyles[b.status]}`}>{b.status}</span>
                </div>
                <p className="text-xs text-ink/40 mb-2">{b.tour?.destination?.name}, {b.tour?.destination?.country}</p>
                <div className="flex items-center gap-4 text-xs text-ink/50">
                  <span className="flex items-center gap-1"><FiCalendar /> {new Date(b.travelDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FiUsers /> {b.numOfTravelers} traveler{b.numOfTravelers > 1 ? "s" : ""}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-lg text-ocean-700 mb-2">₹{b.totalPrice}</p>
                {(b.status === "pending" || b.status === "confirmed") && (
                  <button onClick={() => setCancelTarget(b)} className="text-xs font-semibold text-coral-600 hover:underline flex items-center gap-1 ml-auto">
                    <FiX size={13} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancel this booking?"
        message="This action cannot be undone. Your booking will be marked as cancelled."
        confirmLabel="Yes, cancel it"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default Bookings;
