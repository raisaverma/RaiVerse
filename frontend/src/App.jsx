import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';

// --- Route Guards ---

/**
 * ProtectedRoute: Requires a logged-in user.
 * If not logged in, redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-white/10 border-t-accent-primary rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * AdminRoute: Requires a logged-in user with the 'admin' role.
 * If not admin, redirects to home (/).
 */
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-white/10 border-t-accent-primary rounded-full animate-spin" />
      </div>
    );
  }
  return isAdmin ? children : <Navigate to="/" replace />;
};

/**
 * GuestRoute: For pages like Login/Register that logged-in users shouldn't see.
 * If already logged in, redirects to home (/).
 */
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
};

// --- Main App Component ---

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Protected Main App Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <AdminRoute>
                <Upload />
              </AdminRoute>
            }
          />

          {/* Guest Auth Routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
