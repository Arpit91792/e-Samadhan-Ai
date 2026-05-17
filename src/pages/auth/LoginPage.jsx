import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
      const navigate = useNavigate();
      const location = useLocation();
      const { login, getDashboardPath } = useAuth();

      const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
      const [showPassword, setShowPassword] = useState(false);
      const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState({});

      const from = location.state?.from?.pathname || null;

      const validate = () => {
            const errs = {};
            if (!form.email) errs.email = 'Email is required';
            else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
            if (!form.password) errs.password = 'Password is required';
            else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
            setErrors(errs);
            return Object.keys(errs).length === 0;
      };

      const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validate()) return;

            setLoading(true);
            try {
                  const data = await login(form.email, form.password);
                  toast.success(data.message || 'Welcome back!');
                  const dest = from || getDashboardPath(data.user.role);
                  navigate(dest, { replace: true });
            } catch (err) {
                  const msg = err.response?.data?.message || 'Login failed. Please try again.';
                  toast.error(msg);
                  setErrors({ general: msg });
            } finally {
                  setLoading(false);
            }
      };

      return (
            <AuthLayout
                  title="Welcome back"
                  subtitle="Sign in to your e-Samadhan AI account"
            >
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* General error */}
                        {errors.general && (
                              <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"
                              >
                                    <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
                                    {errors.general}
                              </motion.div>
                        )}

                        {/* Email */}
                        <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                              <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-[18px] h-[18px]" />
                                    <input
                                          type="email"
                                          name="email"
                                          value={form.email}
                                          onChange={handleChange}
                                          placeholder="you@example.com"
                                          autoComplete="email"
                                          className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                                                      ? 'border-red-300 focus:ring-red-200'
                                                      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                                                }`}
                                    />
                              </div>
                              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                              <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                                    <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                          Forgot password?
                                    </Link>
                              </div>
                              <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
                                    <input
                                          type={showPassword ? 'text' : 'password'}
                                          name="password"
                                          value={form.password}
                                          onChange={handleChange}
                                          placeholder="Enter your password"
                                          autoComplete="current-password"
                                          className={`w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                                                      ? 'border-red-300 focus:ring-red-200'
                                                      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                                                }`}
                                    />
                                    <button
                                          type="button"
                                          onClick={() => setShowPassword(!showPassword)}
                                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                              </div>
                              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2">
                              <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={form.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me for 7 days</label>
                        </div>

                        {/* Submit */}
                        <motion.button
                              type="submit"
                              disabled={loading}
                              whileHover={!loading ? { scale: 1.02, boxShadow: '0 10px 30px rgba(37,99,235,0.35)' } : {}}
                              whileTap={!loading ? { scale: 0.98 } : {}}
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                              {loading ? (
                                    <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Signing in...
                                    </>
                              ) : (
                                    <>
                                          Sign In
                                          <ArrowRight className="w-4 h-4" />
                                    </>
                              )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3">
                              <div className="flex-1 h-px bg-gray-200" />
                              <span className="text-xs text-gray-400 font-medium">New to e-Samadhan AI?</span>
                              <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Sign up link */}
                        <Link to="/signup">
                              <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-blue-600 font-bold rounded-xl border-2 border-blue-200 hover:border-blue-400 text-sm transition-all cursor-pointer"
                              >
                                    Create Free Account
                              </motion.div>
                        </Link>

                        {/* Demo credentials */}
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                              <p className="text-xs font-semibold text-blue-700 mb-2">Demo Credentials</p>
                              <div className="space-y-1 text-xs text-blue-600">
                                    <p>Citizen: citizen@demo.com / Demo@1234</p>
                                    <p>Officer: officer@demo.com / Demo@1234</p>
                                    <p>Admin: admin@demo.com / Demo@1234</p>
                              </div>
                        </div>
                  </form>
            </AuthLayout>
      );
}
