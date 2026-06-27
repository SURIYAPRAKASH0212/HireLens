# HireLens - AI-Powered Resume Evaluator & Screener

> **Disclaimer:** This project was developed strictly for **educational purposes** to demonstrate the integration of multi-role web architectures, dynamic analytics dashboards, and relational database systems (PostgreSQL) with secure user authentication.

HireLens is a comprehensive AI-powered hiring assistant that simplifies applicant screening for recruiters and application tracking for candidates. With a modern, responsive interface built in React and a secure Express/Node.js backend, it allows seamless user registration, profile evaluation, dynamic ATS scoring, and real-time recruitment reports.

---

## Key Features

### 1. Dual-Portal Roles
- **Candidate Portal**:
  - Upload resumes and track evaluation status.
  - Review dynamic match scores for target roles.
  - Interactive profile checklist to see what areas need setup to improve ATS scores.
- **Recruiter (Admin) Portal**:
  - Live dashboard tracking total resumes, active jobs, and average candidate scores.
  - screening reports detailing monthly conversion rates and analytics funnels.
  - Recruiting team manager to add and remove recruitment coordinators.
  - Configurable ATS scoring weights for skills, experience, and keyword matches.

### 2. User Authentication & Database Setup
- Secure user registration and password hashing using `bcryptjs`.
- PostgreSQL database integration for secure user profile persistence.
- **Self-Healing Fallback**: If a connection to PostgreSQL cannot be established, the system automatically redirects query operations to a local file-based database store (`database.json`) without crashing the app.

### 3. Modern Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, PostgreSQL (`pg`), BcryptJS.

---

## Repository Contents

```
HireLens/
├── backend/
│   ├── db.js             # PostgreSQL connection pool with file fallback handler
│   ├── database.json     # Self-healing local JSON storage fallback
│   ├── server.js         # REST API endpoints (login, registration, upload, candidates, settings)
│   ├── .env              # Environment configuration for ports and PostgreSQL
│   └── package.json      # Backend scripts and dependencies
├── frontend/
│   ├── src/
│   │   ├── contexts/     # AppContext (global states) & ThemeContext (Dark Mode)
│   │   ├── layout/       # Symmetrical Sidebar & Navbar components
│   │   ├── pages/        # Login/Signup page & portal dashboard interfaces
│   │   └── main.jsx      # Entry point
│   ├── vite.config.js    # Dev proxies and server port allocations
│   └── package.json      # Frontend package configuration
├── package.json          # Root Monorepo configuration
└── README.md             # Project documentation
```

---

## Getting Started & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** database (optional; the app falls back to local JSON database if PostgreSQL is not running)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SURIYAPRAKASH0212/HireLens.git
   cd HireLens
   ```

2. Install dependencies for the root package, frontend, and backend:
   ```bash
   npm run install-all
   ```
   *(Or manually run `npm install` inside both `frontend` and `backend` directories)*

3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   PGUSER=your_postgres_user
   PGHOST=localhost
   PGPASSWORD=your_postgres_password
   PGDATABASE=hirelens
   PGPORT=5432
   ```

---

## Running the Application

To start both the backend server and the frontend Vite developer server concurrently from the root directory:

```bash
npm run dev
```

The application will be accessible at:
- **Vite Frontend**: [http://localhost:5173](http://localhost:5173) (or the next available port indicated in your terminal)
- **Express Backend**: [http://localhost:5000](http://localhost:5000)

---

## Educational Purposes and Limitations
- The resume parser and ATS matches are simulated via score algorithms based on user profile weights to model dynamic dashboard calculations.
- File-based `database.json` storage is intended for quick-start development and local sandbox demonstrations only.

---

## Author
- **Suriyaprakash** (GitHub: [@SURIYAPRAKASH0212](https://github.com/SURIYAPRAKASH0212))
