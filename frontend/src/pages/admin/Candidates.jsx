import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Filter, Mail, Phone, Calendar, Star, StarOff, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Candidates() {
  const { adminResults } = useApp();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('All');

  // Star candidates state
  const [starred, setStarred] = useState([1, 2]);

  const toggleStar = (id) => {
    setStarred(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredCandidates = adminResults.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'All' || c.jobTitle === selectedJob;
    return matchesSearch && matchesJob;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Candidates</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review applicant database records, contact details, and scores</p>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-card border flex flex-col md:flex-row gap-4 justify-between items-center transition-all duration-300 admin-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <div className="relative w-full md:max-w-xs flex items-center">
          <Search className="w-4.5 h-4.5 absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 dark:bg-darkBg rounded-xl text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto text-xs">
          <select 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
            className="p-2 border border-gray-200 dark:border-white/10 dark:bg-darkBg rounded-xl font-semibold text-gray-500 outline-none cursor-pointer"
          >
            <option value="All">All Positions</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="ML Engineer">ML Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Cloud Architect">Cloud Architect</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map((c) => {
          const isStarred = starred.includes(c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-card border transition-all duration-300 admin-glow flex flex-col justify-between
                ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-150 shadow-sm'}`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${c.avatarColor} font-bold text-sm flex items-center justify-center`}>
                      {c.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{c.name}</h3>
                      <p className="text-[11px] text-gray-400">{c.jobTitle}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleStar(c.id)}
                    className="p-1.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-yellow-500"
                  >
                    {isStarred ? <Star className="w-4 h-4 fill-yellow-500" /> : <StarOff className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{c.name.toLowerCase().replace(' ', '')}@hirelens.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>+1 (555) 019-2834</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Applied {c.screenedOn}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide
                  ${c.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-500' :
                    c.status === 'Review' ? 'bg-amber-500/10 text-amber-500' :
                    c.status === 'In Review' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'}`}
                >
                  {c.status}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">ATS Score:</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg
                    ${c.score >= 90 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : c.score >= 80 
                        ? 'bg-primary/10 text-primary' 
                        : c.score >= 70 
                          ? 'bg-orange-500/10 text-orange-500' 
                          : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {c.score}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
