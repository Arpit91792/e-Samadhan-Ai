import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Key, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
      Field, Input, PasswordInput, PasswordStrength, PasswordMatch,
      SubmitButton, SectionHeader, ErrorAlert, OTPSection
} from './shared';
import useOTP from './useOTP';

export default function AdminSignup() {
      const navigate = useNavigate();
      const { register, getDashboardPath } = useAuth();
      const otpHook = useOTP();

      const [form, setForm] = useState({
            name: '', email: '', phone: '', adminSecretKey: '',
            password: '', confirmPassword: '',
      });
      const [errors, setErrors] = useState({});
      const [loading, setLoading] = useState(false);
      const [showPwd, setShowPwd] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);
      const [showSecret, setShowSecret] = useState(false);

      const set = (k, v) => {
            setForm(p => ({ ...p, [k]: v }));
            if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
      };

      const validate = () => {
            const e = {};
            if (!form.name.trim()) e.name = 'Full name is required';
            if (!form.email) e.email = 'Admin email is required';
            else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
            if (!form.phone) e.phone = 'Mobile number is required';
            else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number';
            if (!form.adminSecretKey.trim()) e.adminSecretKey = 'Admin secret key is required';
            if (!form.password) e.password = 'Password is required';
            else if (form.password.length < 8) e.password = 'Min 8 characters';
            else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(form.password)) e.password = 'Must include uppercase, lowercase & number';
            if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
            if (!otpHook.otpVerified) e.otp = 'Please verify your email with OTP';
            setErrors(e);
            return Object.keys(e).length === 0;
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validate()) { toast.error('Please fix the errors below'); return; }

            setLoading(true);
            try {
                  const fd = new FormData();
                  Object.entries(form).forEach(([k, v]) => fd.append(k, v));
                  fd.append('role', 'admin');
                  fd.append('otpVerified', 'true');

                  const data = await register(fd);
                  toast.success(data.message || 'Admin account created!');
                  navigate(getDashboardPath('admin'), { replace: true });
            } catch (err) {
                  const msg = err.response?.data?.message || 'Registration failed';
                  toast.error(msg);
                  setErrors({ general: msg });
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="glass rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                        <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">👑</div>
                              <div>
                                    <h2 className="text-xl font-black text-white">Admin Registration</h2>
                                    <p className="text-amber-100 text-xs">Requires admin secret key — restricted access</p>
                              </div>
                        </div>
                  </div>

                  {/* Security notice */}
                  <div className="mx-6 mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                              <p className="text-sm font-bold text-amber-800">Restricted Access</p>
                              <p className="text-xs text-amber-600 mt-0.5">Admin accounts require a valid secret key issued by the platform administrator. Unauthorized attempts are logged.</p>
                        </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <ErrorAlert message={errors.general} />

                        {/* Personal Info */}
                        <SectionHeader icon="👑" title="Admin Details" color="text-amber-700 bg-amber-50" />
                        <div className="grid sm:grid-cols-2 gap-4">
                              <Field label="Full Name" error={errors.name} required>
                                    <Input icon={User} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Admin Name" error={errors.name} />
                              </Field>
                              <Field label="Mobile Number" error={errors.phone} required>
                                    <div className="relative">
                                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
                                          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">+91</span>
                                          <input type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/, ''))}
                                                placeholder="9876543210"
                                                className={`w-full pl-16 pr-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'}`} />
                                    </div>
                              </Field>
                        </div>

                        <Field label="Official Admin Email" error={errors.email} required>
                              <Input icon={Mail} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@esamadhan.gov.in" error={errors.email} />
                        </Field>

                        {/* Admin Secret Key */}
                        <SectionHeader icon="🔑" title="Admin Secret Key" color="text-red-700 bg-red-50" />
                        <Field label="Admin Secret Key" error={errors.adminSecretKey} required>
                              <div className="relative">
                                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
                                    <input
                                          type={showSecret ? 'text' : 'password'}
                                          value={form.adminSecretKey}
                                          onChange={e => set('adminSecretKey', e.target.value)}
                                          placeholder="Enter admin secret key"
                                          className={`w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-mono ${errors.adminSecretKey ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-amber-200 focus:border-amber-400'}`}
                                    />
                                    <button type="button" onClick={() => setShowSecret(!showSecret)}
                                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                          {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                              </div>
                              {errors.adminSecretKey && <p className="mt-1 text-xs text-red-500">⚠ {errors.adminSecretKey}</p>}
                              <p className="mt-1.5 text-xs text-gray-400">
                                    Default dev key: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-amber-600">ESAMADHAN_ADMIN_2025</code>
                              </p>
                        </Field>

                        {/* Password */}
                        <SectionHeader icon="🔒" title="Set Password" color="text-gray-700 bg-gray-50" />
                        <div className="grid sm:grid-cols-2 gap-4">
                              <Field label="Password" error={errors.password} required>
                                    <PasswordInput icon={Lock} show={showPwd} onToggle={() => setShowPwd(!showPwd)}
                                          value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 characters" error={errors.password} />
                                    <PasswordStrength password={form.password} />
                              </Field>
                              <Field label="Confirm Password" error={errors.confirmPassword} required>
                                    <PasswordInput icon={Lock} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
                                          value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" error={errors.confirmPassword} />
                                    <PasswordMatch password={form.password} confirm={form.confirmPassword} />
                              </Field>
                        </div>

                        {/* OTP */}
                        <SectionHeader icon="✉️" title="Email OTP Verification" color="text-blue-700 bg-blue-50" />
                        {errors.otp && <p className="text-xs text-red-500">⚠ {errors.otp}</p>}
                        <OTPSection
                              email={form.email} otpSent={otpHook.otpSent} otpVerified={otpHook.otpVerified}
                              otp={otpHook.otp} setOtp={otpHook.setOtp} timer={otpHook.timer}
                              onSend={() => otpHook.sendOTP(form.email)} onVerify={() => otpHook.verifyOTP(form.email)}
                              sending={otpHook.sending} verifying={otpHook.verifying}
                        />

                        <SubmitButton loading={loading} gradient="from-amber-500 to-orange-500">
                              Create Admin Account <ArrowRight className="w-4 h-4" />
                        </SubmitButton>

                        <p className="text-center text-sm text-gray-500">
                              Already have an account?{' '}
                              <a href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</a>
                        </p>
                  </form>
            </div>
      );
}
