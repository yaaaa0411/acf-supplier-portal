import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

/**
 * Main authenticated layout: Navbar + Sidebar + Content + Footer.
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="acf-main flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1 p-3 p-md-4">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
