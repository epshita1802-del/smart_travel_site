import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/dashboard/admin", label: "Overview", end: true },
  { to: "/dashboard/admin/users", label: "Users" },
  { to: "/dashboard/admin/destinations", label: "Destinations" },
  { to: "/dashboard/admin/tours", label: "Tours" },
  { to: "/dashboard/admin/bookings", label: "Bookings" },
  { to: "/dashboard/admin/reviews", label: "Reviews" },
  { to: "/dashboard/admin/messages", label: "Messages" },
];

const AdminLayout = () => {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Admin Panel</h1>
      <p className="text-ink/50 text-sm mb-6">Manage users, tours, destinations, bookings and reviews.</p>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive ? "bg-ocean-700 text-white" : "bg-white text-ink/60 hover:text-ink"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default AdminLayout;