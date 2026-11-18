import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  Sparkles, 
  LogOut, 
  BarChart3,
  PlusCircle, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ArrowRight
} from 'lucide-react';

export default function Navbar({ onOpenWearable }) {
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (path) => currentPath === path;

  const handleNavClick = (sectionId, path = '/') => {
    setMobileMenuOpen(false);
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3867FF] via-[#527DFF] to-[#7657FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-200">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Premium<span className="text-[#3867FF]">Pulse</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#3867FF] dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 px-1.5 py-0.5 rounded-full">
                AI InsurTech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Autonomous Actuarial Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => navigate('/')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              isCurrent('/') && !currentPath.includes('#')
                ? 'text-[#3867FF] bg-blue-50 dark:bg-blue-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('ai-technology')}
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7657FF]" />
            <span>AI Technology</span>
          </button>
          <button
            onClick={() => handleNavClick('about-us')}
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            About Us
          </button>

          {user && (
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          )}

          {user && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/dashboard')
                    ? 'text-[#3867FF] bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#3867FF]" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/predict')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent('/predict')
                    ? 'text-[#7657FF] bg-violet-50 dark:bg-violet-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#7657FF]" />
                <span>Predict</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#3867FF] text-white flex items-center justify-center font-bold text-xs">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <span className="max-w-[110px] truncate">{user.full_name?.split(' ')[0] || 'User'}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Sign out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#3867FF] dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4.5 py-2 rounded-xl text-sm font-bold bg-[#3867FF] hover:bg-[#2954e6] text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2 animate-slide-up">
          <button
            onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('ai-technology')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            AI Technology
          </button>
          <button
            onClick={() => handleNavClick('about-us')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            About Us
          </button>

          {user ? (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#3867FF] bg-blue-50 dark:bg-blue-950/50 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/predict'); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#7657FF] bg-violet-50 dark:bg-violet-950/50 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Predict Premium</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-[#3867FF] text-white"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
