import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { User, Mail, Phone, MapPin, Briefcase, Plus, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const { isDark } = useTheme();
  const { user } = useApp();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    title: '',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  const addSkill = (e) => {
    e.preventDefault();
    if (!skillInput) return;
    if (!profile.skills.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput.trim()]
      });
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill)
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-sans">Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your professional bio and technical credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Info card */}
        <div className={`p-6 rounded-card border lg:col-span-8 transition-all duration-300 user-glow
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            General Information
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-500">Target Role</label>
                <input 
                  type="text" 
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-500">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-500">Phone Number</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all duration-200 hover:scale-102"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Skills Selector */}
        <div className={`p-6 rounded-card border lg:col-span-4 transition-all duration-300 user-glow flex flex-col justify-between
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              Primary Skills
            </h3>
            <p className="text-xs text-gray-500 mb-4">Add skills to help matching engines align your profile with active positions.</p>

            <form onSubmit={addSkill} className="flex gap-2">
              <input 
                type="text"
                placeholder="e.g. Docker"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-darkBg text-xs outline-none focus:border-emerald-500"
              />
              <button 
                type="submit"
                className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-5">
              {profile.skills.map((skill) => (
                <span 
                  key={skill}
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.75 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                >
                  <span>{skill}</span>
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="hover:text-emerald-700 dark:hover:text-emerald-300 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
