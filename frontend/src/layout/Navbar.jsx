import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  const { portal, notifications, setNotifications, logout, user } = useApp();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAdmin = portal === 'admin';
  
  // Filter notifications by portal context
  const filteredNotifications = notifications.filter(n => n.portal === portal);
  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => n.portal === portal ? { ...n, read: true } : n));
  };

  return (
    <header className={`h-16 fixed top-0 right-0 left-0 lg:left-[250px] z-20 flex items-center justify-between px-6 border-b transition-all duration-300
      ${isDark 
        ? 'bg-darkBg/80 border-white/5 text-white' 
        : 'bg-slate-50/80 border-gray-200 text-gray-800'
      } backdrop-blur-md`}
    >
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-xl border transition-all
            ${isDark 
              ? 'border-white/10 hover:bg-white/5 text-gray-400 hover:text-white' 
              : 'border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-primary animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {isAdmin ? 'System Active' : 'User Session'}
          </span>
        </div>
      </div>

      {/* Top Navbar Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105
            ${isDark 
              ? 'border-white/10 hover:bg-white/5 text-yellow-400' 
              : 'border-gray-200 hover:bg-gray-100 text-primary'
            }`}
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-2.5 rounded-xl border transition-all duration-200 hover:scale-105
              ${isDark 
                ? 'border-white/10 hover:bg-white/5 text-gray-300 hover:text-white' 
                : 'border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-[9px] text-white font-bold flex items-center justify-center rounded-full px-1 border-2 border-white dark:border-darkBg">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-3 w-80 rounded-2xl border shadow-xl p-2 transition-all duration-200 overflow-hidden
              ${isDark 
                ? 'bg-darkCard border-white/10 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between p-3 border-b border-inherit">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-gray-400" />
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className={`text-xs font-semibold hover:underline ${isAdmin ? 'text-primary' : 'text-emerald-500'}`}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-xs border-b border-gray-100 dark:border-white/5 last:border-none
                        ${!notif.read ? 'bg-primary/5 dark:bg-primary/5' : ''}`}
                    >
                      <p className="font-medium text-gray-800 dark:text-gray-200">{notif.text}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Portal Profile Dropdown */}
        {!isAdmin && (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 hover:scale-102
                ${isDark 
                  ? 'border-white/10 hover:bg-white/5 text-white' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                }`}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                {(user?.name || 'User')[0].toUpperCase()}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{user?.name || 'User'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-3 w-48 rounded-2xl border shadow-xl p-1.5 transition-all duration-200
                ${isDark 
                  ? 'bg-darkCard border-white/10 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div className="px-3 py-2 border-b border-inherit">
                  <p className="text-xs font-semibold">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email || 'user@hirelens.com'}</p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-white/5 text-left text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-white/5 text-left text-gray-600 dark:text-gray-300">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-red-500/10 hover:text-red-500 text-left text-red-500/80"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
