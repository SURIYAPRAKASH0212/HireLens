import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Key, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function UserPassword() {
  const { isDark } = useTheme();
  
  const [form, setForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setForm({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Change Password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure account access credentials</p>
      </div>

      <div className={`p-6 rounded-card border transition-all duration-300 user-glow
        ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Current Password */}
          <div>
            <label className="block mb-1 text-gray-500">Current Password</label>
            <div className="relative flex items-center">
              <input 
                type={showCurrent ? 'text' : 'password'} 
                value={form.current}
                onChange={(e) => setForm({...form, current: e.target.value})}
                className="w-full p-2.5 pr-10 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 text-gray-500">New Password</label>
            <div className="relative flex items-center">
              <input 
                type={showNew ? 'text' : 'password'} 
                value={form.newPass}
                onChange={(e) => setForm({...form, newPass: e.target.value})}
                className="w-full p-2.5 pr-10 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-gray-500">Confirm New Password</label>
            <input 
              type="password" 
              value={form.confirm}
              onChange={(e) => setForm({...form, confirm: e.target.value})}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all duration-200 hover:scale-102"
            >
              <Key className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
