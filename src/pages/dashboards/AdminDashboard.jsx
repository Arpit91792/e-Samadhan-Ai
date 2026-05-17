import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
      Zap, LogOut, Bell, Users, FileText, CheckCircle2,
      AlertTriangle, BarChart3, Settings, Shield, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const deptStats = [
      { name: 'Electricity', total: 3241, resolved: 3046, pct: 94, color: 'from-yellow-400 to-amber-500' },
      { name: 'Water Supply', total: 2108, resolved: 1855, pct: 88, color: 'from-cyan-400 to-blue-500' },
      { name: 'Roads', total: 4562, resolved: 3604, pct: 79, color: 'from-slate-500 to-gray-600' },
      { name: 'Sanitation', total: 1893, resolved: 1552, pct: 82, color: 'from-emerald-400 to-green-500' },
      { name: 'Police', total: 987, resolved: 898, pct: 91, color: 'from-blue-600 to-indigo-600' },
      { name: 'Healthcare', total: 1234, resolved: 1185, pct: 96, color: 'from-rose-400 to-red-500' },
];

export default function AdminDashboard() {
      const { user, logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = async () => {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950">
                  <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                                          <Zap className="w-4 h-4 text-white" fill="white" />
                                    </div>
                                    <div>
                                          <span className="font-black text-base text-white">e-Samadhan AI</span>
                                          <span className="ml-2 text-xs font-semibold text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full">Admin</span>
                                    </div>
                              </div>
                              <div className="flex items-center gap-3">
                                    <button className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                          <Bell className="w-5 h-5" />
                                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                    </button>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl">
                                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                          </div>
                                          <span className="text-sm font-semibold text-white hidden sm:block">{user?.name?.split(' ')[0]}</span>
                                    </div>
                                    <button onClick={handleLogout}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20 rounded-xl transition-colors font-medium">
                                          <LogOut className="w-4 h-4" /> Logout
                                    </button>
                              </div>
                        </div>
                  </nav>

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                              <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-6 h-6 text-red-400" />
                                    <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
                              </div>
                              <p className="text-blue-300/70 text-sm">Full system overview and management</p>
                        </motion.div>

                        {/* Platform stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                              {[
                                    { icon: FileText, label: 'Total Complaints', value: '14,025', color: 'from-blue-500 to-blue-600' },
                                    { icon: CheckCircle2, label: 'Resolved', value: '13,140', color: 'from-emerald-500 to-teal-500' },
                                    { icon: Users, label: 'Registered Users', value: '2.4M', color: 'from-violet-500 to-purple-600' },
                                    { icon: AlertTriangle, label: 'Emergency Cases', value: '47', color: 'from-red-500 to-rose-500' },
                              ].map((s, i) => (
                                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: i * 0.08 }}
                                          className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                                                <s.icon className="w-4 h-4 text-white" />
                                          </div>
                                          <p className="text-2xl font-black text-white">{s.value}</p>
                                          <p className="text-xs text-blue-300/70 font-medium">{s.label}</p>
                                    </motion.div>
                              ))}
                        </div>

                        {/* Quick admin actions */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-8">
                              {[
                                    { icon: Users, label: 'Manage Users', desc: 'View, activate, deactivate accounts', color: 'from-blue-600 to-blue-700' },
                                    { icon: Settings, label: 'Manage Departments', desc: 'Configure department settings', color: 'from-violet-600 to-purple-700' },
                                    { icon: TrendingUp, label: 'Analytics Report', desc: 'Download full analytics report', color: 'from-emerald-600 to-teal-700' },
                              ].map((a, i) => (
                                    <motion.button key={a.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.3 + i * 0.08 }}
                                          whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                          className={`flex items-center gap-4 p-5 bg-gradient-to-r ${a.color} rounded-2xl shadow-lg text-left`}>
                                          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                                <a.icon className="w-5 h-5 text-white" />
                                          </div>
                                          <div>
                                                <p className="font-bold text-sm text-white">{a.label}</p>
                                                <p className="text-xs text-white/70">{a.desc}</p>
                                          </div>
                                    </motion.button>
                              ))}
                        </div>

                        {/* Department performance */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                              <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="w-5 h-5 text-blue-300" />
                                    <h2 className="font-bold text-white">Department Performance</h2>
                                    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                          <span className="text-xs font-semibold text-emerald-300">Live</span>
                                    </div>
                              </div>
                              <div className="space-y-4">
                                    {deptStats.map((d, i) => (
                                          <div key={d.name}>
                                                <div className="flex justify-between text-sm mb-1.5">
                                                      <span className="text-white/80 font-medium">{d.name}</span>
                                                      <span className="text-white/60 text-xs">{d.resolved.toLocaleString()} / {d.total.toLocaleString()} · <span className="text-white font-bold">{d.pct}%</span></span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                      <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${d.pct}%` }}
                                                            transition={{ duration: 1.2, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
                                                            className={`h-full bg-gradient-to-r ${d.color} rounded-full`}
                                                      />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </motion.div>
                  </div>
            </div>
      );
}
