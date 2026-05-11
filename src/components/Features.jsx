import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
      Brain, AlertTriangle, TrendingUp, Radio, BarChart3,
      Users, MapPin, Languages
} from 'lucide-react';

const features = [
      {
            icon: Brain,
            title: 'AI Complaint Routing',
            desc: 'Machine learning automatically categorizes and routes complaints to the right department within seconds.',
            color: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            glow: 'hover:shadow-blue-200',
      },
      {
            icon: AlertTriangle,
            title: 'Emergency Detection',
            desc: 'Real-time NLP scans for critical keywords and flags life-threatening issues for immediate response.',
            color: 'from-red-500 to-rose-600',
            bg: 'bg-red-50',
            border: 'border-red-100',
            glow: 'hover:shadow-red-200',
      },
      {
            icon: TrendingUp,
            title: 'Auto Escalation',
            desc: 'Unresolved complaints automatically escalate to senior officers based on SLA timelines.',
            color: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            glow: 'hover:shadow-amber-200',
      },
      {
            icon: Radio,
            title: 'Real-Time Tracking',
            desc: 'Citizens get live status updates via SMS, email, and app notifications at every stage.',
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            glow: 'hover:shadow-emerald-200',
      },
      {
            icon: BarChart3,
            title: 'Smart Analytics Dashboard',
            desc: 'Powerful visual dashboards for officers to monitor performance, trends, and bottlenecks.',
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
            glow: 'hover:shadow-violet-200',
      },
      {
            icon: Users,
            title: 'Crowd Verification',
            desc: 'Citizens can upvote and verify complaints, helping prioritize widespread civic issues.',
            color: 'from-cyan-500 to-sky-500',
            bg: 'bg-cyan-50',
            border: 'border-cyan-100',
            glow: 'hover:shadow-cyan-200',
      },
      {
            icon: MapPin,
            title: 'Geo-Location Mapping',
            desc: 'Complaints are pinned on interactive maps for spatial analysis and field officer dispatch.',
            color: 'from-pink-500 to-rose-500',
            bg: 'bg-pink-50',
            border: 'border-pink-100',
            glow: 'hover:shadow-pink-200',
      },
      {
            icon: Languages,
            title: 'Multi-Language Support',
            desc: 'Submit complaints in 22 Indian languages. AI translates and processes them seamlessly.',
            color: 'from-indigo-500 to-blue-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            glow: 'hover:shadow-indigo-200',
      },
];

function FeatureCard({ feature, index }) {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

      return (
            <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`group relative glass rounded-2xl p-6 border ${feature.border} shadow-lg ${feature.glow} hover:shadow-xl transition-all duration-300 cursor-default`}
            >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
      );
}

export default function Features() {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

      return (
            <section id="features" className="py-24 bg-white relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section header */}
                        <motion.div
                              ref={ref}
                              initial={{ opacity: 0, y: 30 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6 }}
                              className="text-center mb-16"
                        >
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 border border-violet-200 rounded-full mb-4">
                                    <Brain className="w-4 h-4 text-violet-600" />
                                    <span className="text-sm font-semibold text-violet-700">AI-Powered Features</span>
                              </div>
                              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                                    Everything You Need for{' '}
                                    <span className="gradient-text">Smart Governance</span>
                              </h2>
                              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                    Cutting-edge AI capabilities that transform how citizens interact with government services.
                              </p>
                        </motion.div>

                        {/* Feature grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                              {features.map((feature, i) => (
                                    <FeatureCard key={feature.title} feature={feature} index={i} />
                              ))}
                        </div>
                  </div>
            </section>
      );
}
