import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEnvelope, HiLockClosed, HiMusicalNote } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      const role = res.data.role;
      toast.success(
        role === 'admin' ? 'Welcome back, Admin! 🎵👑' : 'Welcome back! 🎵'
      );
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 mb-4 shadow-lg shadow-accent-primary/10">
              <HiMusicalNote className="text-2xl text-accent-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome Back</h1>
            <p className="text-txt-secondary text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">Email</label>
              <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-txt-primary text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] placeholder:text-txt-muted
                    ${errors.email ? 'border-red-500/50' : 'border-white/[0.08]'}
                  `}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-txt-primary text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] placeholder:text-txt-muted
                    ${errors.password ? 'border-red-500/50' : 'border-white/[0.08]'}
                  `}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-accent-primary text-black font-semibold text-base shadow-lg shadow-accent-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-primary/30 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden btn-shimmer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-txt-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-primary font-medium hover:text-accent-hover transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
