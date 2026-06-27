import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  UserCheck, 
  Award,
  Briefcase,
  Upload,
  User,
  Key,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { portal, setPortal, adminResults, userApplications, logout, user } = useApp();
  const { isDark } = useTheme();

  const isAdmin = portal === 'admin';

  // Admin menu configuration
  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'job-descriptions', label: 'Job Descriptions', icon: FileText },
    { id: 'resumes', label: 'Resumes', icon: FileText, count: adminResults.length },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'screening-results', label: 'Screening Results', icon: Award },
    { id: 'users', label: 'Users', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // User menu configuration
  const userMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: Briefcase, count: userApplications.length },
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Key },
  ];

  const currentMenu = isAdmin ? adminMenu : userMenu;

  return (
    <aside className={`w-[250px] fixed top-0 bottom-0 left-0 z-30 flex flex-col border-r transition-all duration-300
      ${isDark 
        ? 'bg-darkSidebar border-white/5 text-white/90' 
        : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      {/* Brand Logo Section */}
      <div className="p-6 border-b border-inherit">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-primary/10' : 'bg-emerald-500/10'}`}>
            <span className="text-xl">🔍</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight flex items-center gap-1.5">
              HireLens
            </h1>
            <span className={`text-[10px] font-semibold uppercase tracking-wider block -mt-0.5
              ${isAdmin ? 'text-primary' : 'text-emerald-500'}`}
            >
              {isAdmin ? 'Admin Portal' : 'User Portal'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {currentMenu.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? isAdmin
                    ? 'bg-primary text-white admin-glow'
                    : 'bg-emerald text-white user-glow'
                  : isDark
                    ? 'hover:bg-white/5 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-inherit'}`} />
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : isDark 
                      ? 'bg-white/10 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer profile */}
      <div className="p-4 border-t border-inherit">
        {/* User Card */}
        {isAdmin ? (
          <div className={`flex items-center justify-between p-3 rounded-2xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {(user?.name || 'Admin')[0].toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@hirelens.com'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className={`p-1.5 rounded-xl border transition-all hover:scale-105
                ${isDark 
                  ? 'border-white/10 hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'border-gray-200 hover:bg-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
                }`}
              title="Logout Recruiter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className={`flex items-center justify-between p-3 rounded-2xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                {(user?.name || 'User')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@hirelens.com'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className={`p-1.5 rounded-xl border transition-all hover:scale-105
                ${isDark 
                  ? 'border-white/10 hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'border-gray-200 hover:bg-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
                }`}
              title="Logout Candidate"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
