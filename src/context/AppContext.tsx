import React, { createContext, useContext, useState, useEffect } from 'react';

export type PortalType = 'admin' | 'user';
export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'emerald-teal' | 'blue-purple' | 'orange-amber' | 'rose-pink' | 'navy-cyan';

export type Candidate = {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  atsScore: number;
  jobFit: string; // e.g. "Excellent", "Good", "Fair", "Poor"
  status: 'Shortlisted' | 'In Review' | 'Rejected';
  screenedDate: string;
  jobId: string;
  resumeUrl?: string;
};

export type JobDescription = {
  id: string;
  title: string;
  department: string;
  openings: number;
  status: 'Active' | 'Closed';
  dateCreated: string;
  description: string;
  requiredSkills: string[];
};

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Recruiter' | 'Viewer';
  status: 'Active' | 'Inactive';
  avatar: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
  summary: string;
  skills: string[];
  experience: string;
  education: string;
};

interface AppContextProps {
  portal: PortalType;
  adminPage: string;
  userPage: string;
  theme: ThemeMode;
  themeColor: ThemeColor;
  notifications: Notification[];
  jobs: JobDescription[];
  candidates: Candidate[];
  users: PlatformUser[];
  userProfile: UserProfile;
  suggestions: string[];
  
  setPortal: (portal: PortalType) => void;
  setAdminPage: (page: string) => void;
  setUserPage: (page: string) => void;
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning') => void;
  
  // Actions
  uploadResume: (fileName: string, fileSize: string, targetJobId?: string) => Promise<void>;
  createJob: (job: Omit<JobDescription, 'id' | 'dateCreated'>) => void;
  updateCandidateStatus: (id: string, status: Candidate['status']) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  deleteResume: (id: string) => void;
  deleteJob: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial Mock Data
const initialJobs: JobDescription[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    openings: 3,
    status: 'Active',
    dateCreated: '2026-06-01',
    description: 'We are looking for a Senior Frontend Engineer with extensive experience in React, TypeScript, and Tailwind CSS. Experience in building high-fidelity dashboards and animations is highly desired.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Webpack', 'State Management']
  },
  {
    id: 'job-2',
    title: 'Machine Learning Engineer (NLP)',
    department: 'AI & Data Science',
    openings: 2,
    status: 'Active',
    dateCreated: '2026-05-18',
    description: 'Seeking an ML Engineer specialized in Natural Language Processing, Large Language Models (LLMs), and RAG frameworks. You will lead the development of our resume parser and ranking agent.',
    requiredSkills: ['Python', 'PyTorch', 'Transformers', 'LLMs', 'Vector Databases', 'NLP']
  },
  {
    id: 'job-3',
    title: 'Product Designer',
    department: 'Design',
    openings: 1,
    status: 'Active',
    dateCreated: '2026-06-10',
    description: 'Looking for a UI/UX designer with a stunning portfolio showing interactions inspired by Linear and Stripe. You will build user flows and interface specs for our next-gen HR tools.',
    requiredSkills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research']
  },
  {
    id: 'job-4',
    title: 'DevOps & Infrastructure Architect',
    department: 'Operations',
    openings: 1,
    status: 'Closed',
    dateCreated: '2026-04-12',
    description: 'Lead DevOps role to manage AWS cloud architecture, CI/CD pipelines, Docker containerization, and Kubernetes clustering with high reliability.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux']
  }
];

const initialCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    title: 'Senior React Developer',
    email: 'sarah.c@design.io',
    phone: '+1 (555) 019-2834',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST APIs', 'Git'],
    experience: '6 Years',
    atsScore: 94,
    jobFit: 'Excellent',
    status: 'Shortlisted',
    screenedDate: '2026-06-21',
    jobId: 'job-1'
  },
  {
    id: 'cand-2',
    name: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    title: 'NLP Research Engineer',
    email: 'mercer@gentek.org',
    phone: '+1 (555) 014-9988',
    skills: ['Python', 'PyTorch', 'Transformers', 'BERT', 'NLP', 'TensorFlow'],
    experience: '4 Years',
    atsScore: 89,
    jobFit: 'Excellent',
    status: 'Shortlisted',
    screenedDate: '2026-06-22',
    jobId: 'job-2'
  },
  {
    id: 'cand-3',
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    title: 'UI/UX Visual Designer',
    email: 'emily.design@outlook.com',
    phone: '+1 (555) 012-7821',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Illustrator'],
    experience: '5 Years',
    atsScore: 82,
    jobFit: 'Good',
    status: 'In Review',
    screenedDate: '2026-06-20',
    jobId: 'job-3'
  },
  {
    id: 'cand-4',
    name: 'Marcus Aurelius',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    title: 'Infrastructure Specialist',
    email: 'marcus.stoic@rome.edu',
    phone: '+1 (555) 017-4321',
    skills: ['AWS', 'Docker', 'Jenkins', 'Linux', 'Bash'],
    experience: '8 Years',
    atsScore: 78,
    jobFit: 'Good',
    status: 'In Review',
    screenedDate: '2026-06-19',
    jobId: 'job-4'
  },
  {
    id: 'cand-5',
    name: 'David Lightman',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    title: 'Junior Frontend Intern',
    email: 'wargames@norad.mil',
    phone: '+1 (555) 011-3829',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    experience: '1 Year',
    atsScore: 45,
    jobFit: 'Poor',
    status: 'Rejected',
    screenedDate: '2026-06-18',
    jobId: 'job-1'
  }
];

