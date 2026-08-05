import { useEffect, useState } from "react";
import { FiUsers, FiMap, FiPackage, FiBookOpen, FiStar } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import Loader from "../../../components/Loader";
import * as userService from "../../../services/userService";
import * as tourService from "../../../services/tourService";
import * as destinationService from "../../../services/destinationService";
import * as bookingService from "../../../services/bookingService";
import * as reviewService from "../../../services/reviewService";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, tours, destinations, bookings, reviews] = await Promise.all([
          userService.getUsers(),
          tourService.getTours({ limit: 1000 }),
          destinationService.getDestinations({ limit: 1000 }),
          bookingService.getAllBookings(),
          reviewService.getAllReviews(),
        ]);

        const revenue = bookings
          .filter((b) => b.status !== "cancelled")
          .reduce((sum, b) => sum + b.totalPrice, 0);

        setStats({
          users: users.length,
          tours: tours.total ?? tours.data.length,
          destinations: destinations.total ?? destinations.data.length,
          bookings: bookings.length,
          reviews: reviews.length,
          revenue,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats) return <Loader full />;

  const cards = [
    { label: "Total Users", value: stats.users, icon: FiUsers, color: "bg-ocean-50 text-ocean-700" },
    { label: "Destinations", value: stats.destinations, icon: FiMap, color: "bg-coral-50 text-coral-700" },
    { label: "Tours", value: stats.tours, icon: FiPackage, color: "bg-sand-100 text-sand-800" },
    { label: "Bookings", value: stats.bookings, icon: FiBookOpen, color: "bg-ocean-50 text-ocean-700" },
    { label: "Reviews", value: stats.reviews, icon: FiStar, color: "bg-coral-50 text-coral-700" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: FaRupeeSign, color: "bg-sand-100 text-sand-800" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((c) => (
        <div key={c.label} className="card p-6">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${c.color}`}>
            <c.icon size={20} />
          </div>
          <p className="font-display font-bold text-2xl">{c.value}</p>
          <p className="text-xs text-ink/50">{c.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminOverview;
