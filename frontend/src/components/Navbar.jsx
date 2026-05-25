import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMusicalNote, HiBars3, HiXMark } from 'react-icons/hi2';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exclude navbar from auth pages for cleaner UI
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const navLinks = [
    { name: 'Library', path: '/' },
    ...(isAdmin ? [{ name: 'Upload', path: '/upload' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary opacity-20 blur-md rounded-full group-hover:opacity-40 transition-opacity" />
              <HiMusicalNote className="text-2xl text-accent-primary relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-txt-primary">
              Raisa<span className="text-accent-primary">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-accent-primary'
                      : 'text-txt-secondary hover:text-txt-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-xs font-bold border border-accent-primary/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-txt-primary leading-tight">
                      {user.name}
                    </span>
                    {isAdmin && (
                      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-accent-primary">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-txt-secondary hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-xl transition-all border border-white/[0.05]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-txt-primary hover:text-accent-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-black bg-accent-primary hover:bg-accent-hover rounded-xl transition-all shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-txt-secondary hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-white/[0.08] px-4 py-4 space-y-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-txt-secondary hover:bg-white/[0.03] hover:text-txt-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-3 px-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold border border-accent-primary/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-txt-primary">{user.name}</p>
                  <p className="text-xs text-txt-muted">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-medium text-center text-txt-secondary bg-white/[0.03] rounded-xl border border-white/[0.05]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.08]">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-4 py-3 text-center text-sm font-medium text-txt-primary bg-white/[0.03] rounded-xl"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-4 py-3 text-center text-sm font-medium text-black bg-accent-primary rounded-xl shadow-lg shadow-accent-primary/20"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