const initialUsers: PlatformUser[] = [
  {
    id: 'u-1',
    name: 'Jane Doe',
    email: 'jane.doe@hirelens.com',
    role: 'Administrator',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'u-2',
    name: 'Richard Hendrick',
    email: 'richard@hirelens.com',
    role: 'Recruiter',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'u-3',
    name: 'Dinesh Chugtai',
    email: 'dinesh@hirelens.com',
    role: 'Viewer',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  }
];

const initialUserProfile: UserProfile = {
  name: 'John Smith',
  email: 'john.smith@gmail.com',
  phone: '+1 (555) 018-9999',
  role: 'Frontend Engineer',
  summary: 'Passionate software developer with 3+ years of experience working with React, JavaScript, and CSS frameworks. Looking to expand skills in system containerization and cloud orchestration.',
  skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'TypeScript'],
  experience: '3 Years',
  education: 'B.S. in Computer Science'
};

const initialSuggestions = [
  'Add Docker skills to your resume to match DevOps dependencies.',
  'Add AWS experience to boost match scores in infrastructure metrics.',
  'Add more keywords such as "Framer Motion" or "Redux" for Frontend engineering roles.',
  'Improve project descriptions by focusing on quantifiable business impact (e.g., "reduced latency by 30%").'
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portal, setPortal] = useState<PortalType>('admin');
  const [adminPage, setAdminPage] = useState<string>('dashboard');
  const [userPage, setUserPage] = useState<string>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>('dark'); // dark mode by default for premium visual style
  const [themeColor, setThemeColorState] = useState<ThemeColor>('emerald-teal'); // emerald teal by default based on feedback
  
  const [jobs, setJobs] = useState<JobDescription[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n-1',
      title: 'New Resume Uploaded',
      message: 'Sarah Connor uploaded a resume for Senior React Developer.',
      time: '5m ago',
      read: false,
      type: 'success'
    },
    {
      id: 'n-2',
      title: 'Job Opening Created',
      message: 'Product Designer job is now active.',
      time: '1h ago',
      read: false,
      type: 'info'
    },
    {
      id: 'n-3',
      title: 'Screening Complete',
      message: 'NLP Research Engineer screening has finished. Average ATS: 89%.',
      time: '2h ago',
      read: true,
      type: 'info'
    }
  ]);

  // Apply dark class and theme datasets to root HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', themeColor);
  }, [themeColor]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Simulating parsing and score calculation
  const uploadResume = async (fileName: string, fileSize: string, targetJobId?: string) => {
    // 1. Add notification
    addNotification('Resume Uploaded', `Analyzing "${fileName}"...`, 'info');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const jobId = targetJobId || 'job-1';
    const targetJob = jobs.find(j => j.id === jobId) || jobs[0];
    
    // 2. Generate random candidates matching or not
    const randomScores = [74, 82, 88, 91, 95];
    const score = randomScores[Math.floor(Math.random() * randomScores.length)];
    const fitOptions: ('Excellent' | 'Good' | 'Fair' | 'Poor')[] = ['Excellent', 'Good', 'Fair'];
    const jobFit = score > 85 ? 'Excellent' : score > 75 ? 'Good' : 'Fair';
    const status = score > 85 ? 'Shortlisted' : 'In Review';

    const newCandidate: Candidate = {
      id: `cand-${Math.random().toString(36).substring(2, 9)}`,
      name: userProfile.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      title: targetJob.title,
      email: userProfile.email,
      phone: userProfile.phone,
      skills: [...userProfile.skills],
      experience: userProfile.experience,
      atsScore: score,
      jobFit,
      status,
      screenedDate: new Date().toISOString().split('T')[0],
      jobId: targetJob.id
    };

    setCandidates(prev => [newCandidate, ...prev]);
    
    // If uploading in user view, sync user suggestions or stats
    if (score >= 90) {
      setSuggestions(prev => prev.filter(s => !s.includes('keywords')));
    }

    addNotification('Screening Complete', `Resume parser scored candidate ${score}% for "${targetJob.title}"`, 'success');
  };

  const createJob = (job: Omit<JobDescription, 'id' | 'dateCreated'>) => {
    const newJob: JobDescription = {
      ...job,
      id: `job-${Math.random().toString(36).substring(2, 9)}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
    addNotification('Job Description Created', `Successfully posted job "${job.title}"`, 'success');
  };

  const updateCandidateStatus = (id: string, status: Candidate['status']) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
      addNotification(
        'Candidate Updated',
        `Moved ${candidate.name} to ${status}.`,
        status === 'Shortlisted' ? 'success' : status === 'Rejected' ? 'warning' : 'info'
      );
    }
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    addNotification('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const deleteResume = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    addNotification('Resume Deleted', 'Candidate profile removed from records.', 'warning');
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    addNotification('Job Deleted', 'Job opening archived.', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        portal,
        adminPage,
        userPage,
        theme,
        themeColor,
        notifications,
        jobs,
        candidates,
        users,
        userProfile,
        suggestions,
        setPortal,
        setAdminPage,
        setUserPage,
        toggleTheme,
        setThemeColor,
        markNotificationsAsRead,
        addNotification,
        uploadResume,
        createJob,
        updateCandidateStatus,
        updateProfile,
        deleteResume,
        deleteJob
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
