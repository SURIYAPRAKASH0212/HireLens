import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reports() {
  const { isDark } = useTheme();
  const { adminResults } = useApp();

  const totalCandidates = adminResults.length;
  const shortlistedCandidates = adminResults.filter(c => c.status === 'Shortlisted').length;
  const passRate = totalCandidates > 0 ? ((shortlistedCandidates / totalCandidates) * 100).toFixed(1) + '%' : '0.0%';
  
  // Calculate average ATS score
  const avgAtsScore = totalCandidates > 0
    ? (adminResults.reduce((acc, c) => acc + c.score, 0) / totalCandidates).toFixed(1)
    : '0.0';

  // Group screening data by date for chart
  const groupedDates = {};
  adminResults.forEach(c => {
    const dateKey = c.screenedOn || 'Today';
    if (!groupedDates[dateKey]) {
      groupedDates[dateKey] = { date: dateKey, resumes: 0, shortlisted: 0 };
    }
    groupedDates[dateKey].resumes++;
    if (c.status === 'Shortlisted') {
      groupedDates[dateKey].shortlisted++;
    }
  });

  // Convert to array and reverse to display chronological order
  const reportData = Object.values(groupedDates).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recruitment analytics and screening conversion funnels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pass Rate */}
        <div className={`p-6 rounded-card border transition-all duration-300 admin-glow
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Screening Pass Rate</span>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{passRate}</h3>
            {totalCandidates > 0 && (
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>Live</span>
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Percentage of candidates matching basic filter criteria</p>
        </div>

        {/* Avg Time-To-Screen */}
        <div className={`p-6 rounded-card border transition-all duration-300 admin-glow
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Candidate ATS Score</span>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{avgAtsScore}</h3>
            <span className="text-xs font-semibold text-emerald-500">{totalCandidates > 0 ? 'Normal' : 'No Data'}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Average ATS score calculated across all evaluated profiles</p>
        </div>

        {/* Total Screened */}
        <div className={`p-6 rounded-card border transition-all duration-300 admin-glow
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Evaluated Profiles</span>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{totalCandidates}</h3>
            <span className="text-xs font-semibold text-emerald-500">Profiles</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Total amount of resume files parsed by the database</p>
        </div>
      </div>

      {/* Funnel Graph */}
      <div className={`p-6 rounded-card border transition-all duration-300 admin-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Acquisition Analytics
        </h3>
        <p className="text-xs text-gray-500 mb-6">Total resumes uploaded vs. shortlisted candidates grouped by screening date.</p>

        {reportData.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <p className="font-semibold text-sm">No analytics data available yet.</p>
            <p className="text-xs text-gray-400 mt-1 font-normal">Go to the Candidate portal, upload resume files, and run screenings to populate charts.</p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="resumesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D4AFF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6D4AFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="shortlistedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke={isDark ? '#4B5563' : '#9CA3AF'} fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke={isDark ? '#4B5563' : '#9CA3AF'} fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                    borderRadius: '12px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="resumes" stroke="#6D4AFF" fillOpacity={1} fill="url(#resumesGradient)" strokeWidth={2} name="Resumes Evaluated" />
                <Area type="monotone" dataKey="shortlisted" stroke="#10B981" fillOpacity={1} fill="url(#shortlistedGradient)" strokeWidth={2} name="Shortlisted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
