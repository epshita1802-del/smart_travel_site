import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import Packages from "./pages/Packages";
import TourDetails from "./pages/TourDetails";
import Booking from "./pages/Booking";
import AIPlanner from "./pages/AIPlanner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";
import Bookings from "./pages/dashboard/Bookings";
import Favorites from "./pages/dashboard/Favorites";

import AdminLayout from "./pages/dashboard/admin/AdminLayout";
import AdminOverview from "./pages/dashboard/admin/AdminOverview";
import ManageUsers from "./pages/dashboard/admin/ManageUsers";
import ManageDestinations from "./pages/dashboard/admin/ManageDestinations";
import ManageTours from "./pages/dashboard/admin/ManageTours";
import ManageBookings from "./pages/dashboard/admin/ManageBookings";
import ManageReviews from "./pages/dashboard/admin/ManageReviews";
import ManageMessages from "./pages/dashboard/admin/ManageMessages";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "14px", fontWeight: 500 },
          success: { iconTheme: { primary: "#fa4a17", secondary: "#fff" } },
        }}
      />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetails />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:slug" element={<TourDetails />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:slug" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="favorites" element={<Favorites />} />

              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="destinations" element={<ManageDestinations />} />
                  <Route path="tours" element={<ManageTours />} />
                  <Route path="bookings" element={<ManageBookings />} />
                  <Route path="reviews" element={<ManageReviews />} />
                  <Route path="messages" element={<ManageMessages />} />
                </Route>
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;