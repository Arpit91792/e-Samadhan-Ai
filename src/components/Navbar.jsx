import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
      { label: 'Home', href: '#home' },
      { label: 'Features', href: '#features' },
      { label: 'Departments', href: '#departments' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Analytics', href: '#analytics' },
      { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
      const [scrolled, setScrolled] = useState(false);
      const [mobileOpen, setMobileOpen] = useState(false);

      useEffect(() => {
            const onScroll = () => setScrolled(window.scrollY > 20);
            window.addEventListener('scroll', onScroll);
            return () => window.removeEventListener('scroll', onScroll);
      }, []);

      return (
            <motion.nav
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                              ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-100/50 border-b border-white/50'
                              : 'bg-transparent'
                        }`}
            >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 lg:h-20">
                              {/* Logo */}
                              <motion.a
                                    href="#home"
                                    className="flex items-center gap-2.5 group"
                                    whileHover={{ scale: 1.02 }}
                              >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-300 transition-shadow">
                                          <Zap className="w-5 h-5 text-white" fill="white" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                          <span className="font-black text-lg tracking-tight gradient-text">e-Samadhan</span>
                                          <span className="text-[10px] font-semibold text-violet-500 tracking-widest uppercase">AI Platform</span>
                                    </div>
                              </motion.a>

                              {/* Desktop Links */}
                              <div className="hidden lg:flex items-center gap-1">
                                    {navLinks.map((link) => (
                                          <motion.a
                                                key={link.label}
                                                href={link.href}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.97 }}
                                          >
                                                {link.label}
                                          </motion.a>
                                    ))}
                              </div>

                              {/* CTA Buttons */}
                              <div className="hidden lg:flex items-center gap-3">
                                    <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.97 }}
                                          className="px-5 py-2.5 text-sm font-semibold text-blue-600 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                                    >
                                          Login
                                    </motion.button>
                                    <motion.button
                                          whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(37,99,235,0.4)' }}
                                          whileTap={{ scale: 0.97 }}
                                          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200"
                                    >
                                          Sign Up Free
                                    </motion.button>
                              </div>

                              {/* Mobile Menu Toggle */}
                              <button
                                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                    onClick={() => setMobileOpen(!mobileOpen)}
                              >
                                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                              </button>
                        </div>
                  </div>

                  {/* Mobile Menu */}
                  <AnimatePresence>
                        {mobileOpen && (
                              <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
                              >
                                    <div className="px-4 py-4 space-y-1">
                                          {navLinks.map((link) => (
                                                <a
                                                      key={link.label}
                                                      href={link.href}
                                                      onClick={() => setMobileOpen(false)}
                                                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                      {link.label}
                                                </a>
                                          ))}
                                          <div className="pt-3 flex flex-col gap-2">
                                                <button className="w-full py-3 text-sm font-semibold text-blue-600 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all">
                                                      Login
                                                </button>
                                                <button className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-lg">
                                                      Sign Up Free
                                                </button>
                                          </div>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </motion.nav>
      );
}
