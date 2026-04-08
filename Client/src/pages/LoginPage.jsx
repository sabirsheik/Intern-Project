import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const roleDashboardPath = {
  superadmin: '/dashboard/superadmin',
  admin: '/dashboard/admin',
  intern: '/dashboard/intern'
};

// Demo users - NO BACKEND REQUIRED
const demoUsers = [
  {
    id: 1,
    name: 'Superadmin User',
    email: 'superadmin@intern.com',
    password: 'password',
    role: 'superadmin'
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@intern.com',
    password: 'password',
    role: 'admin'
  },
  {
    id: 3,
    name: 'Intern User',
    email: 'intern@intern.com',
    password: 'password',
    role: 'intern'
  }
];

const demoCredentials = [
  { role: 'Super Admin', email: 'superadmin@intern.com', password: 'password' },
  { role: 'Admin', email: 'admin@intern.com', password: 'password' },
  { role: 'Intern', email: 'intern@intern.com', password: 'password' }
];

const features = [
  'Role-Based Access',
  'Multi-Domain Support',
  'Advanced Analytics',
  'Enterprise Ready'
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(roleDashboardPath[user.role] || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fillDemo = (item) => {
    setFormData((prev) => ({
      ...prev,
      email: item.email,
      password: item.password
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const email = formData.email.toLowerCase().trim();
      const password = formData.password;

      // Find user in demo data
      const foundUser = demoUsers.find(
        u => u.email.toLowerCase() === email && u.password === password
      );

      if (!foundUser) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }

      // Mock token (for localStorage)
      const token = `demo-token-${foundUser.id}-${Date.now()}`;

      // Login with local data
      login({
        token,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role
        }
      });

      toast.success(`Welcome back, ${foundUser.name}!`);
      navigate(roleDashboardPath[foundUser.role], { replace: true });
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white/60 shadow-2xl backdrop-blur-xl lg:grid-cols-2"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="mb-8">
            <p className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">
              Intern Portal
            </p>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">Intern Portal (Enterprise Edition)</h1>
            <p className="mt-2 text-slate-600">Securely manage internship operations across teams, domains, and locations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-cyan-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 my-1 rounded-lg px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a15.3 15.3 0 01-4.18 5.15" />
                      <path d="M6.61 6.61C4.06 8.05 3 10 3 10s4 7 9 7a9.74 9.74 0 003.39-.61" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" name="remember" checked={formData.remember} onChange={onChange} />
                Remember me
              </label>
              <button type="button" className="font-semibold text-cyan-700 hover:text-cyan-800">
                Forgot password
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 px-4 py-3 font-bold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <p className="mb-3 text-sm font-bold text-slate-700">Demo Credentials</p>
            <div className="space-y-2 text-sm">
              {demoCredentials.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => fillDemo(item)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:border-cyan-300"
                >
                  <span className="font-semibold text-slate-700">{item.role}</span>
                  <span className="text-xs text-slate-500">{item.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900 p-8 text-white md:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-rose-400/20 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Enterprise Control Center</p>
            <h2 className="mt-4 max-w-md text-3xl font-extrabold leading-tight md:text-4xl">Manage Your Internship Program at Scale</h2>
            <p className="mt-4 max-w-md text-slate-300">
              Run internship cohorts, assign projects, and track reporting workflows in one secure platform.
            </p>

            <div className="mt-10 space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.25 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">✓</span>
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
