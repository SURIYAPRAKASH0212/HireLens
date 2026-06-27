import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './layout/Layout';
import Login from './pages/Login';

// Admin Subpages
import AdminDashboard from './pages/admin/Dashboard';
import JobDescriptions from './pages/admin/JobDescriptions';
import Candidates from './pages/admin/Candidates';
import ScreeningResults from './pages/admin/ScreeningResults';
import AdminUsers from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// User Subpages
import UserDashboard from './pages/user/Dashboard';
import UserApplications from './pages/user/Applications';
import UserProfile from './pages/user/Profile';
import UserPassword from './pages/user/Password';

function AppContent() {
  const { portal, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Reset tab to dashboard when portal changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [portal]);

  if (!isAuthenticated) {
    return <Login />;
  }

  // Determine current page to render
  const renderContent = () => {
    if (portal === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard setActiveTab={setActiveTab} />;
        case 'job-descriptions':
          return <JobDescriptions />;
        case 'resumes':
        case 'screening-results':
          return <ScreeningResults />;
        case 'candidates':
          return <Candidates />;
        case 'users':
          return <AdminUsers />;
        case 'reports':
          return <Reports />;
        case 'settings':
          return <AdminSettings />;
        default:
          return <AdminDashboard setActiveTab={setActiveTab} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
        case 'upload':
          return <UserDashboard setActiveTab={setActiveTab} />;
        case 'applications':
          return <UserApplications />;
        case 'profile':
          return <UserProfile />;
        case 'password':
          return <UserPassword />;
        default:
          return <UserDashboard setActiveTab={setActiveTab} />;
      }
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
