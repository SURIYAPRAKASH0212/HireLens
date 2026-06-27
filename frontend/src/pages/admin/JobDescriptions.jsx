import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { Briefcase, Plus, Calendar, Trash2 } from 'lucide-react';

export default function JobDescriptions() {
  const { isDark } = useTheme();
  const { jobs, addJob, deleteJob } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', dept: '', skills: '', description: '' });

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.dept) return;
    
    const job = {
      id: Date.now(),
      title: newJob.title,
      dept: newJob.dept,
      applicants: 0,
      status: 'Active',
      skills: newJob.skills ? newJob.skills.split(',').map(s => s.trim()) : [],
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    addJob(job);
    setNewJob({ title: '', dept: '', skills: '', description: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Descriptions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage positions and recruitment profiles</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Create Position</span>
        </button>
      </div>

      {/* Grid of Jobs */}
      {jobs.length === 0 ? (
        <div className={`p-12 text-center rounded-card border transition-all duration-300 admin-glow
          ${isDark ? 'bg-darkCard border-white/5 text-gray-400' : 'bg-white border-gray-100 shadow-sm text-gray-450'}`}
        >
          <p className="font-bold text-sm">No job descriptions added yet.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "Create Position" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-card border transition-all duration-300 admin-glow flex flex-col justify-between
                ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{job.dept}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-500">
                      {job.status}
                    </span>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete Position"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border
                            ${isDark 
                              ? 'bg-white/5 border-white/10 text-gray-300' 
                              : 'bg-slate-50 border-gray-200 text-gray-600'
                            }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No specific technical skills tag required.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4 mt-6 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created {job.date}</span>
                </span>
                <span className="font-semibold text-primary">{job.applicants} applicants</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-lg rounded-card border shadow-2xl p-6 relative z-10
                ${isDark ? 'bg-darkCard border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              <h3 className="text-xl font-bold">Create Position</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Configure parameters for ATS match evaluations</p>

              <form onSubmit={handleAddJob} className="mt-4 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-gray-500">Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Frontend Developer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Engineering"
                    value={newJob.dept}
                    onChange={(e) => setNewJob({...newJob, dept: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Required Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React, Node.js, Typescript, AWS"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Description</label>
                  <textarea 
                    rows="3" 
                    placeholder="Outline job responsibilities..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
