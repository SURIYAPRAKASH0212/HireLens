import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FileText, 
  Users, 
  Briefcase, 
  Award, 
  Bell, 
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function AdminDashboard({ setActiveTab }) {
  const { adminResults, notifications, deleteCandidate, jobs } = useApp();
  const { isDark } = useTheme();

  // Statistics Calculation
  const totalResumes = adminResults.length;
  const totalCandidates = adminResults.length;
  const activeJobs = jobs.length;
  const avgAtsScore = adminResults.length > 0 
    ? parseFloat((adminResults.reduce((acc, c) => acc + c.score, 0) / adminResults.length).toFixed(1))
    : 0;

  // Donut chart configuration
  const groupedJobs = {};
  adminResults.forEach(c => {
    groupedJobs[c.jobTitle] = (groupedJobs[c.jobTitle] || 0) + 1;
  });
  
  const colors = ['#6D4AFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  const donutData = Object.keys(groupedJobs).map((key, idx) => ({
    name: key,
    value: groupedJobs[key],
    color: colors[idx % colors.length]
  }));

  // Bar chart configuration
  const ranges = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
  adminResults.forEach(c => {
    if (c.score <= 20) ranges['0-20']++;
    else if (c.score <= 40) ranges['21-40']++;
    else if (c.score <= 60) ranges['41-60']++;
    else if (c.score <= 80) ranges['61-80']++;
    else ranges['81-100']++;
  });
  const barData = Object.keys(ranges).map(range => ({
    range,
    count: ranges[range],
    fill: '#6D4AFF'
  }));

  // Motion animation parameters
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your recruitment pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`p-2.5 rounded-xl border relative transition-all duration-300 hover:scale-105
            ${isDark 
              ? 'border-white/10 bg-darkCard text-gray-300 hover:text-white' 
              : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Resumes */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-6 rounded-card border transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Resumes</span>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{totalResumes.toLocaleString()}</h3>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this week</span>
            </div>
          </div>
        </motion.div>

        {/* Total Candidates */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-6 rounded-card border transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Candidates</span>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{totalCandidates}</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% this week</span>
            </div>
          </div>
        </motion.div>

        {/* Active Jobs */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-6 rounded-card border transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Jobs</span>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{activeJobs}</h3>
            <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+3 new this week</span>
            </div>
          </div>
        </motion.div>

        {/* Avg ATS Score */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-6 rounded-card border transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. ATS Score</span>
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{avgAtsScore}</h3>
            <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium mt-1">
              <span>Good</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Screening Results Table */}
      <motion.div 
        variants={itemVariants}
        className={`rounded-card border overflow-hidden transition-all duration-300 admin-glow
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-150 shadow-sm'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
          <div>
            <h3 className="font-bold text-lg">Recent Screening Results</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Live status of processed profiles</p>
          </div>
          <button 
            onClick={() => setActiveTab('screening-results')}
            className={`flex items-center gap-1 text-xs font-semibold text-primary hover:underline`}
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">ATS Score</th>
                <th className="px-6 py-4">Job Fit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Screened On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              {adminResults.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <p className="font-semibold text-sm">No screening results yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Upload resumes from Candidate portal to run evaluations.</p>
                  </td>
                </tr>
              ) : (
                adminResults.slice(0, 5).map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${row.avatarColor} font-bold text-xs flex items-center justify-center`}>
                          {row.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{row.jobTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono
                        ${row.score >= 90 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : row.score >= 80 
                            ? 'bg-primary/10 text-primary' 
                            : row.score >= 70 
                              ? 'bg-orange-500/10 text-orange-500' 
                              : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {row.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold w-8">{row.jobFit}%</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              row.status === 'Shortlisted' ? 'bg-emerald-500' :
                              row.status === 'Review' ? 'bg-primary' :
                              row.status === 'In Review' ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${row.jobFit}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide
                        ${row.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          row.status === 'Review' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          row.status === 'In Review' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                          'bg-red-500/10 text-red-600 dark:text-red-400'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {row.screenedOn}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCandidate(row.id);
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete Candidate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Section: Donut + Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart */}
        <motion.div 
          variants={itemVariants}
          className={`p-6 rounded-card border lg:col-span-5 flex flex-col justify-between transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div>
            <h3 className="font-bold text-lg">Applications by Job</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Distribution across key fields</p>
          </div>

          <div className="relative h-64 my-4 flex items-center justify-center">
            {/* Center Label inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold">{totalResumes}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legends */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {donutData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium truncate text-gray-700 dark:text-gray-300">{item.name}</span>
                <span className="font-bold text-gray-500 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div 
          variants={itemVariants}
          className={`p-6 rounded-card border lg:col-span-7 flex flex-col transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div>
            <h3 className="font-bold text-lg">ATS Score Distribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Resume evaluation profile score clusters</p>
          </div>

          <div className="h-64 mt-6 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D4AFF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6D4AFF" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="range" 
                  stroke={isDark ? '#4B5563' : '#9CA3AF'} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={isDark ? '#4B5563' : '#9CA3AF'} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                    borderRadius: '12px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#purpleGradient)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
