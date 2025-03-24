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
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(studentData).returning();
    return result[0];
  }

  // Inquiry operations
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getRecentInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(5);
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const result = await db.insert(inquiries).values(inquiryData).returning();
    return result[0];
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    try {
      // Validate that status is one of the expected values
      if (status !== 'new' && status !== 'scheduled' && status !== 'matched' && 
          status !== 'completed' && status !== 'cancelled') {
        throw new Error(`Invalid status: ${status}`);
      }
      
      // Cast status to the required type
      const validStatus = status as "new" | "scheduled" | "matched" | "completed" | "cancelled";
      
      const result = await db.update(inquiries)
        .set({ status: validStatus })
        .where(eq(inquiries.id, id))
        .returning();
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error(`Error updating inquiry status: ${error}`);
      return undefined;
    }
  }

  // Tutor operations
  async getTutor(id: number): Promise<Tutor | undefined> {
    const result = await db.select().from(tutors).where(eq(tutors.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllTutors(): Promise<Tutor[]> {
    return await db.select().from(tutors);
  }

  async createTutor(tutorData: InsertTutor): Promise<Tutor> {
    const result = await db.insert(tutors).values(tutorData).returning();
    return result[0];
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