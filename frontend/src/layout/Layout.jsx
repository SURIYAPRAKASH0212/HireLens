import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { X } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }) {
  const { isDark } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans
      ${isDark ? 'bg-darkBg text-white/90' : 'bg-lightBg text-gray-800'}`}
    >
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Sidebar Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 w-[250px] z-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className={`absolute top-4 right-[-48px] p-2.5 rounded-xl border bg-white dark:bg-darkCard text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

      {/* Main Content Area */}
      <main className="pt-16 lg:pl-[250px] transition-all duration-300 min-h-screen flex flex-col">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
