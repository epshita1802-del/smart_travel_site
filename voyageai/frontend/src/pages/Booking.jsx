import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar, FiUsers, FiPhone, FiMessageSquare } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import * as tourService from "../services/tourService";
import * as bookingService from "../services/bookingService";
import { getErrorMessage } from "../services/api";

const Booking = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Book Tour");

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    travelDate: "",
    numOfTravelers: 1,
    contactPhone: user?.phone || "",
    specialRequests: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await tourService.getTourBySlug(slug);
        setTour(data.tour);
      } catch (err) {
        setError("Tour not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingService.createBooking({
        tourId: tour._id,
        ...form,
        numOfTravelers: Number(form.numOfTravelers),
      });
      toast.success("Booking confirmed! Check your dashboard for details.");
      navigate("/dashboard/bookings");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader full />;
  if (error || !tour) return <EmptyState title="Tour not found" />;

  const unitPrice = tour.discountPrice > 0 ? tour.discountPrice : tour.price;
  const total = unitPrice * Number(form.numOfTravelers || 1);
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container-app py-16 grid lg:grid-cols-3 gap-10">
      <form onSubmit={handleSubmit} className="lg:col-span-2 card p-8">
        <h1 className="text-2xl font-display font-bold mb-1">Complete your booking</h1>
        <p className="text-ink/50 text-sm mb-8">{tour.title}</p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label"><FiCalendar className="inline mr-1" /> Travel date</label>
            <input
              type="date"
              name="travelDate"
              min={minDate}
              value={form.travelDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="label"><FiUsers className="inline mr-1" /> Number of travelers</label>
            <input
              type="number"
              name="numOfTravelers"
              min={1}
              max={tour.maxGroupSize}
              value={form.numOfTravelers}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="label"><FiPhone className="inline mr-1" /> Contact phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            required
            placeholder="+1 555 123 4567"
            className="input-field"
          />
        </div>

        <div className="mt-5">
          <label className="label"><FiMessageSquare className="inline mr-1" /> Special requests (optional)</label>
          <textarea
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            rows={4}
            placeholder="Dietary restrictions, accessibility needs, celebration occasions..."
            className="input-field resize-none"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full mt-8">
          {submitting ? "Confirming booking..." : "Confirm Booking"}
        </button>
      </form>

      <div>
        <div className="card overflow-hidden sticky top-24">
          <img src={tour.coverImage} alt={tour.title} className="w-full h-40 object-cover" />
          <div className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4">{tour.title}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/50">Price per person</span>
                <span className="font-semibold">₹{unitPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50">Travelers</span>
                <span className="font-semibold">{form.numOfTravelers || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50">Duration</span>
                <span className="font-semibold">{tour.duration} days</span>
              </div>
              <hr className="border-ink/10" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-display font-bold text-ocean-700">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
