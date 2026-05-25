import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

/**
 * Entry point — wraps App with:
 * - BrowserRouter for client-side routing
 * - AuthProvider for global auth state
 * - Toaster for toast notifications (sleek dark themed)
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#18181b', // zinc-900
              color: '#fafafa', // zinc-50
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#18181b' }, // emerald-500
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#18181b' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
