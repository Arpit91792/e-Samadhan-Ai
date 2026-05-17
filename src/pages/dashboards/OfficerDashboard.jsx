import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, LogOut, Bell, ClipboardList, CheckCircle2, Clock, AlertTriangle, BarChart3, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const assigned = [
      { id: '#C-4825', title: 'Power outage in Sector 12', priority: 'High', status: 'Open', time: '1 hr ago', priorityColor: 'text-red-600 bg-red-50' },
      { id: '#C-4823', title: 'Transformer fault near school', priority: 'Medium', status: 'In Progress', time: '3 hrs ago', priorityColor: 'text-amber-600 bg-amber-50' },
      { id: '#C-4820', title: 'Billing discrepancy complaint', priority: 'Low', status: 'Open', time: '1 day ago', priorityColor: 'text-blue-600 bg-blue-50' },
      { id: '#C-4818', title: 'Street light not working', priority: 'Low', status: 'Resolved', time: '2 days ago', priorityColor: 'text-blue-600 bg-blue-50' },
];

const DEPT_LABELS = {
      electricity: 'Electricity', water_supply: 'Water Supply', roads_transport: 'Roads & Transport',
      sanitation: 'Sanitation', police: 'Police', healthcare: 'Healthcare',
      municipal: 'Municipal Services', education: 'Education', general: 'General',
};

export default function OfficerDashboard() {
      const { user, logout } = useAuth();
      const navigate = useNavigate();

      const handleLogout = async () => {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                  <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                                          <Zap className="w-4 h-4 text-white" fill="white" />
                                    </div>
                                    <div>
                                          <span className="font-black text-base gradient-text">e-Samadhan AI</span>
                                          <span className="ml-2 text-xs font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">Officer Panel</span>
                                    </div>
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
                                          <div className="hidden sm:block">
                                                <p className="text-xs font-bold text-gray-700">{user?.name?.split(' ')[0]}</p>
                                                <p className="text-[10px] text-gray-400">{DEPT_LABELS[user?.department] || 'Officer'}</p>
                                          </div>
                                    </div>
                                    <button onClick={handleLogout}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                                          <LogOut className="w-4 h-4" /> Logout
                                    </button>
                              </div>
                        </div>
                  </nav>

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                              <h1 className="text-2xl font-black text-gray-900">Officer Dashboard</h1>
                              <p className="text-gray-500 text-sm mt-1">
                                    {DEPT_LABELS[user?.department] || 'General'} Department · {user?.email}
                              </p>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                              {[
                                    { icon: ClipboardList, label: 'Assigned', value: '12', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
                                    { icon: Clock, label: 'Open', value: '8', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
                                    { icon: CheckCircle2, label: 'Resolved Today', value: '4', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
                                    { icon: AlertTriangle, label: 'Overdue', value: '2', color: 'from-red-500 to-rose-500', bg: 'bg-red-50' },
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

                        {/* Performance */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                              <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    <h2 className="font-bold text-gray-900">This Month's Performance</h2>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                    {[
                                          { label: 'Resolution Rate', value: '87%', color: 'from-emerald-500 to-teal-500' },
                                          { label: 'Avg. Response Time', value: '3.2 hrs', color: 'from-blue-500 to-blue-600' },
                                          { label: 'Citizen Rating', value: '4.7/5', color: 'from-amber-400 to-orange-500' },
                                    ].map((m) => (
                                          <div key={m.label} className="text-center p-3 bg-gray-50 rounded-xl">
                                                <p className={`text-xl font-black bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>{m.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                                          </div>
                                    ))}
                              </div>
                        </motion.div>

                        {/* Assigned complaints */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                                    <h2 className="font-bold text-gray-900">Assigned Complaints</h2>
                                    <button className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                              </div>
                              <div className="divide-y divide-gray-50">
                                    {assigned.map((c) => (
                                          <div key={c.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <ClipboardList className="w-4 h-4 text-blue-500" />
                                                      </div>
                                                      <div>
                                                            <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                                                            <p className="text-xs text-gray-400">{c.id} · {c.time}</p>
                                                      </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.priorityColor}`}>{c.priority}</span>
                                                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </motion.div>
                  </div>
            </div>
      );
}
