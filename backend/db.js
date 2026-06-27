import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize PostgreSQL Connection Pool
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'hirelens'
    });

// Fallback status indicator
let useLocalDb = false;
const jsonDbPath = path.resolve('database.json');

// Initialize local JSON file db if missing
function initJsonDb() {
  if (!fs.existsSync(jsonDbPath)) {
    fs.writeFileSync(jsonDbPath, JSON.stringify({ users: [] }, null, 2));
  }
}

// Seed local JSON database with default accounts
async function seedJsonDb() {
  initJsonDb();
  try {
    const data = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
    const hasAdmin = data.users.some(u => u.email === 'admin@hirelens.com');
    const hasUser = data.users.some(u => u.email === 'alex.mercer@hirelens.com');
    
    if (!hasAdmin || !hasUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      if (!hasAdmin) {
        data.users.push({
          id: 1,
          name: 'Admin Recruiter',
          email: 'admin@hirelens.com',
          password: hashedPassword,
          role: 'admin',
          created_at: new Date().toISOString()
        });
      }
      if (!hasUser) {
        data.users.push({
          id: 2,
          name: 'Alex Mercer',
          email: 'alex.mercer@hirelens.com',
          password: hashedPassword,
          role: 'user',
          created_at: new Date().toISOString()
        });
      }
      fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2));
      console.log('Seeded local fallback database at database.json');
    }
  } catch (err) {
    console.error('Failed to seed local JSON database:', err);
  }
}

// Mock query logic matching query structures in server.js
async function executeJsonQuery(sql, params) {
  const data = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
  
  // 1. SELECT by email and role (Login)
  if (sql.includes('SELECT') && sql.includes('email = $1') && sql.includes('role = $2')) {
    const email = params[0];
    const role = params[1];
    const rows = data.users.filter(u => u.email === email && u.role === role);
    return { rows };
  }
  
  // 2. SELECT by email (Register duplicate check)
  if (sql.includes('SELECT') && sql.includes('email = $1')) {
    const email = params[0];
    const rows = data.users.filter(u => u.email === email);
    return { rows };
  }
  
  // 3. INSERT user (Register new user)
  if (sql.includes('INSERT INTO users')) {
    const [name, email, password, role] = params;
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      created_at: new Date().toISOString()
    };
    
    data.users.push(newUser);
    fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2));
    
    return {
      rows: [{
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }]
    };
  }
  
  throw new Error(`Unsupported local database query: ${sql}`);
}

// Wrapper pool object to dynamically direct queries
const dbPool = {
  query: async (sql, params = []) => {
    if (!useLocalDb) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.warn('================================================================');
        console.warn('PostgreSQL query execution failed. Switching to local JSON fallback...');
        console.warn('================================================================');
        useLocalDb = true;
        await seedJsonDb();
      }
    }
    return executeJsonQuery(sql, params);
  }
};

// Initialize database tables and seed default data
export async function initDb() {
  try {
    console.log('Connecting to PostgreSQL database...');
    const client = await pool.connect();
    try {
      // Create users table in PostgreSQL
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      const seedPassword = 'password123';
      const hashedPassword = await bcrypt.hash(seedPassword, 10);
      
      // Seed default accounts in PostgreSQL
      await client.query(
        `
        INSERT INTO users (name, email, password, role)
        VALUES 
          ('Admin Recruiter', 'admin@hirelens.com', $1, 'admin'),
          ('Alex Mercer', 'alex.mercer@hirelens.com', $2, 'user')
        ON CONFLICT (email) DO NOTHING;
        `,
        [hashedPassword, hashedPassword]
      );
      
      console.log('PostgreSQL database initialized and seeded successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('================================================================');
    console.warn('WARNING: Failed to connect to PostgreSQL database.');
    console.warn('Reason: ' + err.message);
    console.warn('Falling back to local file-based database (database.json).');
    console.warn('================================================================');
    useLocalDb = true;
    await seedJsonDb();
  }
}

export default dbPool;
