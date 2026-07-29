interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Reusable Bootstrap 5 pagination component.
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination" id="pagination-nav">
      <ul className="pagination pagination-sm mb-0 justify-content-center justify-content-md-end">
        {/* Previous */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            type="button"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <li className="page-item disabled" key={`dots-${idx}`}>
              <span className="page-link">…</span>
            </li>
          ) : (
            <li
              className={`page-item ${page === currentPage ? 'active' : ''}`}
              key={page}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
                type="button"
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            type="button"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}
