import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import DestinationCard from "../components/DestinationCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useDebounce from "../hooks/useDebounce";
import * as destinationService from "../services/destinationService";

const continents = ["Asia", "Europe", "Africa", "North America", "South America", "Australia", "Antarctica"];

const Destinations = () => {
  useDocumentTitle("Destinations");
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [continent, setContinent] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pages: 1 });
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await destinationService.getDestinations({
          search: debouncedSearch,
          continent,
          sort,
          page,
          limit: 12,
        });
        setResult(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedSearch, continent, sort, page]);

  return (
    <div className="container-app py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="section-eyebrow justify-center">Explore the world</span>
        <h1 className="text-4xl font-display font-bold mt-3">All Destinations</h1>
        <p className="text-ink/50 mt-3">Browse curated destinations across every continent.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between mb-10 card p-4">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <FiSearch className="text-ink/40" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by destination or country..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>

        <select
          value={continent}
          onChange={(e) => {
            setContinent(e.target.value);
            setPage(1);
          }}
          className="input-field !py-2 !w-auto text-sm"
        >
          <option value="">All continents</option>
          {continents.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field !py-2 !w-auto text-sm"
        >
          <option value="">Sort: Newest</option>
          <option value="rating">Sort: Top rated</option>
          <option value="budget-asc">Sort: Budget (low to high)</option>
          <option value="budget-desc">Sort: Budget (high to low)</option>
        </select>
      </div>

      {loading ? (
        <Loader full />
      ) : result.data.length === 0 ? (
        <EmptyState title="No destinations found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {result.data.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
          <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Destinations;
