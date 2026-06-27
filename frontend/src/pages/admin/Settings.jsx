import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { Save, Sliders, Shield, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const { isDark } = useTheme();
  const { user, updateAdminProfile } = useApp();
  
  // Weights state
  const [weights, setWeights] = useState({
    skills: 45,
    experience: 35,
    keywords: 20
  });

  const [toggles, setToggles] = useState({
    autoScreen: true,
    emailAlerts: false,
    strictFit: true
  });

  // Admin profile state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleWeightChange = (key, val) => {
    const numeric = Math.min(Math.max(parseInt(val) || 0, 0), 100);
    setWeights(prev => ({
      ...prev,
      [key]: numeric
    }));
  };

  const handleSaveWeights = () => {
    alert('System weights successfully updated!');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName || !profileEmail) {
      setProfileError('Name and email are required.');
      return;
    }
    setProfileError('');
    setProfileSuccess('');
    setIsSavingProfile(true);

    try {
      const res = await updateAdminProfile(profileName, profileEmail, profilePassword || null);
      if (res.success) {
        setProfileSuccess('Profile details successfully updated!');
        setProfilePassword('');
      } else {
        setProfileError(res.message);
      }
    } catch (err) {
      setProfileError('Failed to connect to database.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure recruiter screening settings, ATS weights, and admin profiles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ATS Evaluation Config */}
        <div className={`p-6 rounded-card border lg:col-span-7 space-y-6 flex flex-col justify-between transition-all duration-300 admin-glow
          ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              ATS Weight Calculator
            </h3>
            <p className="text-xs text-gray-500">Tune the scoring engine parameters. The sum of all weights should equal 100%.</p>

            <div className="space-y-4 text-xs font-semibold">
              {/* Skills */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Skills Match Weight</span>
                  <span className="text-primary font-bold">{weights.skills}%</span>
                </div>
                <input 
                  type="range" 
                  value={weights.skills}
                  onChange={(e) => handleWeightChange('skills', e.target.value)}
                  className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Experience Alignment Weight</span>
                  <span className="text-primary font-bold">{weights.experience}%</span>
                </div>
                <input 
                  type="range" 
                  value={weights.experience}
                  onChange={(e) => handleWeightChange('experience', e.target.value)}
                  className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Keyword Density Weight</span>
                  <span className="text-primary font-bold">{weights.keywords}%</span>
                </div>
                <input 
                  type="range" 
                  value={weights.keywords}
                  onChange={(e) => handleWeightChange('keywords', e.target.value)}
                  className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Total Indicator */}
              <div className={`p-4 rounded-xl flex items-center justify-between border
                ${(weights.skills + weights.experience + weights.keywords) === 100 
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' 
                  : 'border-red-500/20 bg-red-500/5 text-red-500'
                }`}
              >
                <span className="text-xs">Aggregate Evaluator Sum:</span>
                <span className="font-bold text-sm">{weights.skills + weights.experience + weights.keywords}%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 dark:border-white/5 mt-6">
            <button 
              onClick={handleSaveWeights}
              disabled={(weights.skills + weights.experience + weights.keywords) !== 100}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save System Weights</span>
            </button>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Global Features Config */}
          <div className={`p-6 rounded-card border space-y-6 transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              System Behaviors
            </h3>

            <div className="space-y-4 text-xs">
              {/* Auto Screen */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">AI Auto-Screening</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Screen resumes instantly on submission</p>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, autoScreen: !toggles.autoScreen})}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-all
                    ${toggles.autoScreen ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-white/10 justify-start'}`}
                >
                  <span className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                </button>
              </div>

              {/* Email Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Email Invites</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Notify candidates of updates automatically</p>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, emailAlerts: !toggles.emailAlerts})}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-all
                    ${toggles.emailAlerts ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-white/10 justify-start'}`}
                >
                  <span className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                </button>
              </div>

              {/* Strict match */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Strict Match Filtering</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Hide scores lower than 50% in results list</p>
                </div>
                <button 
                  onClick={() => setToggles({...toggles, strictFit: !toggles.strictFit})}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-all
                    ${toggles.strictFit ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-white/10 justify-start'}`}
                >
                  <span className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Admin Profile Config */}
          <div className={`p-6 rounded-card border space-y-6 transition-all duration-300 admin-glow
            ${isDark ? 'bg-darkCard border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <h3 className="font-bold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Recruiter Profile Details
            </h3>
            <p className="text-xs text-gray-500">Update your name, email, and password in the database.</p>

            <AnimatePresence mode="wait">
              {profileError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{profileError}</span>
                </motion.div>
              )}
              {profileSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{profileSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-500">Email Address</label>
                <input 
                  type="email" 
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-500">New Password</label>
                <input 
                  type="password" 
                  placeholder="•••••••• (Leave blank to keep current)"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-darkBg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
