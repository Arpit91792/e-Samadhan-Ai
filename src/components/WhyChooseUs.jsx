import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, Check, Sparkles } from 'lucide-react';

const comparisons = [
      {
            feature: 'Complaint Routing',
            traditional: 'Manual, error-prone',
            modern: 'AI auto-routes in seconds',
      },
      {
            feature: 'Resolution Time',
            traditional: '15–30 days average',
            modern: 'Under 4 hours average',
      },
      {
            feature: 'Transparency',
            traditional: 'No tracking, no updates',
            modern: 'Real-time status & notifications',
      },
      {
            feature: 'Escalation',
            traditional: 'Manual, often ignored',
            modern: 'Auto-escalation with SLA',
      },
      {
            feature: 'Analytics',
            traditional: 'No data insights',
            modern: 'Smart dashboards & reports',
      },
      {
            feature: 'Language Support',
            traditional: 'English/Hindi only',
            modern: '22 Indian languages',
      },
      {
            feature: 'Emergency Detection',
            traditional: 'Not available',
            modern: 'AI flags critical cases instantly',
      },
      {
            feature: 'Citizen Feedback',
            traditional: 'No feedback loop',
            modern: 'Ratings, reviews & verification',
      },
];

export default function WhyChooseUs() {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

      return (
            <section className="py-24 bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                  <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                              ref={ref}
                              initial={{ opacity: 0, y: 30 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6 }}
                              className="text-center mb-14"
                        >
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full mb-4">
                                    <Sparkles className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-semibold text-amber-700">Why e-Samadhan AI?</span>
                              </div>
                              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                                    Old System vs{' '}
                                    <span className="gradient-text">e-Samadhan AI</span>
                              </h2>
                              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                    See why thousands of citizens and officers prefer our AI-powered platform.
                              </p>
                        </motion.div>

                        {/* Comparison table */}
                        <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
                        >
                              {/* Table header */}
                              <div className="grid grid-cols-3 bg-gradient-to-r from-slate-800 to-slate-900">
                                    <div className="p-5 text-sm font-bold text-white/60 uppercase tracking-wider">Feature</div>
                                    <div className="p-5 text-center border-l border-white/10">
                                          <span className="text-sm font-bold text-red-300 uppercase tracking-wider">Traditional System</span>
                                    </div>
                                    <div className="p-5 text-center border-l border-white/10 bg-gradient-to-r from-blue-600/20 to-violet-600/20">
                                          <div className="flex items-center justify-center gap-2">
                                                <Sparkles className="w-4 h-4 text-blue-300" />
                                                <span className="text-sm font-bold text-blue-200 uppercase tracking-wider">e-Samadhan AI</span>
                                          </div>
                                    </div>
                              </div>

                              {/* Table rows */}
                              {comparisons.map((row, i) => (
                                    <motion.div
                                          key={row.feature}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={inView ? { opacity: 1, x: 0 } : {}}
                                          transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                                          className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/30 transition-colors`}
                                    >
                                          <div className="p-4 text-sm font-semibold text-gray-700 flex items-center">{row.feature}</div>
                                          <div className="p-4 border-l border-gray-100 flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                      <X className="w-3 h-3 text-red-500" />
                                                </div>
                                                <span className="text-sm text-gray-500">{row.traditional}</span>
                                          </div>
                                          <div className="p-4 border-l border-gray-100 flex items-center gap-2 bg-gradient-to-r from-blue-50/50 to-violet-50/50">
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                      <Check className="w-3 h-3 text-emerald-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">{row.modern}</span>
                                          </div>
                                    </motion.div>
                              ))}
                        </motion.div>
                  </div>
            </section>
      );
}
