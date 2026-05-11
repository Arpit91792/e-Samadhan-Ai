import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

const testimonials = [
      {
            name: 'Priya Sharma',
            role: 'Resident, Bengaluru',
            avatar: 'PS',
            rating: 5,
            text: 'I filed a complaint about a broken streetlight and it was fixed within 6 hours! The real-time tracking kept me informed at every step. Truly revolutionary.',
            dept: 'Electricity',
            color: 'from-yellow-400 to-amber-500',
            bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
            border: 'border-yellow-200',
      },
      {
            name: 'Rajesh Kumar',
            role: 'Shop Owner, Delhi',
            avatar: 'RK',
            rating: 5,
            text: 'The pothole outside my shop was causing accidents for months. After filing on e-Samadhan AI, the roads department responded in 2 days. Incredible platform!',
            dept: 'Roads & Transport',
            color: 'from-slate-500 to-gray-600',
            bg: 'bg-gradient-to-br from-slate-50 to-gray-50',
            border: 'border-slate-200',
      },
      {
            name: 'Anita Patel',
            role: 'Teacher, Ahmedabad',
            avatar: 'AP',
            rating: 5,
            text: 'Filing in Gujarati was so easy! The AI understood my complaint perfectly and routed it to the right department. This is what digital India should look like.',
            dept: 'Municipal Services',
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
            border: 'border-violet-200',
      },
      {
            name: 'Mohammed Irfan',
            role: 'Farmer, Hyderabad',
            avatar: 'MI',
            rating: 5,
            text: 'Water supply issue in our village was resolved in 3 days after I submitted on e-Samadhan. The officer called me personally. Never experienced this before.',
            dept: 'Water Supply',
            color: 'from-cyan-400 to-blue-500',
            bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
            border: 'border-cyan-200',
      },
      {
            name: 'Sunita Devi',
            role: 'Homemaker, Patna',
            avatar: 'SD',
            rating: 5,
            text: 'The garbage collection in our area was irregular for weeks. One complaint on e-Samadhan and the schedule was fixed permanently. Highly recommend!',
            dept: 'Sanitation',
            color: 'from-emerald-400 to-green-500',
            bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
            border: 'border-emerald-200',
      },
      {
            name: 'Arjun Nair',
            role: 'IT Professional, Chennai',
            avatar: 'AN',
            rating: 5,
            text: 'As someone in tech, I appreciate the AI routing and analytics. The platform is well-designed, fast, and actually works. Government tech done right!',
            dept: 'Healthcare',
            color: 'from-rose-400 to-red-500',
            bg: 'bg-gradient-to-br from-rose-50 to-red-50',
            border: 'border-rose-200',
      },
];

function TestimonialCard({ t, index }) {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

      return (
            <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${t.bg} border ${t.border} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative`}
            >
                  {/* Quote icon */}
                  <div className={`absolute top-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center opacity-20`}>
                        <Quote className="w-4 h-4 text-white" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-5 italic">"{t.text}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-black shadow-md`}>
                              {t.avatar}
                        </div>
                        <div>
                              <p className="text-sm font-bold text-gray-900">{t.name}</p>
                              <p className="text-xs text-gray-500">{t.role}</p>
                        </div>
                        <div className="ml-auto">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/70 text-gray-600 border ${t.border}`}>
                                    {t.dept}
                              </span>
                        </div>
                  </div>
            </motion.div>
      );
}

export default function Testimonials() {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

      return (
            <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                              ref={ref}
                              initial={{ opacity: 0, y: 30 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6 }}
                              className="text-center mb-14"
                        >
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full mb-4">
                                    <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                                    <span className="text-sm font-semibold text-amber-700">Citizen Stories</span>
                              </div>
                              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                                    Trusted by{' '}
                                    <span className="gradient-text">Millions of Citizens</span>
                              </h2>
                              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                    Real stories from real people whose civic issues were resolved through e-Samadhan AI.
                              </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                              {testimonials.map((t, i) => (
                                    <TestimonialCard key={t.name} t={t} index={i} />
                              ))}
                        </div>

                        {/* Trust badges */}
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6, delay: 0.6 }}
                              className="flex flex-wrap justify-center gap-6 mt-12"
                        >
                              {[
                                    { value: '4.9/5', label: 'App Store Rating' },
                                    { value: '2.4M+', label: 'Happy Citizens' },
                                    { value: '28', label: 'States Active' },
                                    { value: '96%', label: 'Satisfaction Score' },
                              ].map((badge) => (
                                    <div key={badge.label} className="flex flex-col items-center glass rounded-2xl px-6 py-4 shadow-md border border-white/60">
                                          <span className="text-2xl font-black gradient-text">{badge.value}</span>
                                          <span className="text-xs text-gray-500 font-medium">{badge.label}</span>
                                    </div>
                              ))}
                        </motion.div>
                  </div>
            </section>
      );
}
