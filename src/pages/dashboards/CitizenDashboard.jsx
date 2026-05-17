import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
      FileText, Search, Bell, LogOut, User, Zap,
      CheckCircle2, Clock, AlertTriangle, Plus, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const recentComplaints = [
      { id: '#C-4821', title: 'Broken streetlight on MG Road', dept: 'Electricity', status: 'Resolved', date: '2 days ago', color: 'text-emerald-600 bg-emerald-50' },
      { id: '#C-4820', title: 'Pothole near City Mall', dept: 'Roads', status: 'In Progress', date: '4 days ago', color: 'text-blue-600 bg-blue-50' },
      { id: '#C-4819', title: 'Water supply disruption', dept: 'Water', status: 'Pending', date: '1 week ago', color: 'text-amber-600 bg-amber-50' },
];

export default function CitizenDashboard() {
      const { user, logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = async () => {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                  {/* Navbar */}
                  <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                                          <Zap className="w-4 h-4 text-white" fill="white" />
                                    </div>
                                    <span className="font-black text-base gradient-text">e-Samadhan AI</span>
                              </div>
                              <div className="flex items-center gap-3">
                                    <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                          <Bell className="w-5 h-5" />
                                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                    </button>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl">
                                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                          </div>
                                          <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                                    </div>
                                    <button onClick={handleLogout}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                                          <LogOut className="w-4 h-4" /> Logout
                                    </button>
                              </div>
                        </div>
                  </nav>

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Welcome */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                              <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">👋</span>
                                    <h1 className="text-2xl font-black text-gray-900">Welcome, {user?.name?.split(' ')[0]}!</h1>
                              </div>
                              <p className="text-gray-500 text-sm">Citizen Dashboard — Track and manage your complaints</p>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                              {[
                                    { icon: FileText, label: 'Total Filed', value: '3', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
                                    { icon: CheckCircle2, label: 'Resolved', value: '1', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
                                    { icon: Clock, label: 'In Progress', value: '1', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' },
                                    { icon: AlertTriangle, label: 'Pending', value: '1', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
                              ].map((s, i) => (
                                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: i * 0.08 }}
                                          className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                                                <s.icon className="w-4 h-4 text-white" />
                                          </div>
                                          <p className="text-2xl font-black text-gray-900">{s.value}</p>
                                          <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                                    </motion.div>
                              ))}
                        </div>

                        {/* Quick actions */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-8">
                              {[
                                    { icon: Plus, label: 'File New Complaint', desc: 'Report a civic issue', color: 'from-blue-600 to-violet-600', text: 'text-white' },
                                    { icon: Search, label: 'Track Complaint', desc: 'Check complaint status', color: 'from-white to-white', text: 'text-blue-600', border: 'border-2 border-blue-200' },
                                    { icon: Bell, label: 'Notifications', desc: '2 new updates', color: 'from-white to-white', text: 'text-violet-600', border: 'border-2 border-violet-200' },
                              ].map((action, i) => (
                                    <motion.button key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.3 + i * 0.08 }}
                                          whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                          className={`flex items-center gap-4 p-5 bg-gradient-to-r ${action.color} ${action.border || ''} rounded-2xl shadow-md text-left transition-all`}>
                                          <div className={`w-11 h-11 rounded-xl ${action.text === 'text-white' ? 'bg-white/20' : 'bg-blue-50'} flex items-center justify-center flex-shrink-0`}>
                                                <action.icon className={`w-5 h-5 ${action.text}`} />
                                          </div>
                                          <div>
                                                <p className={`font-bold text-sm ${action.text}`}>{action.label}</p>
                                                <p className={`text-xs ${action.text === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>{action.desc}</p>
                                          </div>
                                          <ChevronRight className={`w-4 h-4 ml-auto ${action.text}`} />
                                    </motion.button>
                              ))}
                        </div>

                        {/* Recent complaints */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                                    <h2 className="font-bold text-gray-900">Recent Complaints</h2>
                                    <button className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                              </div>
                              <div className="divide-y divide-gray-50">
                                    {recentComplaints.map((c) => (
                                          <div key={c.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-4 h-4 text-blue-500" />
                                                      </div>
                                                      <div>
                                                            <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                                                            <p className="text-xs text-gray-400">{c.id} · {c.dept} · {c.date}</p>
                                                      </div>
                                                </div>
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.color}`}>{c.status}</span>
                                          </div>
                                    ))}
                              </div>
                        </motion.div>
                  </div>
            </div>
      );
}
