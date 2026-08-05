import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCompass, FiCpu, FiShield, FiArrowRight, FiMapPin } from "react-icons/fi";
import HeroSearchBar from "../components/HeroSearchBar";
import DestinationCard from "../components/DestinationCard";
import TourCard from "../components/TourCard";
import Loader from "../components/Loader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import * as destinationService from "../services/destinationService";
import * as tourService from "../services/tourService";

const stats = [
  { value: "120+", label: "Destinations" },
  { value: "48K", label: "Happy travelers" },
  { value: "4.9", label: "Average rating" },
  { value: "24/7", label: "AI trip support" },
];

const features = [
  {
    icon: FiCompass,
    title: "Curated tours",
    text: "Hand-picked packages across beaches, mountains, cities and cultural landmarks worldwide.",
  },
  {
    icon: FiCpu,
    title: "AI trip planning",
    text: "Get instant destination matches, budgets, itineraries and packing lists powered by AI.",
  },
  {
    icon: FiShield,
    title: "Secure booking",
    text: "Transparent pricing, flexible cancellation and a dashboard to manage every trip.",
  },
];

const Home = () => {
  useDocumentTitle("Home");
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [destRes, tourRes] = await Promise.all([
          destinationService.getDestinations({ featured: true, limit: 4 }),
          tourService.getTours({ featured: true, limit: 6 }),
        ]);
        setDestinations(destRes.data);
        setTours(tourRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-gradient min-h-[85vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-coral-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-ocean-300/20 blur-3xl" />

        <div className="container-app relative py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow text-coral-300 mb-4">
              <FiCpu /> AI-powered travel planning
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] text-balance mb-6">
              Journeys planned by you, <span className="text-coral-300">perfected</span> by AI
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-lg">
              Discover handpicked destinations, book curated tours, and let VoyageAI craft your
              ideal itinerary, budget and packing list in seconds.
            </p>
            <HeroSearchBar />
            <div className="flex items-center gap-8 mt-10 flex-wrap">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-xl2 overflow-hidden shadow-soft aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"
                alt="Scenic travel destination"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-10 bottom-10 glass rounded-2xl p-4 w-56"
            >
              <p className="text-xs font-semibold text-ink/60 mb-1">AI Suggested</p>
              <p className="font-display font-bold text-ink">Santorini, Greece</p>
              <p className="text-xs text-ink/50 mt-1">98% match to your interests</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-eyebrow justify-center">Why VoyageAI</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 text-balance">
            Everything you need for your next journey
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center mb-5">
                <f.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-ink/50 text-sm leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured destinations */}
      <section className="bg-sand-100/60 py-24">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="section-eyebrow"><FiMapPin /> Trending now</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3">Featured destinations</h2>
            </div>
            <Link to="/destinations" className="btn-outline">
              View all <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((d) => (
                <DestinationCard key={d._id} destination={d} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured tours */}
      <section className="container-app py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="section-eyebrow">Best sellers</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3">Popular tour packages</h2>
          </div>
          <Link to="/packages" className="btn-outline">
            View all <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => (
              <TourCard key={t._id} tour={t} />
            ))}
          </div>
        )}
      </section>

      {/* AI Planner CTA */}
      <section className="container-app pb-24">
        <div className="relative rounded-xl2 overflow-hidden bg-sunset-gradient p-12 lg:p-16 text-center">
          <div className="absolute inset-0 bg-glass-shine" />
          <div className="relative">
            <FiCpu className="mx-auto text-white mb-4" size={36} />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 max-w-xl mx-auto text-balance">
              Not sure where to go? Let AI plan it for you.
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Get personalized destination picks, a full budget breakdown, and a day-by-day itinerary in under a minute.
            </p>
            <Link to="/ai-planner" className="btn bg-white text-coral-600 hover:bg-white/90 hover:-translate-y-0.5">
              Try AI Planner <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
