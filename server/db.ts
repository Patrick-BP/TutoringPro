import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import { log } from './vite';

// Configure neon client for Replit environment
neonConfig.fetchConnectionCache = true;

// Connection string is provided by Replit database
const connectionString = process.env.DATABASE_URL as string;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create neon client
const sql = neon(connectionString);

// Create drizzle client
export const db = drizzle(sql, { schema });

// Initialize the database
export async function initializeDb() {
  try {
    log('Initializing database...', 'db');

    // Check if we can connect to the database
    try {
      const result = await sql`SELECT NOW()`;
      log('PostgreSQL connection successful', 'db');
    } catch (connError) {
      log(`PostgreSQL connection error: ${connError}`, 'db');
      throw connError;
    }

    // Create tables
    try {
      await createTables();
      log('Database schema setup complete', 'db');
    } catch (tableError) {
      log(`Failed to create tables: ${tableError}`, 'db');
      throw tableError;
    }

    // Set up demo data (for simplicity, just creating the admin user)
    try {
      log('Checking if admin user exists...', 'db');
      const adminExists = await sql`SELECT * FROM users WHERE username = 'admin' LIMIT 1`;
      
      if (adminExists.length === 0) {
        await sql`
          INSERT INTO users (username, password, email, "firstName", "lastName", role, phone)
          VALUES ('admin', 'admin123', 'admin@tutoringbiz.com', 'Admin', 'User', 'admin', '555-123-4567')
        `;
        log('Created admin user', 'db');
      } else {
        log('Admin user already exists', 'db');
      }
    } catch (demoDataError) {
      log(`Error setting up demo data: ${demoDataError}`, 'db');
      // Continue even if demo data fails - not critical
    }

    return true;
  } catch (error) {
    log(`Database initialization failed: ${error}`, 'db');
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Function to create tables
async function createTables() {
  try {
    // Create tables directly with SQL statements
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        avatar TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "parentId" INTEGER,
        grade TEXT,
        school TEXT,
        subjects TEXT[],
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        "parentFirstName" TEXT NOT NULL,
        "parentLastName" TEXT NOT NULL,
        "parentEmail" TEXT NOT NULL,
        "parentPhone" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        grade TEXT NOT NULL,
        subject TEXT NOT NULL,
        goals TEXT,
        source TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS tutors (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subjects TEXT[],
        qualifications TEXT,
        "availableDays" TEXT[],
        "availableHours" TEXT[],
        "hourlyRate" NUMERIC(10, 2),
        status TEXT NOT NULL DEFAULT 'active',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS scheduled_calls (
        id SERIAL PRIMARY KEY,
        "inquiryId" INTEGER,
        "parentId" INTEGER,
        "adminId" INTEGER,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        duration INTEGER NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'scheduled',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        "studentId" INTEGER NOT NULL,
        "tutorId" INTEGER NOT NULL,
        date DATE NOT NULL,
        "startTime" TEXT NOT NULL,
        "endTime" TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT,
        location TEXT,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'scheduled',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS session_reports (
        id SERIAL PRIMARY KEY,
        "sessionId" INTEGER NOT NULL,
        content TEXT NOT NULL,
        homework TEXT,
        materials TEXT,
        "tutorNotes" TEXT,
        "studentProgress" TEXT CHECK ("studentProgress" IN ('excellent', 'good', 'satisfactory', 'needs_improvement')),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        "tutorId" INTEGER,
        "parentId" INTEGER,
        amount NUMERIC(10, 2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        "dueDate" DATE NOT NULL,
        description TEXT,
        "sessionIds" INTEGER[],
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `;
    
    log('All tables created successfully', 'db');
  } catch (error) {
    log(`Error creating tables: ${error}`, 'db');
    throw error;
  }
}