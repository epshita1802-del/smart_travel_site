import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiGrid, FiCompass } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/destinations", label: "Destinations" },
  { to: "/packages", label: "Packages" },
  { to: "/ai-planner", label: "AI Planner" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-card" : "bg-transparent"
      }`}
    >
      <nav className="container-app flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 z-10" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-sunset-gradient flex items-center justify-center text-white font-display font-bold text-lg shadow-glow">
            V
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-ink">VoyageAI</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isActive ? "text-coral-600 bg-coral-50" : "text-ink/70 hover:text-ink hover:bg-ink/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-ink/10 hover:border-coral-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-ocean-gradient flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-semibold text-ink">{user.name?.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft border border-ink/5 py-2 overflow-hidden"
                  >
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-ink/5">
                      <FiGrid /> Dashboard
                    </Link>
                    <Link to="/dashboard/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-ink/5">
                      <FiHeart /> Favorites
                    </Link>
                    <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-ink/5">
                      <FiUser /> Edit Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/dashboard/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80 hover:bg-ink/5">
                        <FiCompass /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-2 border-ink/5" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-coral-600 hover:bg-coral-50">
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline !py-2.5">Log In</Link>
              <Link to="/register" className="btn-primary !py-2.5">Sign Up</Link>
            </>
          )}
        </div>

        <button className="lg:hidden z-10 text-ink" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-ink/5 overflow-hidden"
          >
            <div className="container-app py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? "text-coral-600 bg-coral-50" : "text-ink/70"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="my-2 border-ink/5" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-semibold text-ink/70">Dashboard</Link>
                  <button onClick={handleLogout} className="text-left px-4 py-3 rounded-xl text-sm font-semibold text-coral-600">Logout</button>
                </>
              ) : (
                <div className="flex gap-3 px-4 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Log In</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
