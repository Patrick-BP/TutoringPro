import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  User, InsertUser,
  Student, InsertStudent,
  Inquiry, InsertInquiry,
  Tutor, InsertTutor,
  ScheduledCall, InsertScheduledCall,
  Session, InsertSession,
  SessionReport, InsertSessionReport,
  Invoice, InsertInvoice,
  users, students, inquiries, tutors, scheduledCalls, sessions, sessionReports, invoices
} from '@shared/schema';
import { IStorage, DashboardStats, TodaySession } from './storage';
import { log } from './vite';

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "firstName" as "firstName", 
          "lastName" as "lastName", 
          "parentId" as "parentId", 
          grade, 
          notes, 
          "createdAt" as "createdAt" 
        FROM students 
        WHERE id = ${id} 
        LIMIT 1
      `;
      return result.length > 0 ? result[0] as Student : undefined;
    } catch (error) {
      console.error(`Error in getStudent: ${error}`);
      return undefined;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "firstName" as "firstName", 
          "lastName" as "lastName", 
          "parentId" as "parentId", 
          grade, 
          notes, 
          "createdAt" as "createdAt" 
        FROM students 
        ORDER BY "lastName", "firstName"
      `;
      return result as Student[];
    } catch (error) {
      console.error(`Error in getAllStudents: ${error}`);
      return [];
    }
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    try {
      // Use raw SQL for insertion to handle column name differences
      const result = await sql`
        INSERT INTO students (
          "firstName", 
          "lastName", 
          "parentId", 
          grade, 
          notes
        ) VALUES (
          ${studentData.firstName}, 
          ${studentData.lastName}, 
          ${studentData.parentId}, 
          ${studentData.grade}, 
          ${studentData.notes}
        ) 
        RETURNING 
          id, 
          "firstName" as "firstName", 
          "lastName" as "lastName", 
          "parentId" as "parentId", 
          grade, 
          notes, 
          "createdAt" as "createdAt"
      `;
      return result[0] as Student;
    } catch (error) {
      console.error(`Error in createStudent: ${error}`);
      throw error;
    }
  }

  // Inquiry operations
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "parentFirstName" as "parentFirstName", 
          "parentLastName" as "parentLastName", 
          "parentEmail" as "parentEmail", 
          "parentPhone" as "parentPhone", 
          "studentName" as "studentName", 
          grade as "studentGrade", 
          subject, 
          goals as "specificNeeds", 
          source as "referral", 
          status, 
          "createdAt" as "createdAt" 
        FROM inquiries 
        WHERE id = ${id} 
        LIMIT 1
      `;
      return result.length > 0 ? result[0] as Inquiry : undefined;
    } catch (error) {
      console.error(`Error in getInquiry: ${error}`);
      return undefined;
    }
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "parentFirstName" as "parentFirstName", 
          "parentLastName" as "parentLastName", 
          "parentEmail" as "parentEmail", 
          "parentPhone" as "parentPhone", 
          "studentName" as "studentName", 
          grade as "studentGrade", 
          subject, 
          goals as "specificNeeds", 
          source as "referral", 
          status, 
          "createdAt" as "createdAt" 
        FROM inquiries 
        ORDER BY "createdAt" DESC
      `;
      return result as Inquiry[];
    } catch (error) {
      console.error(`Error in getAllInquiries: ${error}`);
      return [];
    }
  }

  async getRecentInquiries(): Promise<Inquiry[]> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "parentFirstName" as "parentFirstName", 
          "parentLastName" as "parentLastName", 
          "parentEmail" as "parentEmail", 
          "parentPhone" as "parentPhone", 
          "studentName" as "studentName", 
          grade as "studentGrade", 
          subject, 
          goals as "specificNeeds", 
          source as "referral", 
          status, 
          "createdAt" as "createdAt" 
        FROM inquiries 
        ORDER BY "createdAt" DESC 
        LIMIT 5
      `;
      return result as Inquiry[];
    } catch (error) {
      console.error(`Error in getRecentInquiries: ${error}`);
      return [];
    }
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    try {
      // Use raw SQL for insertion to handle column name differences
      const result = await sql`
        INSERT INTO inquiries (
          "parentFirstName", 
          "parentLastName", 
          "parentEmail", 
          "parentPhone", 
          "studentName", 
          grade, 
          subject, 
          goals, 
          location, 
          "zipCode", 
          availability, 
          "additionalInfo", 
          budget, 
          source
        ) VALUES (
          ${inquiryData.parentFirstName}, 
          ${inquiryData.parentLastName}, 
          ${inquiryData.parentEmail}, 
          ${inquiryData.parentPhone}, 
          ${inquiryData.studentName}, 
          ${inquiryData.studentGrade}, 
          ${inquiryData.subject}, 
          ${inquiryData.specificNeeds}, 
          ${inquiryData.location}, 
          ${inquiryData.zipCode}, 
          ${inquiryData.availability ? JSON.stringify(inquiryData.availability) : null}, 
          ${inquiryData.additionalInfo}, 
          ${inquiryData.budget}, 
          ${inquiryData.referral}
        ) 
        RETURNING 
          id, 
          "parentFirstName" as "parentFirstName", 
          "parentLastName" as "parentLastName", 
          "parentEmail" as "parentEmail", 
          "parentPhone" as "parentPhone", 
          "studentName" as "studentName", 
          grade as "studentGrade", 
          subject, 
          goals as "specificNeeds", 
          location, 
          "zipCode" as "zipCode", 
          availability, 
          "additionalInfo" as "additionalInfo", 
          budget, 
          source as "referral", 
          status, 
          "createdAt" as "createdAt"
      `;
      return result[0] as Inquiry;
    } catch (error) {
      console.error(`Error in createInquiry: ${error}`);
      throw error;
    }
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    try {
      // Validate that status is one of the expected values
      if (status !== 'new' && status !== 'scheduled' && status !== 'matched' && 
          status !== 'completed' && status !== 'cancelled') {
        throw new Error(`Invalid status: ${status}`);
      }
      
      // Use raw SQL for update to handle column name differences
      const result = await sql`
        UPDATE inquiries 
        SET status = ${status} 
        WHERE id = ${id} 
        RETURNING 
          id, 
          "parentFirstName" as "parentFirstName", 
          "parentLastName" as "parentLastName", 
          "parentEmail" as "parentEmail", 
          "parentPhone" as "parentPhone", 
          "studentName" as "studentName", 
          grade as "studentGrade", 
          subject, 
          goals as "specificNeeds", 
          source as "referral", 
          status, 
          "createdAt" as "createdAt"
      `;
      
      return result.length > 0 ? result[0] as Inquiry : undefined;
    } catch (error) {
      console.error(`Error updating inquiry status: ${error}`);
      return undefined;
    }
  }

  // Tutor operations
  async getTutor(id: number): Promise<Tutor | undefined> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "userId" as "userId", 
          subjects, 
          education, 
          bio, 
          "hourlyRate" as "hourlyRate", 
          availability, 
          location, 
          "zipCode" as "zipCode", 
          "isActive" as "isActive", 
          "createdAt" as "createdAt" 
        FROM tutors 
        WHERE id = ${id} 
        LIMIT 1
      `;
      return result.length > 0 ? result[0] as Tutor : undefined;
    } catch (error) {
      console.error(`Error in getTutor: ${error}`);
      return undefined;
    }
  }

  async getAllTutors(): Promise<Tutor[]> {
    try {
      // Use raw SQL query to avoid column name mismatch issues
      const result = await sql`
        SELECT 
          id, 
          "userId" as "userId", 
          subjects, 
          education, 
          bio, 
          "hourlyRate" as "hourlyRate", 
          availability, 
          location, 
          "zipCode" as "zipCode", 
          "isActive" as "isActive", 
          "createdAt" as "createdAt" 
        FROM tutors
      `;
      return result as Tutor[];
    } catch (error) {
      console.error(`Error in getAllTutors: ${error}`);
      return [];
    }
  }

  async createTutor(tutorData: InsertTutor): Promise<Tutor> {
    try {
      // Use raw SQL for insertion to handle column name differences
      const result = await sql`
        INSERT INTO tutors (
          "userId", 
          subjects, 
          education, 
          bio, 
          "hourlyRate", 
          availability, 
          location, 
          "zipCode", 
          "isActive"
        ) VALUES (
          ${tutorData.userId}, 
          ${tutorData.subjects ? JSON.stringify(tutorData.subjects) : null}, 
          ${tutorData.education}, 
          ${tutorData.bio}, 
          ${tutorData.hourlyRate}, 
          ${tutorData.availability ? JSON.stringify(tutorData.availability) : null}, 
          ${tutorData.location}, 
          ${tutorData.zipCode}, 
          ${tutorData.isActive}
        ) 
        RETURNING 
          id, 
          "userId" as "userId", 
          subjects, 
          education, 
          bio, 
          "hourlyRate" as "hourlyRate", 
          availability, 
          location, 
          "zipCode" as "zipCode", 
          "isActive" as "isActive", 
          "createdAt" as "createdAt"
      `;
      return result[0] as Tutor;
    } catch (error) {
      console.error(`Error in createTutor: ${error}`);
      throw error;
    }
  }

  // ScheduledCall operations
  async getScheduledCall(id: number): Promise<ScheduledCall | undefined> {
    const result = await db.select().from(scheduledCalls).where(eq(scheduledCalls.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllScheduledCalls(): Promise<ScheduledCall[]> {
    return await db.select().from(scheduledCalls);
  }

  async createScheduledCall(callData: InsertScheduledCall): Promise<ScheduledCall> {
    const result = await db.insert(scheduledCalls).values(callData).returning();
    return result[0];
  }

  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllSessions(): Promise<Session[]> {
    return await db.select().from(sessions);
  }

  async getTodaySessions(): Promise<TodaySession[]> {
    try {
      // Get today's date in the format 'YYYY-MM-DD'
      const today = new Date();
      const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      // For now, return a simple sample of today's sessions since the schema fields don't match
      // This will be properly implemented once all schemas are aligned
      return [
        {
          id: 1,
          time: "10:00 AM - 11:00 AM",
          subject: "Mathematics",
          topic: "Algebra Fundamentals",
          student: {
            id: 1,
            name: "Alex Smith",
            initials: "AS"
          },
          tutor: {
            id: 1,
            name: "John Doe",
            initials: "JD"
          }
        },
        {
          id: 2,
          time: "1:00 PM - 2:00 PM",
          subject: "Science",
          topic: "Physics Motion Laws",
          student: {
            id: 2,
            name: "Emily Johnson",
            initials: "EJ"
          },
          tutor: {
            id: 1,
            name: "John Doe",
            initials: "JD"
          }
        }
      ];
    } catch (error) {
      console.error("Error getting today's sessions:", error);
      return [];
    }
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const result = await db.insert(sessions).values(sessionData).returning();
    return result[0];
  }

  // SessionReport operations
  async getSessionReport(id: number): Promise<SessionReport | undefined> {
    const result = await db.select().from(sessionReports).where(eq(sessionReports.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllSessionReports(): Promise<SessionReport[]> {
    return await db.select().from(sessionReports);
  }

  async createSessionReport(reportData: InsertSessionReport): Promise<SessionReport> {
    const result = await db.insert(sessionReports).values(reportData).returning();
    return result[0];
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoiceData).returning();
    return result[0];
  }

  // Dashboard operations
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // For now, return sample data as the schema fields don't match exactly
      // This would be properly implemented once the schema is fully aligned
      
      // Count all inquiries (not filtered by status yet)
      const inquiriesCount = await db.select({ count: sql<number>`count(*)` })
        .from(inquiries);
      
      // Count all students
      const studentsCount = await db.select({ count: sql<number>`count(*)` })
        .from(students);
      
      // Count all tutors
      const tutorsCount = await db.select({ count: sql<number>`count(*)` })
        .from(tutors);
      
      // Calculate monthly revenue sample
      const monthlyRevenue = "$5,000";
      
      return {
        newInquiries: inquiriesCount[0].count || 0,
        activeStudents: studentsCount[0].count || 0,
        activeTutors: tutorsCount[0].count || 0,
        monthlyRevenue: monthlyRevenue
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      // Return default values if there's an error
      return {
        newInquiries: 0,
        activeStudents: 0,
        activeTutors: 0,
        monthlyRevenue: "$0"
      };
    }
  }
}

// Create and export the database storage instance
export const dbStorage = new DbStorage();