import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";

const HeroSearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/packages${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-full p-2 flex items-center gap-2 w-full max-w-xl"
    >
      <div className="flex items-center gap-2 pl-4 flex-1">
        <FiMapPin className="text-coral-500 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where do you want to go?"
          className="bg-transparent outline-none w-full text-sm text-ink placeholder:text-ink/40 py-2.5"
        />
      </div>
      <button type="submit" className="btn-primary !py-2.5 !px-5 shrink-0">
        <FiSearch />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
};

export default HeroSearchBar;
