import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool, { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Data Stores
let candidates = [];

let applications = [];

let notifications = [];

let atsWeights = {
  skills: 45,
  experience: 35,
  keywords: 20
};

// API Endpoints

// Login Endpoint using PostgreSQL
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, role]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or incorrect role portal.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Database login error:', err);
    res.status(500).json({ success: false, message: 'Internal server database error.' });
  }
});

// Registration Endpoint using PostgreSQL
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  try {
    // Check if email already registered
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      user: newUser
    });
  } catch (err) {
    console.error('Database registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server database error.' });
  }
});

// Candidates Endpoint
app.get('/api/candidates', (req, res) => {
  res.json(candidates);
});

// Candidate Status Modifier
app.post('/api/candidates/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  candidates = candidates.map(c => c.id === id ? { ...c, status } : c);
  
  // Find name to notify user
  const updatedCandidate = candidates.find(c => c.id === id);
  if (updatedCandidate) {
    notifications.unshift({
      id: Date.now(),
      text: `Your application status for ${updatedCandidate.jobTitle} updated to: ${status}`,
      time: 'Just now',
      read: false,
      portal: 'user'
    });
  }

  res.json({ success: true, candidates });
});

// User Applications Endpoint
app.get('/api/applications', (req, res) => {
  res.json(applications);
});

// Resume Upload & ATS screening simulation
app.post('/api/upload', (req, res) => {
  const { fileName, jobTitle, companyName } = req.body;
  
  const randomScore = Math.floor(Math.random() * 25) + 75; // 75 - 99
  let fitStatus = 'In Review';
  if (randomScore >= 90) fitStatus = 'Shortlisted';
  else if (randomScore >= 80) fitStatus = 'Review';
  else fitStatus = 'Rejected';

  const cleanName = fileName.replace(/\.[^/.]+$/, ""); // strip extension
  const parsedName = cleanName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const finalJobTitle = jobTitle || 'Cloud Architect';
  const finalCompanyName = companyName || 'HireLens Corp';

  const newApp = {
    id: Date.now(),
    jobTitle: finalJobTitle,
    companyName: finalCompanyName,
    appliedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    matchScore: randomScore,
    status: fitStatus
  };

  const newCandidate = {
    id: Date.now() + 1,
    name: parsedName || 'Alex Mercer',
    jobTitle: finalJobTitle,
    score: randomScore,
    jobFit: randomScore,
    status: fitStatus,
    screenedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    avatarColor: 'bg-primary/10 text-primary'
  };

  applications.unshift(newApp);
  candidates.unshift(newCandidate);

  // Trigger Notifications
  notifications.unshift({
    id: Date.now() + 2,
    text: `New resume uploaded: ${fileName}`,
    time: 'Just now',
    read: false,
    portal: 'user'
  });

  notifications.unshift({
    id: Date.now() + 3,
    text: `New candidate ${newCandidate.name} screened for ${finalJobTitle} (Score: ${randomScore})`,
    time: 'Just now',
    read: false,
    portal: 'admin'
  });

  res.json({ 
    success: true, 
    application: newApp, 
    candidate: newCandidate,
    applications,
    candidates
  });
});

// Settings Weights Endpoints
app.get('/api/settings/weights', (req, res) => {
  res.json(atsWeights);
});

app.post('/api/settings/weights', (req, res) => {
  const { skills, experience, keywords } = req.body;
  atsWeights = { skills, experience, keywords };
  res.json({ success: true, weights: atsWeights });
});

// Notifications Endpoints
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

app.post('/api/notifications/read-all', (req, res) => {
  const { portal } = req.body;
  notifications = notifications.map(n => n.portal === portal ? { ...n, read: true } : n);
  res.json({ success: true, notifications });
});

// Delete Candidate Endpoint
app.delete('/api/candidates/:id', (req, res) => {
  const id = parseInt(req.params.id);
  candidates = candidates.filter(c => c.id !== id);
  res.json({ success: true, candidates });
});

// Update User Profile Settings Endpoint (PostgreSQL)
app.post('/api/settings/profile', async (req, res) => {
  const { id, name, email, password } = req.body;
  if (!id || !name || !email) {
    return res.status(400).json({ success: false, message: 'Missing required parameters.' });
  }

  try {
    let result;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await pool.query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, role',
        [name, email, hashedPassword, id]
      );
    } else {
      result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
        [name, email, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Update database profile error:', err);
    res.status(500).json({ success: false, message: 'Database query execution failure.' });
  }
});

// Initialize Database and Start Server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize PostgreSQL database on startup. Starting server anyway...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
