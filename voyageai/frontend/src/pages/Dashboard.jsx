import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiUser, FiBookOpen, FiHeart, FiSettings } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const links = [
  { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/dashboard/bookings", label: "My Bookings", icon: FiBookOpen },
  { to: "/dashboard/favorites", label: "Favorites", icon: FiHeart },
  { to: "/dashboard/profile", label: "Edit Profile", icon: FiUser },
];

const Dashboard = () => {
  useDocumentTitle("Dashboard");
  const { user, isAdmin } = useAuth();

  return (
    <div className="container-app py-12">
      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="card p-6 h-fit">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-11 h-11 rounded-full bg-ocean-gradient text-white flex items-center justify-center font-bold overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-ink/40 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-coral-50 text-coral-600" : "text-ink/60 hover:bg-ink/5"
                  }`
                }
              >
                <link.icon size={17} /> {link.label}
              </NavLink>
            ))}

            {isAdmin && (
              <>
                <hr className="my-3 border-ink/5" />
                <NavLink
                  to="/dashboard/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? "bg-ocean-50 text-ocean-700" : "text-ink/60 hover:bg-ink/5"
                    }`
                  }
                >
                  <FiSettings size={17} /> Admin Panel
                </NavLink>
              </>
            )}
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
