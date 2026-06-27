import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Portal selector: 'admin' or 'user'
  const [portal, setPortal] = useState('admin');

  // Backend Synchronized States
  const [adminResults, setAdminResults] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Checklist for Improve Your Chances Card (Calculated Locally)
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Add more relevant skills', points: 10, checked: false },
    { id: 2, text: 'Include more experience details', points: 15, checked: false },
    { id: 3, text: 'Use keywords from job description', points: 20, checked: false }
  ]);

  // Calculated User Profile Score (base is 0%, capped at 100%)
  const profileScore = useMemo(() => {
    const base = 0;
    const added = checklist.reduce((acc, item) => acc + (item.checked ? item.points : 0), 0);
    return Math.min(base + added, 100);
  }, [checklist]);

  // User Authentication State
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  // Toggle checklist item (local)
  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Load portal data from backend
  const loadData = async () => {
    try {
      const candidatesRes = await fetch('/api/candidates');
      if (candidatesRes.ok) {
        const data = await candidatesRes.json();
        setAdminResults(data);
      }

      const appsRes = await fetch('/api/applications');
      if (appsRes.ok) {
        const data = await appsRes.json();
        setUserApplications(data);
      }

      const notifsRes = await fetch('/api/notifications');
      if (notifsRes.ok) {
        const data = await notifsRes.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to load fullstack database records:', err);
    }
  };

  // Poll notifications and database records when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 5000); // Poll every 5s to sync portals
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Login handler contacting Express API
  const login = async (email, password, role) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setPortal(role);
        await loadData();
        return true;
      }
    } catch (err) {
      console.error('Login request failed:', err);
    }
    return false;
  };

  // Register handler contacting Express API
  const register = async (name, email, password, role) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setPortal(role);
        await loadData();
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Connection error.' };
    }
  };

  // Delete Candidate evaluation (contacts Express API)
  const deleteCandidate = async (id) => {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setAdminResults(data.candidates);
        await loadData();
        return true;
      }
    } catch (err) {
      console.error('Failed to delete candidate:', err);
    }
    return false;
  };

  // Update Admin Profile Settings (contacts Express API)
  const updateAdminProfile = async (name, email, password) => {
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, message: data.message || 'Update failed.' };
      }
    } catch (err) {
      console.error('Failed to update admin profile:', err);
      return { success: false, message: 'Connection error.' };
    }
  };

  // Job management handlers (local state)
  const addJob = (job) => {
    setJobs(prev => [job, ...prev]);
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setAdminResults([]);
    setUserApplications([]);
    setNotifications([]);
  };

  // Add custom notification (sends to state, in real-world logged in DB)
  const addNotification = (text, type = 'admin') => {
    // Basic local fallback if server hasn't polled
    setNotifications(prev => [
      { id: Date.now(), text, time: 'Just now', read: false, portal: type },
      ...prev
    ]);
  };

  // Set Recruiter candidate evaluation decision (contacts Express API)
  const updateCandidateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/candidates/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminResults(data.candidates);
        await loadData(); // refresh notifications and applications
      }
    } catch (err) {
      console.error('Failed to update candidate status:', err);
    }
  };

  // Upload Resume handler (contacts Express API)
  const simulateUpload = async (fileName) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName })
      });
      if (res.ok) {
        const data = await res.json();
        setUserApplications(data.applications);
        setAdminResults(data.candidates);
        await loadData();
      }
    } catch (err) {
      console.error('Failed to submit file upload:', err);
    }
  };

  // Clear/Mark read notifications (contacts Express API)
  const setNotificationsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portal })
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to update notification states:', err);
    }
  };

  return (
    <AppContext.Provider value={{
      portal,
      setPortal,
      adminResults,
      setAdminResults: updateCandidateStatus, // map setter to status updater
      deleteCandidate,
      userApplications,
      setUserApplications,
      checklist,
      toggleChecklistItem,
      profileScore,
      notifications,
      setNotifications: setNotificationsRead, // map notifications read-all
      addNotification,
      simulateUpload,
      user,
      isAuthenticated,
      login,
      register,
      updateAdminProfile,
      jobs,
      addJob,
      deleteJob,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
