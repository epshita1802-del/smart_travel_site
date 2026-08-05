const categories = ["adventure", "beach", "cultural", "wildlife", "mountain", "city", "cruise", "honeymoon", "family"];
const difficulties = ["easy", "moderate", "challenging"];

const FilterSidebar = ({ filters, onChange, onReset }) => {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
   <aside className="card p-6 h-fit">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-lg">Filters</h3>
        <button onClick={onReset} className="text-xs font-semibold text-coral-600 hover:underline">
          Reset all
        </button>
      </div>

      <div className="mb-6">
        <p className="label">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => set("category", filters.category === cat ? "" : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                filters.category === cat
                  ? "bg-coral-500 text-white border-coral-500"
                  : "border-ink/10 text-ink/60 hover:border-coral-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="label">Difficulty</p>
        <div className="flex gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => set("difficulty", filters.difficulty === d ? "" : d)}
              className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                filters.difficulty === d
                  ? "bg-ocean-700 text-white border-ocean-700"
                  : "border-ink/10 text-ink/60 hover:border-ocean-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="label">Price range </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => set("minPrice", e.target.value)}
            className="input-field !py-2 text-sm"
          />
          <span className="text-ink/30">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => set("maxPrice", e.target.value)}
            className="input-field !py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <p className="label">Max duration (days)</p>
        <input
          type="range"
          min={1}
          max={21}
          value={filters.duration || 21}
          onChange={(e) => set("duration", e.target.value)}
          className="w-full accent-coral-500"
        />
        <p className="text-xs text-ink/50 mt-1">Up to {filters.duration || 21} days</p>
      </div>
    </aside>
  );
};

export default FilterSidebar;
