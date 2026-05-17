import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import {
      User, Mail, Phone, Lock, MapPin, Building2, CreditCard,
      Camera, Upload, ArrowRight, ArrowLeft, CheckCircle2,
      LocateFixed, Loader2, Navigation2, Satellite, RefreshCw,
      AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
      Field, Input, PasswordInput, PasswordStrength, PasswordMatch,
      Select, SubmitButton, SectionHeader, ErrorAlert, OTPSection, StepProgress
} from './shared';
import useOTP from './useOTP';

const STEPS = ['Personal', 'Location', 'Govt ID', 'Face', 'Verify'];

const STATES = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
      'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
      'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const GOVT_IDS = [
      { value: 'aadhaar', label: '🪪 Aadhaar Card' },
      { value: 'pan', label: '💳 PAN Card' },
      { value: 'voter_id', label: '🗳️ Voter ID' },
      { value: 'driving_license', label: '🚗 Driving License' },
      { value: 'passport', label: '📘 Passport' },
];

// Location status enum
const LOC = { IDLE: 'idle', REQUESTING: 'requesting', FETCHING: 'fetching', SUCCESS: 'success', DENIED: 'denied', ERROR: 'error' };

export default function CitizenSignup() {
      const navigate = useNavigate();
      const { register, getDashboardPath } = useAuth();
      const otpHook = useOTP();

      const [step, setStep] = useState(0);
      const [form, setForm] = useState({
            name: '', email: '', phone: '', password: '', confirmPassword: '',
            address: '', city: '', state: '', pincode: '', latitude: '', longitude: '',
            govtIdType: 'aadhaar', govtIdNumber: '',
      });
      const [errors, setErrors] = useState({});
      const [loading, setLoading] = useState(false);
      const [showPwd, setShowPwd] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);
      const [govtIdFile, setGovtIdFile] = useState(null);
      const [liveImage, setLiveImage] = useState(null);
      const [showCam, setShowCam] = useState(false);
      const [locStatus, setLocStatus] = useState(LOC.IDLE);
      const [accuracy, setAccuracy] = useState(null);
      const webcamRef = useRef(null);

      const set = (k, v) => {
            setForm(p => ({ ...p, [k]: v }));
            if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
      };

      const capture = useCallback(() => {
            const img = webcamRef.current?.getScreenshot();
            if (img) { setLiveImage(img); setShowCam(false); toast.success('Selfie captured!'); }
      }, []);

      // ── Smart Location Detection ──────────────────────────────────────────────
      const fetchLocation = () => {
            if (!navigator.geolocation) {
                  toast.error('Geolocation not supported by your browser');
                  setLocStatus(LOC.ERROR);
                  return;
            }
            setLocStatus(LOC.REQUESTING);
            navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                        setLocStatus(LOC.FETCHING);
                        setAccuracy(Math.round(pos.coords.accuracy));
                        const { latitude, longitude } = pos.coords;
                        try {
                              const res = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
                                    { headers: { 'Accept-Language': 'en-IN,en', 'User-Agent': 'eSamadhanAI/1.0' } }
                              );
                              if (!res.ok) throw new Error('Geocoding failed');
                              const data = await res.json();
                              const a = data.address || {};

                              // Build smart address string
                              const streetParts = [
                                    a.house_number,
                                    a.road || a.pedestrian || a.footway || a.path,
                                    a.neighbourhood || a.quarter,
                                    a.suburb || a.village || a.hamlet,
                              ].filter(Boolean);

                              const fullAddress = streetParts.length
                                    ? streetParts.join(', ')
                                    : (data.display_name || '').split(',').slice(0, 4).join(',').trim();

                              const city = a.city || a.town || a.municipality || a.village || a.county || '';
                              const state = a.state || '';
                              const pincode = a.postcode || '';

                              setForm(p => ({ ...p, address: fullAddress, city, state, pincode, latitude: String(latitude), longitude: String(longitude) }));
                              setErrors(p => ({ ...p, address: '', city: '', state: '' }));
                              setLocStatus(LOC.SUCCESS);
                              toast.success('📍 Location detected successfully!');
                        } catch {
                              setLocStatus(LOC.ERROR);
                              toast.error('Could not fetch address. Please enter manually.');
                        }
                  },
                  (err) => {
                        if (err.code === 1) { setLocStatus(LOC.DENIED); toast.error('Location permission denied. Please allow access.'); }
                        else if (err.code === 2) { setLocStatus(LOC.ERROR); toast.error('Location unavailable. Enter address manually.'); }
                        else { setLocStatus(LOC.ERROR); toast.error('Location request timed out.'); }
                  },
                  { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
            );
      };

      // ── Step Validators ───────────────────────────────────────────────────────
      const validateStep = (s) => {
            const e = {};
            if (s === 0) {
                  if (!form.name.trim()) e.name = 'Full name is required';
                  if (!form.email) e.email = 'Email is required';
                  else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email address';
                  if (!form.phone) e.phone = 'Mobile number is required';
                  else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit Indian mobile number';
                  if (!form.password) e.password = 'Password is required';
                  else if (form.password.length < 8) e.password = 'Minimum 8 characters required';
                  else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(form.password)) e.password = 'Must include uppercase, lowercase & number';
                  if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
            }
            if (s === 1) {
                  if (!form.address.trim()) e.address = 'Address is required';
                  if (!form.city.trim()) e.city = 'City is required';
                  if (!form.state) e.state = 'State is required';
            }
            if (s === 2) {
                  if (!form.govtIdNumber.trim()) e.govtIdNumber = 'Government ID number is required';
            }
            if (s === 4) {
                  if (!otpHook.otpVerified) e.otp = 'Please verify your email with OTP first';
            }
            setErrors(e);
            return Object.keys(e).length === 0;
      };

      const nextStep = () => {
            if (validateStep(step)) setStep(s => Math.min(s + 1, STEPS.length - 1));
            else toast.error('Please fill all required fields');
      };
      const prevStep = () => setStep(s => Math.max(s - 1, 0));

      // ── Final Submit ──────────────────────────────────────────────────────────
      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateStep(4)) return;
            setLoading(true);
            try {
                  const fd = new FormData();
                  Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
                  fd.append('role', 'citizen');
                  fd.append('otpVerified', 'true');
                  if (govtIdFile) fd.append('govtIdImage', govtIdFile);
                  if (liveImage) {
                        const blob = await fetch(liveImage).then(r => r.blob());
                        fd.append('liveImage', blob, 'selfie.jpg');
                  }
                  const data = await register(fd);
                  toast.success(data.message || 'Account created successfully!');
                  navigate(getDashboardPath('citizen'), { replace: true });
            } catch (err) {
                  const msg = err.response?.data?.message || 'Registration failed. Please try again.';
                  toast.error(msg);
                  setErrors({ general: msg });
            } finally {
                  setLoading(false);
            }
      };

      // ── Location Button Component ─────────────────────────────────────────────
      const LocationButton = () => {
            const isLoading = locStatus === LOC.REQUESTING || locStatus === LOC.FETCHING;
            const isDenied = locStatus === LOC.DENIED;
            const isSuccess = locStatus === LOC.SUCCESS;
            const isError = locStatus === LOC.ERROR;

            return (
                  <div className="space-y-3">
                        {/* Main location button */}
                        <motion.button
                              type="button"
                              onClick={fetchLocation}
                              disabled={isLoading}
                              whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
                              whileTap={!isLoading ? { scale: 0.98 } : {}}
                              className={`w-full relative overflow-hidden flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${isSuccess
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200'
                                    : isLoading
                                          ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg cursor-not-allowed'
                                          : isDenied || isError
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                                                : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-200 hover:shadow-blue-300'
                                    }`}
                        >
                              {/* Animated background pulse */}
                              {isLoading && (
                                    <motion.div
                                          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                                          transition={{ duration: 1.5, repeat: Infinity }}
                                          className="absolute inset-0 bg-white/20 rounded-2xl"
                                    />
                              )}

                              {/* Icon */}
                              <div className="relative z-10 flex items-center gap-2.5">
                                    {isLoading ? (
                                          <>
                                                <motion.div
                                                      animate={{ rotate: 360 }}
                                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                >
                                                      <Satellite className="w-5 h-5" />
                                                </motion.div>
                                                <span>{locStatus === LOC.REQUESTING ? 'Requesting Permission...' : 'Fetching Location...'}</span>
                                          </>
                                    ) : isSuccess ? (
                                          <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Location Detected — Click to Refresh</span>
                                          </>
                                    ) : isDenied ? (
                                          <>
                                                <WifiOff className="w-5 h-5" />
                                                <span>Permission Denied — Click to Retry</span>
                                          </>
                                    ) : isError ? (
                                          <>
                                                <RefreshCw className="w-5 h-5" />
                                                <span>Failed — Click to Retry</span>
                                          </>
                                    ) : (
                                          <>
                                                <LocateFixed className="w-5 h-5" />
                                                <span>📍 Use Current Location</span>
                                          </>
                                    )}
                              </div>
                        </motion.button>

                        {/* Status cards */}
                        <AnimatePresence mode="wait">
                              {locStatus === LOC.REQUESTING && (
                                    <motion.div key="req" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                          className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                                      <Navigation2 className="w-4 h-4 text-blue-600" />
                                                </motion.div>
                                          </div>
                                          <div>
                                                <p className="text-sm font-semibold text-blue-800">Requesting Location Permission</p>
                                                <p className="text-xs text-blue-600">Please allow location access in your browser popup</p>
                                          </div>
                                    </motion.div>
                              )}

                              {locStatus === LOC.FETCHING && (
                                    <motion.div key="fetch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                          className="flex items-center gap-3 p-3.5 bg-violet-50 border border-violet-200 rounded-xl">
                                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                                          </div>
                                          <div>
                                                <p className="text-sm font-semibold text-violet-800">Detecting Your Location</p>
                                                <p className="text-xs text-violet-600">Converting GPS coordinates to address via OpenStreetMap...</p>
                                          </div>
                                    </motion.div>
                              )}

                              {locStatus === LOC.SUCCESS && (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                          className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                                          <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <p className="text-sm font-bold text-emerald-800">Location Detected Successfully!</p>
                                                {accuracy && (
                                                      <span className="ml-auto text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                                                            ±{accuracy}m accuracy
                                                      </span>
                                                )}
                                          </div>
                                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                                                {[
                                                      { label: 'Address', value: form.address },
                                                      { label: 'City', value: form.city },
                                                      { label: 'State', value: form.state },
                                                      { label: 'PIN', value: form.pincode || 'Not available' },
                                                ].map(item => (
                                                      <div key={item.label} className="bg-white/70 rounded-lg px-2.5 py-1.5">
                                                            <span className="text-emerald-600 font-semibold">{item.label}: </span>
                                                            <span className="text-gray-700 truncate">{item.value || '—'}</span>
                                                      </div>
                                                ))}
                                          </div>
                                          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                                <Wifi className="w-3 h-3" /> You can edit the fields below if needed
                                          </p>
                                    </motion.div>
                              )}

                              {locStatus === LOC.DENIED && (
                                    <motion.div key="denied" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                          className="flex items-start gap-3 p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
                                          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                          <div>
                                                <p className="text-sm font-semibold text-orange-800">Location Permission Denied</p>
                                                <p className="text-xs text-orange-600 mt-0.5">
                                                      To enable: Click the 🔒 lock icon in your browser address bar → Allow Location → Refresh and try again.
                                                </p>
                                          </div>
                                    </motion.div>
                              )}

                              {locStatus === LOC.ERROR && (
                                    <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                          className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                          <div>
                                                <p className="text-sm font-semibold text-red-800">Could Not Detect Location</p>
                                                <p className="text-xs text-red-600 mt-0.5">Please enter your address manually in the fields below.</p>
                                          </div>
                                    </motion.div>
                              )}
                        </AnimatePresence>
                  </div>
            );
      };

      // ── Step Content ──────────────────────────────────────────────────────────
      const stepVariants = {
            enter: { opacity: 0, x: 30 },
            center: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
      };

      const renderStep = () => (
            <AnimatePresence mode="wait">
                  <motion.div key={step} variants={stepVariants} initial="enter" animate="center" exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }} className="space-y-5">

                        {/* ── STEP 0: Personal Info ── */}
                        {step === 0 && (
                              <>
                                    <SectionHeader icon="👤" title="Personal Information" color="text-blue-700 bg-blue-50 border-blue-100" />
                                    <div className="grid sm:grid-cols-2 gap-4">
                                          <Field label="Full Name" error={errors.name} required>
                                                <Input icon={User} value={form.name} onChange={e => set('name', e.target.value)}
                                                      placeholder="Rajesh Kumar" error={errors.name} autoComplete="name" />
                                          </Field>
                                          <Field label="Mobile Number" error={errors.phone} required>
                                                <div className="relative">
                                                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold">+91</span>
                                                      <input type="tel" maxLength={10} value={form.phone}
                                                            onChange={e => set('phone', e.target.value.replace(/\D/, ''))}
                                                            placeholder="9876543210" autoComplete="tel"
                                                            className={`w-full pl-16 pr-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'}`} />
                                                </div>
                                                {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.phone}</p>}
                                          </Field>
                                    </div>
                                    <Field label="Email Address" error={errors.email} required>
                                          <Input icon={Mail} type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                                placeholder="you@example.com" error={errors.email} autoComplete="email" />
                                    </Field>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                          <Field label="Password" error={errors.password} required>
                                                <PasswordInput icon={Lock} show={showPwd} onToggle={() => setShowPwd(!showPwd)}
                                                      value={form.password} onChange={e => set('password', e.target.value)}
                                                      placeholder="Min 8 characters" error={errors.password} autoComplete="new-password" />
                                                <PasswordStrength password={form.password} />
                                          </Field>
                                          <Field label="Confirm Password" error={errors.confirmPassword} required>
                                                <PasswordInput icon={Lock} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
                                                      value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                                                      placeholder="Re-enter password" error={errors.confirmPassword} autoComplete="new-password" />
                                                <PasswordMatch password={form.password} confirm={form.confirmPassword} />
                                          </Field>
                                    </div>
                              </>
                        )}

                        {/* ── STEP 1: Location ── */}
                        {step === 1 && (
                              <>
                                    <SectionHeader icon="📍" title="Location Information" color="text-emerald-700 bg-emerald-50 border-emerald-100" />

                                    {/* Smart location button */}
                                    <LocationButton />

                                    {/* Divider */}
                                    <div className="flex items-center gap-3">
                                          <div className="flex-1 h-px bg-gray-200" />
                                          <span className="text-xs text-gray-400 font-medium px-2">or enter manually</span>
                                          <div className="flex-1 h-px bg-gray-200" />
                                    </div>

                                    {/* Address fields — editable after auto-fill */}
                                    <Field label="Full Address" error={errors.address} required
                                          hint="House No., Street, Locality, Area">
                                          <div className="relative">
                                                <MapPin className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                                                <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2}
                                                      placeholder="House No., Street, Locality"
                                                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 transition-all ${errors.address ? 'border-red-300 focus:ring-red-200 bg-red-50/30' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'}`} />
                                          </div>
                                    </Field>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                          <Field label="City / Town" error={errors.city} required>
                                                <Input icon={Building2} value={form.city} onChange={e => set('city', e.target.value)}
                                                      placeholder="Mumbai" error={errors.city} />
                                          </Field>
                                          <Field label="State" error={errors.state} required>
                                                <Select icon={MapPin} value={form.state} onChange={e => set('state', e.target.value)} error={errors.state}>
                                                      <option value="">Select State</option>
                                                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </Select>
                                          </Field>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                          <Field label="PIN Code">
                                                <Input icon={MapPin} value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/, '').slice(0, 6))}
                                                      placeholder="400001" maxLength={6} />
                                          </Field>
                                          {form.latitude && form.longitude && (
                                                <Field label="GPS Coordinates">
                                                      <div className="flex items-center gap-2 px-3.5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                                            <Navigation2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                            <span className="text-xs font-mono text-emerald-700 truncate">
                                                                  {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
                                                            </span>
                                                      </div>
                                                </Field>
                                          )}
                                    </div>
                              </>
                        )}

                        {/* ── STEP 2: Govt ID ── */}
                        {step === 2 && (
                              <>
                                    <SectionHeader icon="🪪" title="Government ID Verification" color="text-violet-700 bg-violet-50 border-violet-100" />
                                    <div className="grid sm:grid-cols-2 gap-4">
                                          <Field label="ID Type" required>
                                                <Select icon={CreditCard} value={form.govtIdType} onChange={e => set('govtIdType', e.target.value)}>
                                                      {GOVT_IDS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                                </Select>
                                          </Field>
                                          <Field label="ID Number" error={errors.govtIdNumber} required>
                                                <Input icon={CreditCard} value={form.govtIdNumber} onChange={e => set('govtIdNumber', e.target.value)}
                                                      placeholder="Enter ID number" error={errors.govtIdNumber} />
                                          </Field>
                                    </div>

                                    {/* ID format hints */}
                                    <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
                                          <p className="text-xs font-semibold text-violet-700 mb-1.5">Format Guide</p>
                                          <div className="grid grid-cols-2 gap-1 text-xs text-violet-600">
                                                <span>Aadhaar: 12 digits</span>
                                                <span>PAN: ABCDE1234F</span>
                                                <span>Voter ID: ABC1234567</span>
                                                <span>Passport: A1234567</span>
                                          </div>
                                    </div>

                                    <Field label="Upload Government ID Image">
                                          <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${govtIdFile ? 'border-violet-400 bg-violet-50' : 'border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50'}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${govtIdFile ? 'bg-violet-100' : 'bg-gray-100'}`}>
                                                      <Upload className={`w-5 h-5 ${govtIdFile ? 'text-violet-600' : 'text-gray-400'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                      <p className={`text-sm font-semibold ${govtIdFile ? 'text-violet-700' : 'text-gray-600'}`}>
                                                            {govtIdFile ? govtIdFile.name : 'Upload ID Image (Optional)'}
                                                      </p>
                                                      <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
                                                </div>
                                                {govtIdFile && <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />}
                                                <input type="file" accept="image/*" className="hidden" onChange={e => setGovtIdFile(e.target.files[0])} />
                                          </label>
                                    </Field>
                              </>
                        )}

                        {/* ── STEP 3: Face Capture ── */}
                        {step === 3 && (
                              <>
                                    <SectionHeader icon="📸" title="Live Face Verification" color="text-amber-700 bg-amber-50 border-amber-100" />

                                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                                          <span className="text-base flex-shrink-0">💡</span>
                                          <span>Face capture is optional but recommended for faster complaint verification. Ensure good lighting and look directly at the camera.</span>
                                    </div>

                                    <AnimatePresence mode="wait">
                                          {!showCam && !liveImage && (
                                                <motion.button key="open" type="button" onClick={() => setShowCam(true)}
                                                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                      whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                                                      className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-amber-300 rounded-2xl text-amber-600 hover:bg-amber-50 hover:border-amber-400 transition-all">
                                                      <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                                                            <Camera className="w-8 h-8 text-amber-500" />
                                                      </div>
                                                      <div className="text-center">
                                                            <p className="font-bold text-sm">Open Camera</p>
                                                            <p className="text-xs text-amber-500 mt-0.5">Click to start live face capture</p>
                                                      </div>
                                                </motion.button>
                                          )}

                                          {showCam && (
                                                <motion.div key="cam" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                                      className="space-y-3">
                                                      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl">
                                                            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full"
                                                                  videoConstraints={{ facingMode: 'user', width: 640, height: 480 }} />
                                                            {/* Overlay guide */}
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                  <div className="w-40 h-48 border-2 border-white/60 rounded-full" />
                                                            </div>
                                                            <div className="absolute bottom-3 left-0 right-0 text-center">
                                                                  <span className="text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full">Align your face in the oval</span>
                                                            </div>
                                                      </div>
                                                      <div className="flex gap-2">
                                                            <motion.button type="button" onClick={capture} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2">
                                                                  <Camera className="w-4 h-4" /> Capture Selfie
                                                            </motion.button>
                                                            <button type="button" onClick={() => setShowCam(false)}
                                                                  className="px-4 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-all">
                                                                  Cancel
                                                            </button>
                                                      </div>
                                                </motion.div>
                                          )}

                                          {liveImage && (
                                                <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                                      className="space-y-3">
                                                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl">
                                                            <img src={liveImage} alt="Captured selfie" className="w-full max-h-56 object-cover" />
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                                                                  className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                                  <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                                                            </motion.div>
                                                      </div>
                                                      <button type="button" onClick={() => { setLiveImage(null); setShowCam(true); }}
                                                            className="w-full py-2.5 text-sm text-amber-600 font-semibold border border-amber-200 rounded-xl hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
                                                            <RefreshCw className="w-4 h-4" /> Retake Selfie
                                                      </button>
                                                </motion.div>
                                          )}
                                    </AnimatePresence>

                                    <p className="text-center text-xs text-gray-400">
                                          You can skip this step — face capture is optional
                                    </p>
                              </>
                        )}

                        {/* ── STEP 4: OTP Verify ── */}
                        {step === 4 && (
                              <>
                                    <SectionHeader icon="✉️" title="Email OTP Verification" color="text-blue-700 bg-blue-50 border-blue-100" />

                                    <div className="p-4 bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 rounded-2xl">
                                          <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">📧</div>
                                                <div>
                                                      <p className="text-sm font-bold text-blue-900">Verify your email address</p>
                                                      <p className="text-xs text-blue-600">We'll send a 6-digit OTP to <strong>{form.email}</strong></p>
                                                </div>
                                          </div>
                                          {errors.otp && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mb-2">
                                                      <AlertTriangle className="w-3 h-3" /> {errors.otp}
                                                </p>
                                          )}
                                          <OTPSection
                                                email={form.email}
                                                otpSent={otpHook.otpSent}
                                                otpVerified={otpHook.otpVerified}
                                                otp={otpHook.otp}
                                                setOtp={otpHook.setOtp}
                                                timer={otpHook.timer}
                                                onSend={() => otpHook.sendOTP(form.email)}
                                                onVerify={() => otpHook.verifyOTP(form.email)}
                                                sending={otpHook.sending}
                                                verifying={otpHook.verifying}
                                          />
                                    </div>

                                    {/* Summary card */}
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                                          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Registration Summary</p>
                                          {[
                                                { label: 'Name', value: form.name },
                                                { label: 'Email', value: form.email },
                                                { label: 'Mobile', value: form.phone ? `+91 ${form.phone}` : '' },
                                                { label: 'City', value: form.city },
                                                { label: 'State', value: form.state },
                                                { label: 'ID Type', value: GOVT_IDS.find(g => g.value === form.govtIdType)?.label },
                                                { label: 'Face', value: liveImage ? '✅ Captured' : '⏭ Skipped' },
                                          ].filter(i => i.value).map(item => (
                                                <div key={item.label} className="flex items-center justify-between text-xs">
                                                      <span className="text-gray-500 font-medium">{item.label}</span>
                                                      <span className="text-gray-800 font-semibold truncate max-w-[60%] text-right">{item.value}</span>
                                                </div>
                                          ))}
                                    </div>

                                    <ErrorAlert message={errors.general} />

                                    <SubmitButton loading={loading} gradient="from-blue-600 to-violet-600"
                                          disabled={!otpHook.otpVerified}>
                                          🚀 Create Citizen Account <ArrowRight className="w-4 h-4" />
                                    </SubmitButton>
                              </>
                        )}
                  </motion.div>
            </AnimatePresence>
      );

      // ── Render ────────────────────────────────────────────────────────────────
      return (
            <div className="glass rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-violet-600 px-6 py-5">
                        <div className="flex items-center gap-3 mb-4">
                              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
                                    👤
                              </div>
                              <div>
                                    <h2 className="text-xl font-black text-white">Citizen Registration</h2>
                                    <p className="text-blue-100 text-xs">AI-powered identity verification & signup</p>
                              </div>
                        </div>
                        {/* Step progress */}
                        <StepProgress steps={STEPS} current={step} />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6">
                        {renderStep()}

                        {/* Navigation buttons */}
                        <div className={`flex gap-3 mt-6 ${step === 0 ? 'justify-end' : 'justify-between'}`}>
                              {step > 0 && (
                                    <motion.button type="button" onClick={prevStep} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                          className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-all">
                                          <ArrowLeft className="w-4 h-4" /> Back
                                    </motion.button>
                              )}

                              {step < STEPS.length - 1 && (
                                    <motion.button type="button" onClick={nextStep} whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(37,99,235,0.3)' }} whileTap={{ scale: 0.98 }}
                                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-lg transition-all">
                                          {step === 3 ? (liveImage ? 'Continue' : 'Skip & Continue') : 'Continue'}
                                          <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                              )}
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-4">
                              Already have an account?{' '}
                              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
                        </p>
                  </form>
            </div>
      );
}
