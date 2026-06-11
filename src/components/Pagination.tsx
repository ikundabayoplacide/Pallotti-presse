import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded border border-secondary-300/30 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded text-sm font-semibold transition ${
            page === currentPage
              ? "bg-primary-700 text-secondary-200"
              : "border border-secondary-300/30 text-secondary-100 hover:bg-primary-700 hover:text-secondary-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded border border-secondary-300/30 text-secondary-100 transition hover:bg-primary-700 hover:text-secondary-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
