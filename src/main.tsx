import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Bootstrap JS (needed for dropdowns, offcanvas, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Custom styles (must be after Bootstrap to override)
import './styles/custom.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
