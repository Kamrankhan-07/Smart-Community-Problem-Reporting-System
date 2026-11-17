import React, { useState } from 'react';
import {
  BarChart3,
  ClipboardList,
  FilePlus2,
  Home,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  MapPin,
  Menu,
  Settings,
  Shield,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react';
import { CivicImage } from '../ui/CivicImage';
import { AppView, UserProfile, UserRole } from '../../types/civic';

interface WorkspaceShellProps {
  currentView: AppView;
  role: UserRole;
  userProfile: UserProfile;
  openCount: number;
  onNavigate: (view: AppView) => void;
  onRoleChange: (role: UserRole) => void;
  onExitToLanding: () => void;
  children: React.ReactNode;
}

const VIEW_TITLES: Record<AppView, string> = {
  landing: 'Home',
  'citizen-dashboard': 'Citizen Dashboard',
  'report-issue': 'Report an Issue',
  'community-map': 'Interactive Community Map',
  'my-reports': 'My Reports',
  'complaint-details': 'Complaint Details',
  'community-insights': 'Community Insights',
  'admin-dashboard': 'Administrator Dashboard',
  'admin-management': 'Complaint Management',
  'profile-settings': 'Profile & Settings',
};

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  currentView,
  role,
  userProfile,
  openCount,
  onNavigate,
  onRoleChange,
  onExitToLanding,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const citizenLinks: { view: AppView; label: string; icon: React.ReactNode }[] = [
    {
      view: 'citizen-dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      view: 'report-issue',
      label: 'Report an Issue',
      icon: <FilePlus2 className="w-4 h-4" />,
    },
    {
      view: 'community-map',
      label: 'Community Map',
      icon: <MapIcon className="w-4 h-4" />,
    },
    {
      view: 'my-reports',
      label: 'My Reports',
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      view: 'community-insights',
      label: 'Community Insights',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  const adminLinks: { view: AppView; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      view: 'admin-dashboard',
      label: 'Admin Overview',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      view: 'admin-management',
      label: 'Manage Complaints',
      icon: <SlidersHorizontal className="w-4 h-4" />,
      count: openCount,
    },
    {
      view: 'community-map',
      label: 'District Map',
      icon: <MapIcon className="w-4 h-4" />,
    },
    {
      view: 'community-insights',
      label: 'Insights & Hotspots',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  const navLinks = role === 'admin' ? adminLinks : citizenLinks;

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onExitToLanding}
          className="flex items-center gap-2.5 font-display font-bold text-[#0F2942] tracking-tight whitespace-nowrap cursor-pointer"
        >
          <span className="w-7 h-7 rounded-lg bg-[#0F2942] text-white flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" strokeWidth={2.25} />
          </span>
          <span>Smart Community</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workspace Mode Switcher */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-medium text-slate-500 mb-2 px-1">
          Workspace View
        </p>
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              onRoleChange('citizen');
              setMobileMenuOpen(false);
            }}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              role === 'citizen'
                ? 'bg-white text-[#0F2942] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => {
              onRoleChange('admin');
              setMobileMenuOpen(false);
            }}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              role === 'admin'
                ? 'bg-white text-[#0F2942] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Administrator
          </button>
        </div>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" aria-label="Workspace navigation">
        {navLinks.map((item) => {
          const isActive =
            currentView === item.view ||
            (currentView === 'complaint-details' &&
              ((role === 'citizen' && item.view === 'my-reports') ||
                (role === 'admin' && item.view === 'admin-management')));

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0F2942] text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F2942]'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {'count' in item && typeof item.count === 'number' && (
                <span
                  className={`text-xs font-mono tabular-nums ${
                    isActive ? 'text-teal-200' : 'text-slate-500'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-200 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('profile-settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'profile-settings'
                ? 'bg-[#0F2942] text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F2942]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile &amp; Settings</span>
          </button>
          <button
            type="button"
            onClick={onExitToLanding}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0F2942] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Public Landing Page</span>
          </button>
        </div>
      </nav>

      {/* Account Footer */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <button
            type="button"
            onClick={() => handleNavClick('profile-settings')}
            className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
          >
            <CivicImage
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              fallbackLabel="User"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {role === 'admin' ? 'Marcus Chen' : userProfile.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {role === 'admin' ? 'Municipal Dispatcher' : userProfile.neighborhood}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={onExitToLanding}
            title="Sign out to home"
            aria-label="Sign out to home"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Workspace Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-[#0F2942] rounded-lg"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline text-slate-500 whitespace-nowrap">
                {role === 'admin' ? 'Administrator Console' : 'Citizen Portal'}
              </span>
              <span className="hidden sm:inline text-slate-300">/</span>
              <h1 className="font-display font-semibold text-[#0F2942] truncate">
                {VIEW_TITLES[currentView]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {role === 'citizen' ? (
              <button
                type="button"
                onClick={() => onNavigate('report-issue')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163A5C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>Report an Issue</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('admin-management')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Triage Queue ({openCount})</span>
              </button>
            )}
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
