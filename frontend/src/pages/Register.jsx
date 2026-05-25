import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiEnvelope, HiLockClosed, HiMusicalNote } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      const role = res.data.role;
      toast.success(
        role === 'admin' ? 'Welcome, Admin! 🎵👑' : 'Account created! 🎵'
      );
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
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
            <h1 className="text-2xl font-bold tracking-tight mb-1">Create Account</h1>
            <p className="text-txt-secondary text-sm">Join RaisaVerse and start listening</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-txt-primary text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] placeholder:text-txt-muted
                    ${errors.name ? 'border-red-500/50' : 'border-white/[0.08]'}
                  `}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

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
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-txt-primary text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] placeholder:text-txt-muted
                    ${errors.password ? 'border-red-500/50' : 'border-white/[0.08]'}
                  `}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-txt-secondary mb-2">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-txt-primary text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-white/[0.05] placeholder:text-txt-muted
                    ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/[0.08]'}
                  `}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-accent-primary text-black font-semibold text-base shadow-lg shadow-accent-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-primary/30 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden btn-shimmer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-txt-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-primary font-medium hover:text-accent-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
