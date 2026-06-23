import React, { useState } from 'react';
import { useApp, ThemeColor } from '../context/AppContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  Sparkles, 
  Palette, 
  Check, 
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    portal, 
    setPortal, 
    theme, 
    toggleTheme, 
    themeColor, 
    setThemeColor, 
    notifications,
    markNotificationsAsRead,
    adminPage,
    userPage
  } = useApp();

  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const colorsList: { name: string; value: ThemeColor; class: string }[] = [
    { name: 'Emerald + Teal', value: 'emerald-teal', class: 'from-emerald-500 to-teal-500' },
    { name: 'Blue + Purple', value: 'blue-purple', class: 'from-blue-500 to-purple-500' },
    { name: 'Orange + Amber', value: 'orange-amber', class: 'from-orange-500 to-amber-500' },
    { name: 'Rose + Pink', value: 'rose-pink', class: 'from-rose-500 to-pink-500' },
    { name: 'Dark Navy + Cyan', value: 'navy-cyan', class: 'from-slate-900 to-cyan-500' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getPageTitle = () => {
    const page = portal === 'admin' ? adminPage : userPage;
    return page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase tracking-wider">
          {portal}
        </span>
        <span className="text-slate-300 dark:text-slate-700 text-sm">/</span>
        <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
          {getPageTitle()}
        </h1>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden lg:block w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search candidates, jobs..." 
            className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 rounded-xl pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 text-slate-700 dark:text-slate-200 transition-colors"
          />
        </div>

        {/* Portal Switcher Button */}
        <button
          onClick={() => setPortal(portal === 'admin' ? 'user' : 'admin')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold bg-white dark:bg-slate-800 shadow-sm cursor-pointer hover:border-brand-500 text-slate-700 dark:text-slate-200 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Switch to {portal === 'admin' ? 'User' : 'Admin'}</span>
        </button>

        {/* Theme Accent Color Swatch Trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowColorMenu(!showColorMenu);
              setShowNotifMenu(false);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 cursor-pointer transition-colors shadow-sm flex items-center gap-1"
            title="Choose Accent Palette"
          >
            <Palette className="w-4.5 h-4.5" />
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showColorMenu && (
            <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2.5 z-50 animate-slide-in">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 px-2.5 pb-2 uppercase tracking-wide">
                Accent Theme
              </p>
              <div className="space-y-1">
                {colorsList.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setThemeColor(c.value);
                      setShowColorMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition-colors
                      ${themeColor === c.value ? 'text-brand-600 dark:text-brand-400 bg-brand-500/5' : 'text-slate-600 dark:text-slate-300'}
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${c.class} shadow-sm border border-black/10`} />
                      <span>{c.name}</span>
                    </div>
                    {themeColor === c.value && <Check className="w-3.5 h-3.5 text-brand-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 cursor-pointer transition-colors shadow-sm"
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowColorMenu(false);
              if (!showNotifMenu) {
                markNotificationsAsRead();
              }
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 cursor-pointer transition-colors relative shadow-sm"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50 animate-slide-in">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Notifications
                </span>
                <button 
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-brand-500 hover:underline"
                >
                  Close
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex gap-3
                        ${!notif.read ? 'bg-brand-500/5' : ''}
                      `}
                    >
                      <div className="mt-0.5">
                        <span className={`w-2 h-2 rounded-full block
                          ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-brand-500'}
                        `} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};
