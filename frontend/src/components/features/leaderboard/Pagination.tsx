import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-secondary border-2 border-primary/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
      >
        <ChevronLeft size={20} />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-lg bg-secondary border-2 border-primary/30 text-white hover:border-primary transition"
          >
            1
          </button>
          {start > 2 && <span className="text-secondary">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg border-2 font-bold transition ${
            page === currentPage
              ? 'bg-warning text-black border-warning'
              : 'bg-secondary border-primary/30 text-white hover:border-primary'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-secondary">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-lg bg-secondary border-2 border-primary/30 text-white hover:border-primary transition"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-secondary border-2 border-primary/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
