import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useToast } from '../../context/ToastContext';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Cpu, 
  BarChart3, 
  Activity, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  BrainCircuit,
  Database,
  Bell,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  Sparkles,
  Zap,
  FileText
} from 'lucide-react';

export default function AdminLayout({ children, currentTab = 'dashboard' }) {
  const { user, logout } = useAuth();
  const { navigate, currentPath } = useRouter();
  const { showToast } = useToast();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live UTC Clock
  const [liveTime, setLiveTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', path: '/admin/users', label: 'User Management', icon: Users },
    { id: 'predictions', path: '/admin/predictions', label: 'Prediction Monitoring', icon: Layers },
    { id: 'agents', path: '/admin/agents', label: 'AI Agent Monitoring', icon: BrainCircuit },
    { id: 'analytics', path: '/admin/analytics', label: 'ML Model Analytics', icon: BarChart3 },
    { id: 'system-health', path: '/admin/system-health', label: 'System Health', icon: Activity },
    { id: 'activity', path: '/admin/activity', label: 'Activity Logs', icon: Clock },
    { id: 'notifications', path: '/admin/notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    showToast('Administrator session closed.', 'info');
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast('Refreshing telemetry and database state...', 'info', 2000);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. ENTERPRISE DARK NAVY VERTICAL SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-[#090E1A] border-r border-slate-800/80 shadow-2xl transition-all duration-300 sticky top-0 h-screen z-40 select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-white tracking-tight leading-tight">
                      Premium<span className="text-cyan-400">Pulse</span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                      ADMIN
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                    Enterprise Underwriting Command
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            {!sidebarCollapsed && (
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-2">
                Management & Telemetry
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path === '/admin/dashboard' && currentPath === '/admin');

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Customer Portal Switch & Admin User */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            title={sidebarCollapsed ? 'Public Customer Portal' : undefined}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center px-0' : 'justify-between'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {!sidebarCollapsed && <span>Customer Portal</span>}
            </span>
            {!sidebarCollapsed && <span className="text-[10px] text-slate-500">Live</span>}
          </button>

          <div
            className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between ${
              sidebarCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.full_name || 'System Admin'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user?.email || 'admin@premiumpulse.ai'}
                  </div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE RESPONSIVE DRAWER (ADMIN) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-[80vw] bg-[#090E1A] border-r border-slate-800 text-slate-200 h-full shadow-2xl flex flex-col justify-between p-4 z-10 animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="font-black text-white">
                    Premium<span className="text-cyan-400">Pulse</span> Admin
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN ADMIN CONTENT CONTAINER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#090E1A]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
          {/* Left: Mobile hamburger & Section Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-900 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline">
                Admin Console
              </span>
              <span className="text-slate-700 hidden sm:inline">/</span>
              <span className="text-sm font-black text-white capitalize">
                {currentPath.replace('/admin/', '').replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          {/* Right: Telemetry Refresh, System Status, Clock & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{liveTime}</span>
            </div>

            {/* System Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>

            {/* Refresh Telemetry Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Real-Time Dashboard"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-4 z-50 animate-slide-up text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-white">System Alerts & Telemetry</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Live</span>
                  </div>
                  <div className="divide-y divide-slate-800/80 max-h-60 overflow-y-auto">
                    <div className="py-2.5 space-y-0.5">
                      <div className="font-bold text-slate-200">Ensemble ML Models Active</div>
                      <div className="text-[11px] text-slate-400">XGBoost, Random Forest, Linear Regression loaded.</div>
                      <div className="text-[9px] text-slate-500 font-mono">Just now</div>
                    </div>
                    <div className="py-2.5 space-y-0.5">
                      <div className="font-bold text-slate-200">SQLite Database Resilient</div>
                      <div className="text-[11px] text-slate-400">WAL mode enabled, &lt;1ms ping latency verified.</div>
                      <div className="text-[9px] text-slate-500 font-mono">10m ago</div>
                    </div>
                    <div className="py-2.5 space-y-0.5">
                      <div className="font-bold text-slate-200">Multi-Agent Orchestrator Online</div>
                      <div className="text-[11px] text-slate-400">Intake, Risk, Pricing, and Insight agents operational.</div>
                      <div className="text-[9px] text-slate-500 font-mono">1h ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 animate-slide-up text-xs">
                  <div className="p-3 border-b border-slate-800">
                    <div className="font-bold text-white">{user?.full_name || 'System Administrator'}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">SUPER_ADMIN</div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Governance Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-cyan-400 hover:bg-slate-800 rounded-lg text-left font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Public Customer View</span>
                    </button>
                  </div>
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-lg text-left font-semibold"
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

        {/* Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950 dark-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
