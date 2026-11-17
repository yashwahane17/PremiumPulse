import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  User, 
  LogOut, 
  History, 
  HeartPulse, 
  PlusCircle, 
  Watch,
  BarChart3,
  Shield,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ onOpenWearable }) {
  const { user, logout, quickDemoLogin } = useAuth();
  const { currentPath, navigate } = useRouter();

  const isCurrent = (path) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Premium<span className="text-blue-600">Pulse</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-md">
                AI Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              InsurTech Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              isCurrent('/')
                ? 'text-blue-600 bg-blue-50/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Overview
          </button>

          {user && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/dashboard')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => navigate('/predict')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/predict')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Predict Premium
              </button>

              <button
                onClick={() => navigate('/health-insights')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/health-insights')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                Health Insights
              </button>

              <button
                onClick={() => navigate('/predictions/history')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/predictions/history')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </button>

              <button
                onClick={() => navigate('/profile')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/profile')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </>
          )}
        </nav>

        {/* User / Auth Actions */}
        <div className="flex items-center gap-2.5">
          {/* Admin Switcher Badge (if logged in user is ADMIN) */}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-900 text-violet-100 hover:bg-violet-800 transition-colors shadow-xs cursor-pointer border border-violet-700"
            >
              <Shield className="w-3.5 h-3.5 text-violet-300" />
              <span>Admin Console</span>
            </button>
          )}

          {user ? (
            <>
              <button
                onClick={onOpenWearable}
                title="Sync Wearable Health Data"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <Watch className="w-3.5 h-3.5 text-blue-600" />
                <span>Wearable Sync</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                >
                  {user.full_name?.charAt(0) || 'U'}
                </button>
                <div 
                  onClick={() => navigate('/profile')}
                  className="hidden lg:block text-left cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  quickDemoLogin();
                  navigate('/dashboard');
                }}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                Demo User
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/admin/login')}
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 cursor-pointer"
                title="Administrator Portal"
              >
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}