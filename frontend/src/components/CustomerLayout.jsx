import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
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
  ExternalLink
} from 'lucide-react';

export default function CustomerLayout({ children, onOpenWearable }) {
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { showToast } = useToast();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample real-time notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Health Profile Active', desc: 'Biometric records are synced with ML pricing models.', time: '10m ago', unread: true },
    { id: 2, title: 'Actuarial Recalculation', desc: 'New XGBoost ensemble weights deployed.', time: '2h ago', unread: false },
    { id: 3, title: 'Wearable Sync Available', desc: 'Sync your daily steps for potential premium discounts.', time: '1d ago', unread: false }
  ]);

  const navItems = [
    { id: 'overview', path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', path: '/profile', label: 'My Health Profile', icon: User },
    { id: 'predict', path: '/predict', label: 'Predict Premium', icon: PlusCircle },
    { id: 'insights', path: '/health-insights', label: 'Health Insights', icon: HeartPulse },
    { id: 'history', path: '/predictions/history', label: 'Prediction History', icon: History },
    { 
      id: 'wearable', 
      label: 'Wearable Health Data', 
      icon: Watch,
      action: () => {
        if (onOpenWearable) onOpenWearable();
        showToast('Opening Wearable Sync interface...', 'info');
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
    showToast('You have been signed out successfully.', 'info');
    navigate('/login');
  };

  // Date and Greeting
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. DESKTOP VERTICAL SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-white border-r border-slate-200/90 shadow-xs transition-all duration-300 sticky top-0 h-screen z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="transition-opacity duration-200 truncate">
                  <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">
                    Premium<span className="text-blue-600">Pulse</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block leading-none mt-0.5">
                    Smarter Health. Fairer Insurance.
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {!sidebarCollapsed && (
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-2">
                Customer Menu
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path && (currentPath === item.path || (item.path === '/dashboard' && currentPath === '/'));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User Profile & Admin Switch */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              title={sidebarCollapsed ? 'Admin Console' : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors cursor-pointer ${
                sidebarCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <Shield className="w-4 h-4 text-violet-600 shrink-0" />
              {!sidebarCollapsed && <span>Admin Console</span>}
            </button>
          )}

          <div
            className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between ${
              sidebarCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 cursor-pointer truncate"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {user?.full_name || 'Customer'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user?.email || 'user@premiumpulse.ai'}
                  </div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE RESPONSIVE DRAWER */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10 animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="font-black text-slate-900">
                    Premium<span className="text-blue-600">Pulse</span>
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.path && (currentPath === item.path || (item.path === '/dashboard' && currentPath === '/'));
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile hamburger & Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                <span>{greeting}, {user?.full_name?.split(' ')[0] || 'Friend'}</span>
                <span className="hidden sm:inline">👋</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {formattedDate} • InsurTech Health Intelligence
              </p>
            </div>
          </div>

          {/* Right: Search, Notifications & Profile Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Action: New Estimate */}
            <button
              onClick={() => navigate('/predict')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Predict Premium</span>
            </button>

            {/* Notification Bell with Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">System Notifications</span>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                      className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-800">{n.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{n.desc}</div>
                          <div className="text-[9px] text-slate-400 mt-1">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-slide-up text-xs">
                  <div className="p-3 border-b border-slate-100">
                    <div className="font-bold text-slate-800">{user?.full_name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Health Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/documents');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download Reports</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          navigate('/admin/dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-violet-700 hover:bg-violet-50 rounded-lg text-left font-bold"
                      >
                        <Shield className="w-3.5 h-3.5 text-violet-600" />
                        <span>Admin Console</span>
                      </button>
                    )}
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-left font-semibold"
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

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

