import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiCompass, FiCalendar, FiPackage, FiInfo, FiMapPin, FiLoader, FiSend,
} from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";
import * as aiService from "../services/aiService";
import { getErrorMessage } from "../services/api";

const tools = [
  { id: "destination", label: "Destination Match", icon: FiCompass },
  { id: "itinerary", label: "Itinerary Builder", icon: FiCalendar },
  { id: "packing", label: "Packing Checklist", icon: FiPackage },
  { id: "tips", label: "Travel Tips", icon: FiInfo },
  { id: "attractions", label: "Nearby Attractions", icon: FiMapPin },
];

const AIPlanner = () => {
  useDocumentTitle("AI Planner");
  const [activeTool, setActiveTool] = useState("destination");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [destForm, setDestForm] = useState({ interests: "", travelStyle: "", budgetLevel: "", season: "", tripLengthDays: "" });
  const [itineraryForm, setItineraryForm] = useState({ destination: "", tripLengthDays: "", interests: "", pace: "moderate" });
  const [packingForm, setPackingForm] = useState({ destination: "", season: "", tripLengthDays: "", activities: "" });
  const [tipsForm, setTipsForm] = useState({ destination: "" });
  const [attractionsForm, setAttractionsForm] = useState({ destination: "" });

  const switchTool = (id) => {
    setActiveTool(id);
    setResult(null);
  };

  const runTool = async (fn, payload) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await fn(payload);
      setResult(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sand-100/50 min-h-screen">
      <div className="bg-ocean-gradient py-16">
        <div className="container-app text-center text-white">
          <span className="section-eyebrow text-coral-300 justify-center mb-3">AI Travel Assistant</span>
          <h1 className="text-4xl font-display font-bold mb-3">Plan your perfect trip with AI</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Get destination matches, itineraries, packing lists, tips and nearby attractions — instantly.
          </p>
        </div>
      </div>

      <div className="container-app py-12">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-10 pb-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTool(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTool === t.id ? "bg-coral-500 text-white shadow-glow" : "bg-white text-ink/60 hover:text-ink"
              }`}
            >
              <t.icon /> {t.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <div className="card p-6 h-fit">
            {activeTool === "destination" && (
              <form onSubmit={(e) => { e.preventDefault(); runTool(aiService.getDestinationRecommendation, destForm); }} className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-1">Find your destination</h2>
                <div>
                  <label className="label">Your interests</label>
                  <textarea required rows={3} value={destForm.interests} onChange={(e) => setDestForm({ ...destForm, interests: e.target.value })} placeholder="e.g. hiking, local food, historic sites, relaxing beaches" className="input-field resize-none" />
                </div>
                <div>
                  <label className="label">Travel style</label>
                  <select value={destForm.travelStyle} onChange={(e) => setDestForm({ ...destForm, travelStyle: e.target.value })} className="input-field">
                    <option value="">Select style</option>
                    <option value="solo">Solo</option>
                    <option value="couple">Couple / Honeymoon</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends group</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Budget level</label>
                    <select value={destForm.budgetLevel} onChange={(e) => setDestForm({ ...destForm, budgetLevel: e.target.value })} className="input-field">
                      <option value="">Any</option>
                      <option value="budget">Budget</option>
                      <option value="mid-range">Mid-range</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Trip length</label>
                    <input type="number" min={1} value={destForm.tripLengthDays} onChange={(e) => setDestForm({ ...destForm, tripLengthDays: e.target.value })} placeholder="Days" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label">Preferred season</label>
                  <input value={destForm.season} onChange={(e) => setDestForm({ ...destForm, season: e.target.value })} placeholder="e.g. Summer, December" className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <FiLoader className="animate-spin" /> : <FiSend />} Get Recommendations
                </button>
              </form>
            )}

            {activeTool === "itinerary" && (
              <form onSubmit={(e) => { e.preventDefault(); runTool(aiService.getItinerary, itineraryForm); }} className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-1">Build a day-wise itinerary</h2>
                <div>
                  <label className="label">Destination</label>
                  <input required value={itineraryForm.destination} onChange={(e) => setItineraryForm({ ...itineraryForm, destination: e.target.value })} placeholder="e.g. Kyoto, Japan" className="input-field" />
                </div>
                <div>
                  <label className="label">Trip length (days)</label>
                  <input required type="number" min={1} max={30} value={itineraryForm.tripLengthDays} onChange={(e) => setItineraryForm({ ...itineraryForm, tripLengthDays: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Interests</label>
                  <input value={itineraryForm.interests} onChange={(e) => setItineraryForm({ ...itineraryForm, interests: e.target.value })} placeholder="e.g. temples, food, nightlife" className="input-field" />
                </div>
                <div>
                  <label className="label">Pace</label>
                  <select value={itineraryForm.pace} onChange={(e) => setItineraryForm({ ...itineraryForm, pace: e.target.value })} className="input-field">
                    <option value="relaxed">Relaxed</option>
                    <option value="moderate">Moderate</option>
                    <option value="packed">Packed</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <FiLoader className="animate-spin" /> : <FiSend />} Generate Itinerary
                </button>
              </form>
            )}

            {activeTool === "packing" && (
              <form onSubmit={(e) => { e.preventDefault(); runTool(aiService.getPackingChecklist, packingForm); }} className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-1">Generate a packing checklist</h2>
                <div>
                  <label className="label">Destination</label>
                  <input required value={packingForm.destination} onChange={(e) => setPackingForm({ ...packingForm, destination: e.target.value })} placeholder="e.g. Swiss Alps" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Season</label>
                    <input value={packingForm.season} onChange={(e) => setPackingForm({ ...packingForm, season: e.target.value })} placeholder="e.g. Winter" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Trip length</label>
                    <input type="number" min={1} value={packingForm.tripLengthDays} onChange={(e) => setPackingForm({ ...packingForm, tripLengthDays: e.target.value })} placeholder="Days" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label">Planned activities</label>
                  <input value={packingForm.activities} onChange={(e) => setPackingForm({ ...packingForm, activities: e.target.value })} placeholder="e.g. skiing, hiking, sightseeing" className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <FiLoader className="animate-spin" /> : <FiSend />} Generate Checklist
                </button>
              </form>
            )}

            {activeTool === "tips" && (
              <form onSubmit={(e) => { e.preventDefault(); runTool(aiService.getTravelTips, tipsForm); }} className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-1">Get local travel tips</h2>
                <div>
                  <label className="label">Destination</label>
                  <input required value={tipsForm.destination} onChange={(e) => setTipsForm({ destination: e.target.value })} placeholder="e.g. Santorini, Greece" className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <FiLoader className="animate-spin" /> : <FiSend />} Get Travel Tips
                </button>
              </form>
            )}

            {activeTool === "attractions" && (
              <form onSubmit={(e) => { e.preventDefault(); runTool(aiService.getNearbyAttractions, attractionsForm); }} className="space-y-4">
                <h2 className="font-display font-semibold text-lg mb-1">Discover nearby attractions</h2>
                <div>
                  <label className="label">Destination</label>
                  <input required value={attractionsForm.destination} onChange={(e) => setAttractionsForm({ destination: e.target.value })} placeholder="e.g. Rome, Italy" className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <FiLoader className="animate-spin" /> : <FiSend />} Find Attractions
                </button>
              </form>
            )}
          </div>

          <div>
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card p-16 flex flex-col items-center justify-center text-center">
                  <FiLoader className="animate-spin text-coral-500 mb-4" size={32} />
                  <p className="text-ink/50 text-sm">VoyageAI is thinking...</p>
                </motion.div>
              )}

              {!loading && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 flex flex-col items-center justify-center text-center">
                  <FiCompass className="text-ink/15 mb-4" size={48} />
                  <p className="text-ink/40 text-sm max-w-xs">Fill out the form to get AI-powered travel recommendations tailored to you.</p>
                </motion.div>
              )}

              {!loading && result && activeTool === "destination" && (
                <motion.div key="dest-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-5">
                  {result.recommendations?.map((r, i) => (
                    <div key={i} className="card p-5">
                      <h3 className="font-display font-semibold text-lg mb-3">{r.destination}</h3>
                      <p className="text-sm text-ink/60">{r.reason}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {!loading && result && activeTool === "itinerary" && (
                <motion.div key="itinerary-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {result.days?.map((day) => (
                    <div key={day.day} className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold text-sm shrink-0">{day.day}</div>
                        <h3 className="font-display font-semibold text-lg">{day.title}</h3>
                      </div>
                      <div className="space-y-3 pl-12">
                        <p className="text-sm"><span className="font-semibold text-ocean-700">Morning: </span><span className="text-ink/60">{day.morning}</span></p>
                        <p className="text-sm"><span className="font-semibold text-ocean-700">Afternoon: </span><span className="text-ink/60">{day.afternoon}</span></p>
                        <p className="text-sm"><span className="font-semibold text-ocean-700">Evening: </span><span className="text-ink/60">{day.evening}</span></p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {!loading && result && activeTool === "packing" && (
                <motion.div key="packing-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-5">
                  {result.categories?.map((cat) => (
                    <div key={cat.category} className="card p-5">
                      <h3 className="font-semibold mb-3">{cat.category}</h3>
                      <ul className="space-y-2">
                        {cat.items?.map((item, i) => (
                          <li key={i} className="text-sm text-ink/60 flex items-center gap-2">
                            <input type="checkbox" className="accent-coral-500 rounded" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}

              {!loading && result && activeTool === "tips" && (
                <motion.div key="tips-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {result.tips?.map((t, i) => (
                    <div key={i} className="card p-5 flex gap-4">
                      <span className="badge bg-coral-50 text-coral-700 h-fit shrink-0">{t.category}</span>
                      <p className="text-sm text-ink/60">{t.tip}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {!loading && result && activeTool === "attractions" && (
                <motion.div key="attractions-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 gap-5">
                  {result.attractions?.map((a, i) => (
                    <div key={i} className="card p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{a.name}</h3>
                        <span className="badge bg-ocean-50 text-ocean-700 capitalize">{a.type}</span>
                      </div>
                      <p className="text-xs text-ink/40 mb-2">{a.distanceFromCenter}</p>
                      <p className="text-sm text-ink/60">{a.description}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;