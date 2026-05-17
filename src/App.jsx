import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute, PublicRoute } from './components/auth/ProtectedRoute';

// ─── Landing page — eager loaded (always shown first) ─────────────────────────
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Departments from './components/Departments';
import HowItWorks from './components/HowItWorks';
import Analytics from './components/Analytics';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

// ─── Auth & Dashboard pages — lazy loaded ─────────────────────────────────────
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const CitizenDashboard = lazy(() => import('./pages/dashboards/CitizenDashboard'));
const OfficerDashboard = lazy(() => import('./pages/dashboards/OfficerDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// ─── Page loading fallback ────────────────────────────────────────────────────
const PageLoader = () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Loading...</p>
            </div>
      </div>
);

// ─── Landing page ─────────────────────────────────────────────────────────────
function LandingPage() {
      return (
            <div className="min-h-screen font-sans">
                  <Navbar />
                  <main>
                        <Hero />
                        <Features />
                        <Departments />
                        <HowItWorks />
                        <Analytics />
                        <WhyChooseUs />
                        <Testimonials />
                        <CTA />
                  </main>
                  <Footer />
            </div>
      );
}

// ─── Toast config ─────────────────────────────────────────────────────────────
const toastOptions = {
      duration: 4000,
      style: {
            background: '#fff',
            color: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            fontSize: '14px',
            fontWeight: '500',
      },
      success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
      error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
      return (
            <BrowserRouter>
                  <AuthProvider>
                        <Toaster position="top-right" toastOptions={toastOptions} />
                        <Suspense fallback={<PageLoader />}>
                              <Routes>
                                    {/* Landing */}
                                    <Route path="/" element={<LandingPage />} />

                                    {/* Auth — redirect away if already logged in */}
                                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                                    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                                    <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                                    <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

                                    {/* Protected dashboards */}
                                    <Route path="/citizen/dashboard" element={
                                          <RoleRoute roles={['citizen']}><CitizenDashboard /></RoleRoute>
                                    } />
                                    <Route path="/officer/dashboard" element={
                                          <RoleRoute roles={['officer']}><OfficerDashboard /></RoleRoute>
                                    } />
                                    <Route path="/admin/dashboard" element={
                                          <RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>
                                    } />

                                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                              </Routes>
                        </Suspense>
                  </AuthProvider>
            </BrowserRouter>
      );
}
