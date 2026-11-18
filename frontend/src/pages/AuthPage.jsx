import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { 
  Activity, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export default function AuthPage({ initialMode = 'login' }) {
  const { login, register, quickDemoLogin } = useAuth();
  const { navigate } = useRouter();

  // Mode: 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    }

    if (mode === 'login') {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }
    }

    if (mode === 'forgot') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(`A password recovery token has been simulated for ${email}. Enter token 'PP-2026' below to reset.`);
        setMode('reset');
      }, 700);
      return;
    }

    if (mode === 'reset') {
      if (!resetToken.trim()) {
        setErrorMsg('Please enter your recovery token.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('New password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg('Your password has been reset successfully! Please sign in with your new password.');
        setMode('login');
      }, 700);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'register') {
        await register(fullName, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await quickDemoLogin();
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[#F5F7FC] dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* =====================================================================
            LEFT PANE: Enterprise Brand Showcase (Hidden on small mobile)
        ===================================================================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#10172A] via-[#161F38] to-[#10172A] text-white p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3867FF]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7657FF]/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3867FF] to-[#7657FF] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Premium<span className="text-[#3867FF]">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Autonomous multi-agent machine learning underwriting tailored to your health biomarkers.
            </p>
          </div>

          {/* Live Agent Telemetry Simulation Card */}
          <div className="relative z-10 p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xl backdrop-blur-md space-y-3.5 my-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Underwriting Engine
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                ● Live & Operational
              </span>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Intake Agent', latency: '0.02 ms', status: 'Active' },
                { name: 'Risk Assessment Agent', latency: '0.02 ms', status: 'Active' },
                { name: 'Pricing ML Inference', latency: '15.6 ms', status: 'Ready' },
                { name: 'Insight Explainability', latency: 'Instant', status: 'Active' },
                { name: 'Central Orchestrator', latency: 'Consensus', status: 'Active' }
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#12B981]" />
                    <span>{a.name}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">{a.latency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial / Footnote */}
          <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800 pt-4 space-y-2">
            <p className="italic leading-relaxed">
              "Syncing my wearable telemetry reduced my annual renewal premium by ₹18,400 within seconds."
            </p>
            <p className="font-semibold text-slate-300 text-[11px]">
              — Certified Underwriting Policyholder
            </p>
          </div>
        </div>

        {/* =====================================================================
            RIGHT PANE: Modern Form & Controls
        ===================================================================== */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          {/* Header Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' && 'Sign in to PremiumPulse'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset your password'}
              {mode === 'reset' && 'Set new password'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login' && 'Access your personalized health risk assessments and insurance quotes.'}
              {mode === 'register' && 'Start predicting personalized premiums with multi-agent intelligence.'}
              {mode === 'forgot' && 'Enter your registered email address to receive password reset instructions.'}
              {mode === 'reset' && 'Enter the token sent to your email and your new secure password.'}
            </p>
          </div>

          {/* Instant Demo Account Pill Button (Available in Login Mode) */}
          {mode === 'login' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[#3867FF] dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#7657FF]" />
                <span>One-Click Demo Customer Access (Rajesh Verma)</span>
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs (Login vs Register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Notification Banners */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/80 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-slide-up">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#12B981]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Register Only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#3867FF] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#3867FF] transition-colors"
                />
              </div>
            </div>

            {/* Reset Token (Reset Mode Only) */}
            {mode === 'reset' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Recovery Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="e.g. PP-2026"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#3867FF] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password (Login, Register, Reset) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-xs text-[#3867FF] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#3867FF] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Reset Mode Only) */}
            {mode === 'reset' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#3867FF] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#3867FF] hover:bg-[#2954e6] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In to Account'}
                    {mode === 'register' && 'Complete Registration'}
                    {mode === 'forgot' && 'Send Recovery Instructions'}
                    {mode === 'reset' && 'Confirm & Reset Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to Login link for forgot/reset */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            )}
          </form>

          {/* Admin Portal Fast Link */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#3867FF] dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Administrator or Underwriting Officer? Sign In via Enterprise Admin Portal →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
