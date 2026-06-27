import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Shield, Mail, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const { isDark } = useTheme();
  
  const [team, setTeam] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Technical Recruiter' });

  const avatarColors = [
    'bg-primary/10 text-primary',
    'bg-emerald-500/10 text-emerald-500',
    'bg-amber-500/10 text-amber-500',
    'bg-blue-500/10 text-blue-500',
    'bg-purple-500/10 text-purple-500'
  ];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const member = {
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: 'Active',
      color: randomColor
    };

    setTeam(prev => [...prev, member]);
    setNewMember({ name: '', email: '', role: 'Technical Recruiter' });
    setShowModal(false);
  };

  const handleRemoveMember = (email) => {
    setTeam(prev => prev.filter(u => u.email !== email));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recruiting Team</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage team members, permissions, and session activity</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className={`rounded-card border overflow-hidden transition-all duration-300 admin-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-semibold">
              {team.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <p className="font-semibold text-sm">No recruiting team members added yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Team Member" to build your recruiting squad.</p>
                  </td>
                </tr>
              ) : (
                team.map((u, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${u.color} font-bold text-xs flex items-center justify-center`}>
                          {u.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-gray-400 font-normal flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{u.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{u.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide
                        ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-400/20 text-gray-400'}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Full Access</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRemoveMember(u.email)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Remove Member"
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
      </div>

      {/* Add Team Member Modal */}
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
              className={`w-full max-w-md rounded-card border shadow-2xl p-6 relative z-10
                ${isDark ? 'bg-darkCard border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            >
              <h3 className="text-xl font-bold">Add Team Member</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add a new recruiter or manager to your team</p>

              <form onSubmit={handleAddMember} className="mt-4 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-gray-500">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah Connor"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. sarah.c@hirelens.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Role</label>
                  <select 
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option value="Lead Recruiter">Lead Recruiter</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Technical Recruiter">Technical Recruiter</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
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
                    Add Member
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
