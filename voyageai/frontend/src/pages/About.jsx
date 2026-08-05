import { motion } from "framer-motion";
import { FiCompass, FiCpu, FiHeart, FiGlobe } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";

const values = [
  { icon: FiCompass, title: "Curated experiences", text: "Every tour is vetted for quality, safety, and authenticity before it reaches our platform." },
  { icon: FiCpu, title: "AI-first planning", text: "We combine local expertise with AI to help you plan faster and travel smarter." },
  { icon: FiHeart, title: "Traveler-centric", text: "Flexible bookings, transparent pricing and real support at every step of your journey." },
  { icon: FiGlobe, title: "Global reach", text: "From alpine treks to island escapes, we connect you to destinations across every continent." },
];

const About = () => {
  useDocumentTitle("About Us");

  return (
    <div>
      <section className="bg-ocean-gradient py-24 text-center text-white">
        <div className="container-app">
          <span className="section-eyebrow text-coral-300 justify-center mb-3">About VoyageAI</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-5 text-balance">
            Making travel planning effortless, one journey at a time
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            VoyageAI blends curated tour packages with AI-powered recommendations to help travelers
            discover, plan and book unforgettable trips — without the usual guesswork.
          </p>
        </div>
      </section>

      <section className="container-app py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.img
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"
          alt="Team planning travel"
          className="rounded-xl2 shadow-soft w-full aspect-[4/3] object-cover"
        />
        <div>
          <h2 className="text-3xl font-display font-bold mb-4">Our story</h2>
          <p className="text-ink/60 leading-relaxed mb-4">
            VoyageAI was founded on a simple idea: travel planning shouldn't take longer than the
            trip itself. We started with a small collection of hand-picked tours and grew into a
            platform that pairs real travel expertise with artificial intelligence.
          </p>
          <p className="text-ink/60 leading-relaxed">
            Today, thousands of travelers use VoyageAI to discover new destinations, generate
            personalized itineraries, and book with confidence — backed by transparent pricing and
            responsive support.
          </p>
        </div>
      </section>

      <section className="bg-sand-100/60 py-24">
        <div className="container-app">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="section-eyebrow justify-center">What we stand for</span>
            <h2 className="text-3xl font-display font-bold mt-3">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="w-11 h-11 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center mb-4">
                  <v.icon size={20} />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-ink/50 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
