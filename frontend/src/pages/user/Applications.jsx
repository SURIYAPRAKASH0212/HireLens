import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserApplications() {
  const { userApplications } = useApp();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = userApplications.filter(app => 
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor the live status and analytics of your submissions</p>
      </div>

      {/* Search and filters */}
      <div className={`p-4 rounded-card border flex gap-4 justify-between items-center transition-all duration-300 user-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <div className="relative w-full md:max-w-xs flex items-center">
          <Search className="w-4.5 h-4.5 absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 dark:bg-darkBg rounded-xl text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Grid view of active jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-card border transition-all duration-300 user-glow flex flex-col justify-between
              ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{app.jobTitle}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Applied on {app.appliedOn}</p>
                </div>
              </div>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                ${app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  app.status === 'Review' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                  app.status === 'In Review' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                  'bg-red-500/10 text-red-600 dark:text-red-400'}`}
              >
                {app.status}
              </span>
            </div>

            <div className="border-t border-gray-100 dark:border-white/5 pt-4 mt-6 flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-500">Resume Match Fit:</span>
              <span className={`px-2 py-0.5 rounded-lg font-bold font-mono text-sm
                ${app.matchScore >= 90 ? 'bg-emerald-500/10 text-emerald-500' :
                  app.matchScore >= 80 ? 'bg-primary/10 text-primary' :
                  app.matchScore >= 70 ? 'bg-orange-500/10 text-orange-500' :
                  'bg-red-500/10 text-red-500'}`}
              >
                {app.matchScore}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
