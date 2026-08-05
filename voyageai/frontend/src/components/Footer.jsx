import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-ink text-white mt-24">
      <div className="container-app py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sunset-gradient flex items-center justify-center font-display font-bold text-lg">V</div>
            <span className="font-display font-bold text-xl">VoyageAI</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Smart tour booking powered by AI. Discover destinations, plan itineraries, and book unforgettable journeys.
          </p>
          <div className="flex gap-3 mt-5">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-coral-500 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Explore</h4>
          <ul className="space-y-3 text-sm text-white/50">
            <li><Link to="/destinations" className="hover:text-coral-400">Destinations</Link></li>
            <li><Link to="/packages" className="hover:text-coral-400">Tour Packages</Link></li>
            <li><Link to="/ai-planner" className="hover:text-coral-400">AI Trip Planner</Link></li>
            <li><Link to="/about" className="hover:text-coral-400">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Support</h4>
          <ul className="space-y-3 text-sm text-white/50">
            <li><Link to="/contact" className="hover:text-coral-400">Contact Us</Link></li>
            <li><Link to="/dashboard/bookings" className="hover:text-coral-400">My Bookings</Link></li>
            <li><a href="#" className="hover:text-coral-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-coral-400">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Contact</h4>
          <ul className="space-y-3 text-sm text-white/50">
            <li className="flex items-center gap-2"><FiMapPin size={15} /> 128 Journey Lane, San Francisco, CA</li>
            <li className="flex items-center gap-2"><FiMail size={15} /> hello@voyageai.com</li>
            <li className="flex items-center gap-2"><FiPhone size={15} /> +1 (555) 019-2837</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} VoyageAI. All rights reserved.</p>
          <p>Built with React, Node.js, MongoDB &amp; OpenAI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
