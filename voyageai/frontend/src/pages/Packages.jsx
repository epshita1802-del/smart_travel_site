import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import TourCard from "../components/TourCard";
import FilterSidebar from "../components/FilterSidebar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useDebounce from "../hooks/useDebounce";
import * as tourService from "../services/tourService";

const Packages = () => {
  useDocumentTitle("Tour Packages");
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({ category: "", difficulty: "", minPrice: "", maxPrice: "", duration: "" });
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await tourService.getTours({
          search: debouncedSearch,
          ...filters,
          sort,
          page,
          limit: 9,
        });
        setResult(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedSearch, filters, sort, page]);

  const resetFilters = () => {
    setFilters({ category: "", difficulty: "", minPrice: "", maxPrice: "", duration: "" });
    setSort("");
    setPage(1);
  };

  return (
    <div className="container-app py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="section-eyebrow justify-center">Handpicked journeys</span>
        <h1 className="text-4xl font-display font-bold mt-3">Tour Packages</h1>
        <p className="text-ink/50 mt-3">Find the perfect guided tour for your next adventure.</p>
      </div>

      <div className="flex gap-3 items-center mb-8 card p-4">
        <FiSearch className="text-ink/40 shrink-0" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search tours by name or description..."
          className="outline-none text-sm w-full bg-transparent"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field !py-2 !w-auto text-sm hidden sm:block"
        >
          <option value="">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
          <option value="duration">Shortest duration</option>
        </select>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="btn-outline !py-2 lg:hidden shrink-0"
        >
          <FiSliders /> Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            onReset={resetFilters}
          />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-ink/50 lg:hidden flex justify-end">
            <div className="bg-sand-50 w-full max-w-xs h-full overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold text-lg">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}><FiX size={22} /></button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={(f) => {
                  setFilters(f);
                  setPage(1);
                }}
                onReset={resetFilters}
              />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <Loader full />
          ) : result.data.length === 0 ? (
            <EmptyState title="No tours found" message="Try adjusting your search or filters." action={
              <button onClick={resetFilters} className="btn-outline">Reset filters</button>
            } />
          ) : (
            <>
              <p className="text-sm text-ink/50 mb-6">{result.total} tour{result.total === 1 ? "" : "s"} found</p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {result.data.map((t) => (
                  <TourCard key={t._id} tour={t} />
                ))}
              </div>
              <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages;
