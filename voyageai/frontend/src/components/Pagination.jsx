import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const items = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(pages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center hover:border-coral-500 hover:text-coral-600 disabled:opacity-30 disabled:hover:border-ink/10 disabled:hover:text-ink transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-10 h-10 rounded-full text-sm font-semibold hover:bg-ink/5">1</button>
          {start > 2 && <span className="text-ink/30">…</span>}
        </>
      )}

      {items.map((i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
            i === page ? "bg-coral-500 text-white shadow-glow" : "hover:bg-ink/5 text-ink/70"
          }`}
        >
          {i}
        </button>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="text-ink/30">…</span>}
          <button onClick={() => onPageChange(pages)} className="w-10 h-10 rounded-full text-sm font-semibold hover:bg-ink/5">
            {pages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center hover:border-coral-500 hover:text-coral-600 disabled:opacity-30 disabled:hover:border-ink/10 disabled:hover:text-ink transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
