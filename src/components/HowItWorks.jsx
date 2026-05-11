import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FileText, Brain, Bell, CheckCircle2 } from 'lucide-react';

const steps = [
      {
            step: '01',
            icon: FileText,
            title: 'Citizen Submits Complaint',
            desc: 'Citizens file complaints via web, mobile app, or SMS in their preferred language with photos and location.',
            color: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            connector: 'bg-gradient-to-r from-blue-400 to-violet-400',
      },
      {
            step: '02',
            icon: Brain,
            title: 'AI Detects Department & Priority',
            desc: 'Our NLP engine classifies the complaint, assigns priority level, and routes it to the correct department instantly.',
            color: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-50',
            border: 'border-violet-200',
            connector: 'bg-gradient-to-r from-violet-400 to-emerald-400',
      },
      {
            step: '03',
            icon: Bell,
            title: 'Officer Gets Notified Instantly',
            desc: 'The assigned officer receives real-time alerts with full complaint details, location map, and SLA deadline.',
            color: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            connector: 'bg-gradient-to-r from-amber-400 to-emerald-400',
      },
      {
            step: '04',
            icon: CheckCircle2,
            title: 'Problem Gets Resolved Quickly',
            desc: 'Officer resolves the issue, uploads proof, and the citizen gets notified. Feedback loop closes the complaint.',
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            connector: null,
      },
];

function StepCard({ step, index, total }) {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

      return (
            <div ref={ref} className="relative flex flex-col items-center">
                  {/* Connector line (desktop) */}
                  {index < total - 1 && (
                        <div className={`hidden lg:block absolute top-10 left-1/2 w-full h-0.5 ${step.connector} z-0`}
                              style={{ left: '50%', width: 'calc(100% - 80px)', transform: 'translateX(40px)' }}
                        />
                  )}

                  <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className="relative z-10 flex flex-col items-center text-center"
                  >
                        {/* Icon circle */}
                        <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mb-4 relative`}
                        >
                              <step.icon className="w-9 h-9 text-white" />
                              {/* Step number badge */}
                              <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                                    <span className="text-xs font-black text-gray-700">{index + 1}</span>
                              </div>
                              {/* Glow */}
                              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-30`} />
                        </motion.div>

                        <div className={`${step.bg} border ${step.border} rounded-2xl p-5 max-w-xs shadow-md`}>
                              <span className="text-xs font-black text-gray-400 tracking-widest uppercase mb-2 block">Step {step.step}</span>
                              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                  </motion.div>
            </div>
      );
}

export default function HowItWorks() {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

      return (
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-violet-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                              ref={ref}
                              initial={{ opacity: 0, y: 30 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6 }}
                              className="text-center mb-16"
                        >
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full mb-4">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-semibold text-emerald-700">Simple 4-Step Process</span>
                              </div>
                              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                                    How{' '}
                                    <span className="gradient-text">e-Samadhan AI</span>{' '}
                                    Works
                              </h2>
                              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                    From complaint submission to resolution — our AI handles everything in between.
                              </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                              {steps.map((step, i) => (
                                    <StepCard key={step.step} step={step} index={i} total={steps.length} />
                              ))}
                        </div>

                        {/* Bottom CTA */}
                        <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.6, delay: 0.8 }}
                              className="text-center mt-14"
                        >
                              <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 15px 35px rgba(37,99,235,0.35)' }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl text-base"
                              >
                                    Register Your First Complaint →
                              </motion.button>
                        </motion.div>
                  </div>
            </section>
      );
}
