import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import EmptyState from "../../../components/EmptyState";
import * as bookingService from "../../../services/bookingService";
import { getErrorMessage } from "../../../services/api";

const statuses = ["pending", "confirmed", "completed", "cancelled"];
const paymentStatuses = ["unpaid", "paid", "refunded"];

const statusStyles = {
  pending: "bg-sand-100 text-ink/60",
  confirmed: "bg-ocean-50 text-ocean-700",
  completed: "bg-coral-50 text-coral-700",
  cancelled: "bg-ink/5 text-ink/40",
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings(filter ? { status: filter } : {});
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const updateStatus = async (booking, status) => {
    try {
      await bookingService.updateBookingStatus(booking._id, { status });
      toast.success("Booking status updated");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const updatePayment = async (booking, paymentStatus) => {
    try {
      await bookingService.updateBookingStatus(booking._id, { paymentStatus });
      toast.success("Payment status updated");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${!filter ? "bg-ocean-700 text-white" : "bg-white text-ink/50"}`}>All</button>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${filter === s ? "bg-ocean-700 text-white" : "bg-white text-ink/50"}`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/5 text-left text-ink/40 text-xs uppercase">
                <th className="p-4">Traveler</th>
                <th className="p-4">Tour</th>
                <th className="p-4">Travel Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4">
                    <p className="font-semibold">{b.user?.name}</p>
                    <p className="text-xs text-ink/40">{b.user?.email}</p>
                  </td>
                  <td className="p-4 text-ink/60">{b.tour?.title}</td>
                  <td className="p-4 text-ink/60">{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">₹{b.totalPrice}</td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 capitalize ${statusStyles[b.status]}`}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={b.paymentStatus}
                      onChange={(e) => updatePayment(b, e.target.value)}
                      className="text-xs font-semibold rounded-full px-3 py-1.5 border border-ink/10 capitalize"
                    >
                      {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
