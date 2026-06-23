import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Award, 
  Shield, 
  BarChart3, 
  Settings, 
  User, 
  Key, 
  UploadCloud, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    portal, 
    adminPage, 
    setAdminPage, 
    userPage, 
    setUserPage, 
    setPortal,
    userProfile,
    users
  } = useApp();
  
  const [collapsed, setCollapsed] = useState(false);

  // Admin Links
  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Job Descriptions', icon: Briefcase, id: 'jobs' },
    { name: 'Resumes', icon: FileText, id: 'resumes' },
    { name: 'Candidates', icon: Users, id: 'candidates' },
    { name: 'Screening Results', icon: Award, id: 'screenings' },
    { name: 'Users', icon: Shield, id: 'users' },
    { name: 'Reports', icon: BarChart3, id: 'reports' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  // User Links
  const userLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'My Applications', icon: Briefcase, id: 'applications' },
    { name: 'Upload Resume', icon: UploadCloud, id: 'upload' },
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Change Password', icon: Key, id: 'password' },
  ];

  const currentLinks = portal === 'admin' ? adminLinks : userLinks;
  const currentPage = portal === 'admin' ? adminPage : userPage;
  const setCurrentPage = portal === 'admin' ? setAdminPage : setUserPage;

  // Active admin profile is Jane Doe, User is John Smith
  const profileName = portal === 'admin' ? 'Jane Doe' : userProfile.name;
  const profileEmail = portal === 'admin' ? 'jane.doe@hirelens.com' : userProfile.email;
  const profileAvatar = portal === 'admin' 
    ? users[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

  const handleLinkClick = (id: string) => {
    setCurrentPage(id);
  };

  return (
    <aside 
      className={`relative h-screen bg-sidebar dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between select-none z-30
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Sidebar Header */}
      <div>
        <div className={`p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-brand-500/20">
              HL
            </div>
            {!collapsed && (
              <span className="font-bold text-xl bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-400 dark:to-accent-400 bg-clip-text text-transparent tracking-tight">
                HireLens
              </span>
            )}
          </div>
        </div>

        {/* Portal Indicator Badge */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${portal === 'admin' ? 'bg-indigo-500' : 'bg-brand-500'} animate-pulse`} />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {portal === 'admin' ? 'Recruiter Admin' : 'Candidate Portal'}
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-230px)]">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group text-left
                  ${isActive 
                    ? 'bg-gradient-to-r from-brand-500/10 to-accent-500/5 text-brand-600 dark:text-brand-400 border-l-[3px] border-brand-500 pl-[11px]' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200 border-l-[3px] border-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105
                  ${isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'}
                `} />
                {!collapsed && (
                  <span className="text-[14px] font-medium tracking-wide">
                    {link.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div>
        {/* Toggle Collapse Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-6.5 h-6.5 rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 z-50 cursor-pointer hidden md:flex"
          style={{ width: '26px', height: '26px' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Portal Quick Switcher (Collapsed state indicator) */}
        {collapsed && (
          <div className="px-4 pb-2">
            <button 
              onClick={() => setPortal(portal === 'admin' ? 'user' : 'admin')}
              className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 flex items-center justify-center text-slate-500 transition-all duration-200 mx-auto"
              title={`Switch to ${portal === 'admin' ? 'Candidate' : 'Admin'} Portal`}
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className={`flex items-center gap-3 p-1.5 rounded-xl ${collapsed ? 'justify-center' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'} transition-all duration-200`}>
            <img 
              src={profileAvatar} 
              alt={profileName} 
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover flex-shrink-0"
            />
            {!collapsed && (
              <div className="overflow-hidden flex-1 select-text">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {profileName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {profileEmail}
                </p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={() => setPortal(portal === 'admin' ? 'user' : 'admin')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                title="Switch Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
