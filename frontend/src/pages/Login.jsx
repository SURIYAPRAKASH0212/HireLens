import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, Sun, Moon, User } from 'lucide-react';

export default function Login() {
  const { login, register } = useApp();
  const { isDark, toggleTheme } = useTheme();

  // Role toggle: 'admin' or 'user' (used primarily for sign-up role choice)
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isRoleAdmin = role === 'admin';

  // Toggle role selection
  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !name) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const res = await register(name, email, password, role);
        if (!res.success) {
          setError(res.message);
        }
      } else {
        const success = await login(email, password, role);
        if (!success) {
          setError('Invalid email or password for the selected portal.');
        }
      }
    } catch (err) {
      setError('Connection failure. Ensure backend and database are online.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden font-sans transition-colors duration-500
      ${isDark ? 'bg-darkBg text-white' : 'bg-slate-50 text-gray-800'}`}
    >
      {/* Dynamic Background Glow Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] left-[5%] w-[450px] h-[450px] rounded-full blur-[100px] opacity-10 transition-colors duration-500
            ${isRoleAdmin ? 'bg-primary' : 'bg-emerald-500'}`}
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[-15%] right-[5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 transition-colors duration-500
            ${isRoleAdmin ? 'bg-purple-600' : 'bg-teal-500'}`}
        />
      </div>

      {/* Floating Theme Switcher */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-2xl border transition-all duration-300 hover:scale-110 z-10
          ${isDark 
            ? 'border-white/10 bg-darkCard text-yellow-400 hover:bg-white/5' 
            : 'border-gray-200 bg-white text-primary hover:bg-gray-50 shadow-sm'
          }`}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Glassmorphic Login Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className={`w-full max-w-[430px] rounded-card border p-8 glass-panel relative z-10 shadow-2xl transition-all duration-300
          ${isDark 
            ? 'bg-darkCard/75 border-white/5 shadow-black/40 text-white/90' 
            : 'bg-white/70 border-gray-200 shadow-slate-200 text-gray-800'
          }`}
      >
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5">
            <span className="text-3xl">🔍</span>
            <h1 className="text-2xl font-extrabold tracking-tight">HireLens</h1>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">AI-Powered Resume Evaluator & Screener</p>
        </div>

        {/* Portal Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-darkBg/60 border border-gray-200/40 dark:border-white/5 my-7 text-xs font-bold relative">
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`py-2.5 rounded-lg text-center transition-all duration-300 z-10
              ${isRoleAdmin 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
          >
            Recruiter Portal
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('user')}
            className={`py-2.5 rounded-lg text-center transition-all duration-300 z-10
              ${!isRoleAdmin 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
          >
            Candidate Portal
          </button>
          {/* Sliding background highlight */}
          <motion.div
            layoutId="activeRoleBg"
            className={`absolute top-1 bottom-1 rounded-lg w-[calc(50%-4px)] z-0
              ${isRoleAdmin ? 'bg-primary left-1 shadow-md shadow-primary/20' : 'bg-emerald-500 right-1 shadow-md shadow-emerald-500/20'}`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Full Name input for Sign Up */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-gray-500 dark:text-gray-400">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4.5 h-4.5 absolute left-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-darkBg outline-none transition-all
                    ${isDark ? 'border-white/10' : 'border-gray-200'}
                    ${isRoleAdmin 
                      ? 'focus:border-primary focus:ring-1 focus:ring-primary' 
                      : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  required
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-gray-500 dark:text-gray-400">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 text-gray-400" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-darkBg outline-none transition-all
                  ${isDark ? 'border-white/10' : 'border-gray-200'}
                  ${isRoleAdmin 
                    ? 'focus:border-primary focus:ring-1 focus:ring-primary' 
                    : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-gray-500 dark:text-gray-400">Password</label>
              <a href="#forgot" className={`hover:underline font-bold ${isRoleAdmin ? 'text-primary' : 'text-emerald-500'}`}>
                Forgot?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border dark:bg-darkBg outline-none transition-all
                  ${isDark ? 'border-white/10' : 'border-gray-200'}
                  ${isRoleAdmin 
                    ? 'focus:border-primary focus:ring-1 focus:ring-primary' 
                    : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  }`}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
              ${isRoleAdmin 
                ? 'bg-primary hover:bg-primary/95 shadow-primary/10 hover:shadow-primary/20' 
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10 hover:shadow-emerald-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{isSignUp ? `Sign Up as ${isRoleAdmin ? 'Recruiter' : 'Candidate'}` : `Log In to ${isRoleAdmin ? 'Recruiter' : 'Candidate'} Account`}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info / Toggle Sign Up & Log In */}
        <div className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-6 font-semibold">
          <span>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
          <button
            type="button"
            onClick={toggleMode}
            className={`hover:underline font-bold ${isRoleAdmin ? 'text-primary' : 'text-emerald-500'}`}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
