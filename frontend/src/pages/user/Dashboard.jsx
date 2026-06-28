import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Briefcase, 
  Award, 
  UserCheck, 
  Calendar,
  CloudUpload,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Info,
  Loader2,
  FileCheck
} from 'lucide-react';

export default function UserDashboard({ setActiveTab }) {
  const { 
    userApplications, 
    checklist, 
    toggleChecklistItem, 
    profileScore, 
    simulateUpload,
    jobs
  } = useApp();
  const { isDark } = useTheme();

  // Upload simulation state
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const fileInputRef = useRef(null);

  // SVG Circular progress configurations
  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (profileScore / 100) * circumference;

  // Custom stats for User Dashboard
  const stats = [
    {
      title: 'Applications Submitted',
      value: userApplications.length,
      change: userApplications.length > 0 ? '+2 this week' : 'No recent activity',
      icon: Briefcase,
      color: 'emerald'
    },
    {
      title: 'Highest Match Score',
      value: userApplications.length > 0 ? `${Math.max(...userApplications.map(a => a.matchScore))}%` : '0%',
      change: userApplications.length > 0 ? 'Based on latest resumes' : 'No applications',
      icon: Award,
      color: 'emerald'
    },
    {
      title: 'Profile Score',
      value: `${profileScore}%`,
      change: profileScore >= 90 ? 'Excellent' : profileScore >= 70 ? 'Good' : 'Needs Setup',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      title: 'Interview Invites',
      value: userApplications.some(a => a.status === 'Shortlisted') ? '1' : '0',
      change: userApplications.some(a => a.status === 'Shortlisted') ? 'Upcoming' : 'No invites',
      icon: Calendar,
      color: 'orange'
    }
  ];

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const processFile = (file) => {
    // Only accept PDF/DOCX
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      alert('Please upload a PDF or DOCX file.');
      return;
    }

    setUploadedFileName(file.name);
    setUploadState('uploading');
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          // Add to global state
          const selectedJob = jobs.find(j => j.id === selectedJobId);
          simulateUpload(
            file.name, 
            selectedJob ? selectedJob.title : 'Cloud Architect', 
            selectedJob ? selectedJob.company : 'HireLens Corp'
          );
          // Reset back to idle after 3 seconds
          setTimeout(() => {
            setUploadState('idle');
            setUploadedFileName('');
            setProgress(0);
          }, 3500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Motion animation presets
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
      <div className="flex flex-col justify-start">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your applications and screening status</p>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-card border transition-all duration-300 user-glow
                ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-3 rounded-2xl ${
                  stat.color === 'emerald' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-orange-500/10 text-orange-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                  {stat.color === 'emerald' && stat.title !== 'Profile Score' && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span className={
                    stat.color === 'emerald' && stat.title !== 'Profile Score' 
                      ? 'text-emerald-500 font-semibold' 
                      : 'text-gray-500 dark:text-gray-400 font-semibold'
                  }>
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Available Jobs / Open Positions */}
      <motion.div variants={itemVariants} className="space-y-4" id="open-positions-section">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Available Jobs</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Explore active roles created by our recruitment team</p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className={`p-8 text-center rounded-card border transition-all duration-300 user-glow
            ${isDark ? 'bg-darkCard border-white/5 text-gray-400' : 'bg-white border-gray-150 shadow-sm text-gray-550'}`}
          >
            <p className="font-bold text-sm">No specific job openings listed yet.</p>
            <p className="text-xs text-gray-400 mt-1">You can still submit your resume as a General Application below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className={`p-5 rounded-card border transition-all duration-300 user-glow flex flex-col justify-between
                  ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
              >
                <div>
                  <h4 className="font-bold text-base">{job.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 flex-wrap">
                    {job.company && <span className="font-bold text-emerald-500">{job.company}</span>}
                    {job.company && <span className="text-gray-305">•</span>}
                    <span>{job.dept}</span>
                  </p>
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border
                            ${isDark 
                              ? 'bg-white/5 border-white/10 text-gray-300' 
                              : 'bg-slate-50 border-gray-200 text-gray-600'
                            }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {job.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs">
                  <span className="inline-flex px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-500">
                    Active
                  </span>
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      document.getElementById('upload-card-container')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Middle Row: Upload + Applications Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Resume Card */}
        <motion.div 
          id="upload-card-container"
          variants={itemVariants}
          className={`p-6 rounded-card border lg:col-span-5 flex flex-col justify-between transition-all duration-300 user-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div>
            <h3 className="font-bold text-lg">Upload Resume</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Upload your latest resume to apply for jobs</p>
            
            {/* Position Selector Dropdown */}
            <div className="mt-3">
              <label className="block mb-1 text-[10px] uppercase tracking-wider text-gray-450 dark:text-gray-500 font-bold">Select target position</label>
              <select
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg text-xs font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="">General Application (Cloud Architect)</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} at {job.company || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`my-6 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] transition-all duration-200 cursor-pointer
              ${dragActive 
                ? 'border-emerald-500 bg-emerald-500/5' 
                : isDark 
                  ? 'border-white/10 hover:border-emerald-500/50 hover:bg-white/1' 
                  : 'border-gray-200 hover:border-emerald-500/50 hover:bg-gray-50'
              }`}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept=".pdf,.docx"
            />

            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center space-y-3"
                >
                  <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                    <CloudUpload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Drag & drop your file here</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOCX (Max 5MB)</p>
                  </div>
                </motion.div>
              )}

              {uploadState === 'uploading' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center w-full space-y-4"
                  onClick={(e) => e.stopPropagation()} // stop click bubbling
                >
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <div className="w-full max-w-[200px]">
                    <p className="text-sm font-semibold truncate px-2">{uploadedFileName}</p>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">{progress}% Uploaded</span>
                  </div>
                </motion.div>
              )}

              {uploadState === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-500">Resume Screened Successfully!</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                      {selectedJobId && jobs.find(j => j.id === selectedJobId) ? jobs.find(j => j.id === selectedJobId).title : 'Cloud Architect'} position added
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={triggerFileInput}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-98"
          >
            Upload Resume
          </button>
        </motion.div>

        {/* My Applications Table */}
        <motion.div 
          variants={itemVariants}
          className={`p-6 rounded-card border lg:col-span-7 flex flex-col justify-between transition-all duration-300 user-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">My Applications</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Track your submitted resume metrics</p>
            </div>
            <button 
              onClick={() => setActiveTab('applications')}
              className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto my-4 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3">Job Title</th>
                  <th className="py-3">Applied On</th>
                  <th className="py-3">Match Score</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs font-medium">
                {userApplications.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-gray-900 dark:text-white">{row.jobTitle}</div>
                      {row.companyName && (
                        <div className="text-[10px] font-bold text-emerald-500 mt-0.5">{row.companyName}</div>
                      )}
                    </td>
                    <td className="py-3.5 text-gray-500 dark:text-gray-400">{row.appliedOn}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold font-mono text-[11px]
                        ${row.matchScore >= 90 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : row.matchScore >= 80 
                            ? 'bg-primary/10 text-primary' 
                            : row.matchScore >= 70 
                              ? 'bg-orange-500/10 text-orange-500' 
                              : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {row.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide
                        ${row.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          row.status === 'Review' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          row.status === 'In Review' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                          'bg-red-500/10 text-red-600 dark:text-red-400'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Checklist + circular progress ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Improve Your Chances Checklist */}
        <motion.div 
          variants={itemVariants}
          className={`p-6 rounded-card border lg:col-span-7 flex flex-col justify-between transition-all duration-300 user-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div>
            <h3 className="font-bold text-lg">Improve Your Chances</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete recommendations to boost your match score</p>
          </div>

          <div className="my-6 space-y-3.5">
            {checklist.map((item) => (
              <label 
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200
                  ${item.checked 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : isDark 
                      ? 'border-white/5 bg-white/2 hover:bg-white/5 text-gray-300' 
                      : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-white/10 dark:bg-darkCard cursor-pointer"
                  />
                  <span className="text-xs font-semibold">{item.text}</span>
                </div>
                <span className="text-xs font-bold text-emerald-500">+{item.points}%</span>
              </label>
            ))}
          </div>

          <button 
            onClick={() => alert('View Suggestions Modal')}
            className={`w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 text-emerald-500 font-semibold text-xs bg-emerald-500/5 hover:bg-emerald-500/10 transition-all hover:scale-102 active:scale-98`}
          >
            View Suggestions
          </button>
        </motion.div>

        {/* Circular Progress Ring */}
        <motion.div 
          variants={itemVariants}
          className={`p-6 rounded-card border lg:col-span-5 flex flex-col justify-between items-center text-center transition-all duration-300 user-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="w-full text-left">
            <h3 className="font-bold text-lg">Your Profile Score</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Overall rating of your credentials</p>
          </div>

          <div className="relative my-8 flex items-center justify-center">
            {/* SVG circle */}
            <svg 
              height={radius * 2} 
              width={radius * 2} 
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                stroke={isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress circle */}
              <motion.circle
                stroke="#10B981"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold">{profileScore}%</span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">
                {profileScore >= 90 ? 'Excellent' : profileScore >= 70 ? 'Good' : profileScore >= 40 ? 'Needs Work' : 'Needs Setup'}
              </span>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 pb-2">
            Keep improving your profile
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
