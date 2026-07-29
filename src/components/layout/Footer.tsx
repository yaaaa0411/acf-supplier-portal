/**
 * Application footer.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="acf-footer border-top py-3 px-4 mt-auto">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
        <small className="text-muted">
          © {currentYear} Ambuja Cement Foundation. All rights reserved.
        </small>
        <small className="text-muted mt-1 mt-sm-0">v1.0.0</small>
      </div>
    </footer>
  );
}
