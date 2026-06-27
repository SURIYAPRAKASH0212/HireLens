import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Award, Check, X, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScreeningResults() {
  const { adminResults, setAdminResults } = useApp();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredResults = adminResults.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setAdminResults(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Screening Results</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review ATS matching scores and update applicant hire status</p>
      </div>

      {/* Filters and search */}
      <div className={`p-4 rounded-card border flex flex-col md:flex-row gap-4 justify-between items-center transition-all duration-300 admin-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <div className="relative w-full md:max-w-xs flex items-center">
          <Search className="w-4.5 h-4.5 absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search candidate results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-white/10 dark:bg-darkBg rounded-xl text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto text-xs">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-200 dark:border-white/10 dark:bg-darkBg rounded-xl font-semibold text-gray-500 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Review">Review</option>
            <option value="In Review">In Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className={`rounded-card border overflow-hidden transition-all duration-300 admin-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">ATS Match</th>
                <th className="px-6 py-4">Job Fit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              {filteredResults.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${c.avatarColor} font-bold text-xs flex items-center justify-center`}>
                        {c.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{c.jobTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono
                      ${c.score >= 90 ? 'bg-emerald-500/10 text-emerald-500' :
                        c.score >= 80 ? 'bg-primary/10 text-primary' :
                        c.score >= 70 ? 'bg-orange-500/10 text-orange-500' :
                        'bg-red-500/10 text-red-500'}`}
                    >
                      {c.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold w-8">{c.jobFit}%</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            c.status === 'Shortlisted' ? 'bg-emerald-500' :
                            c.status === 'Review' ? 'bg-primary' :
                            c.status === 'In Review' ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${c.jobFit}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide
                      ${c.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        c.status === 'Review' ? 'bg-amber-150 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        c.status === 'In Review' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        'bg-red-500/10 text-red-600 dark:text-red-400'}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {c.status !== 'Shortlisted' && (
                      <button 
                        onClick={() => handleUpdateStatus(c.id, 'Shortlisted')}
                        className="p-1 rounded-lg border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 transition-all"
                        title="Shortlist Candidate"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {c.status !== 'Rejected' && (
                      <button 
                        onClick={() => handleUpdateStatus(c.id, 'Rejected')}
                        className="p-1 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all"
                        title="Reject Candidate"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
