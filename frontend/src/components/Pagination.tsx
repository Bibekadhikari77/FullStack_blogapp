import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:border-primary-200 transition-all shadow-sm"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400 font-medium">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
            currentPage === page
              ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md transform scale-105'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:border-primary-200'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400 font-medium">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:border-primary-200 transition-all shadow-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 hover:border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
