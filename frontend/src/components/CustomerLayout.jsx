import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  User, 
  PlusCircle, 
  ShieldCheck, 
  HeartPulse, 
  History, 
  Watch, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Shield, 
  Sparkles, 
  Activity,
  CheckCircle2,
  ExternalLink,
  Sun,
  Moon,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function CustomerLayout({ children, onOpenWearable }) {
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Sample real-time notifications
  const [notifications] = useState([
    { id: 1, title: 'Health Profile Active', desc: 'Biometric records are synced with ML pricing models.', time: '10m ago', unread: true },
    { id: 2, title: 'Wearable Sync Available', desc: 'Sync your daily steps for potential premium discounts.', time: '2h ago', unread: true },
    { id: 3, title: 'Actuarial Recalculation', desc: 'Linear Regression model designated as optimal fit.', time: '1d ago', unread: false }
  ]);

  const navItems = [
    { id: 'overview', path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', path: '/profile', label: 'Health Profile', icon: User },
    { id: 'predict', path: '/predict', label: 'Predict Premium', icon: PlusCircle, badge: 'Core' },
    { id: 'insights', path: '/health-insights', label: 'Health Insights', icon: HeartPulse },
    { id: 'history', path: '/predictions/history', label: 'Prediction History', icon: History },
    { 
      id: 'wearable', 
      label: 'Wearable Health Data', 
      icon: Watch,
      action: () => {
        if (onOpenWearable) onOpenWearable();
        showToast('Opening Wearable Health Telemetry sync...', 'info');
      }
    },
    { id: 'documents', path: '/documents', label: 'Download Reports', icon: FileText },
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const isCurrent = (path) => currentPath === path;

  // Header Greeting
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F5F7FC] dark:bg-[#0B0F19] flex text-[#10172A] dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      
      {/* =========================================================
          1. DESKTOP VERTICAL SIDEBAR
      ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 sticky top-0 h-screen z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-18 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-3 cursor-pointer overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3867FF] via-[#527DFF] to-[#7657FF] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-all">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Premium<span className="text-[#3867FF]">Pulse</span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">
                    Customer Portal
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Action Button */}
          {!sidebarCollapsed && (
            <div className="p-4 pb-2">
              <button
                onClick={() => navigate('/predict')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Calculate Premium</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = item.path ? isCurrent(item.path) : false;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#3867FF] dark:text-blue-400 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#3867FF] dark:text-blue-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-[#7657FF] dark:bg-violet-950/80 dark:text-violet-300 px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Card & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {!sidebarCollapsed ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#3867FF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.full_name || 'Valued Customer'}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12B981]"></span>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      Policy Active
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-full py-2.5 flex justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* =========================================================
          2. MAIN CONTENT AREA (TOP NAV + PAGE BODY)
      ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 h-18 px-4 sm:px-8 flex items-center justify-between transition-colors">
          
          {/* Left: Mobile hamburger & Greeting */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {greeting}, {user?.full_name?.split(' ')[0] || 'Member'}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {formattedDate} • Real-Time Underwriting Engine Ready
              </p>
            </div>
          </div>

          {/* Right: Actions, Theme Toggle, Wearable, Notifications, Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Wearable Sync Button */}
            <button
              onClick={() => {
                if (onOpenWearable) onOpenWearable();
                showToast('Opening Wearable Sync...', 'info');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#3867FF] transition-all cursor-pointer"
            >
              <Watch className="w-3.5 h-3.5 text-[#3867FF]" />
              <span>Sync Wearable</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3867FF]"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-slide-up space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Underwriting Activity</span>
                    <span className="text-[10px] font-bold text-[#3867FF] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-0.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#3867FF] text-white flex items-center justify-center font-bold text-xs">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                  {user?.full_name?.split(' ')[0] || 'User'}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-slide-up space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.full_name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileDropdownOpen(false); navigate('/profile'); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Health Profile</span>
                  </button>
                  <button
                    onClick={() => { setProfileDropdownOpen(false); navigate('/settings'); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

      {/* =========================================================
          3. MOBILE SLIDE-OUT DRAWER
      ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85%] bg-white dark:bg-slate-900 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3867FF] to-[#7657FF] flex items-center justify-center text-white font-black">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    Premium<span className="text-[#3867FF]">Pulse</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = item.path ? isCurrent(item.path) : false;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#3867FF] font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
