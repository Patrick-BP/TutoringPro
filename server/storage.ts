import { 
  users, type User, type InsertUser,
  students, type Student, type InsertStudent,
  inquiries, type Inquiry, type InsertInquiry,
  tutors, type Tutor, type InsertTutor,
  scheduledCalls, type ScheduledCall, type InsertScheduledCall,
  sessions, type Session, type InsertSession,
  sessionReports, type SessionReport, type InsertSessionReport,
  invoices, type Invoice, type InsertInvoice
} from "@shared/schema";
import { TodaySession, DashboardStats } from "@/types";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  // Inquiry operations
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getAllInquiries(): Promise<Inquiry[]>;
  getRecentInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined>;
  
  // Tutor operations
  getTutor(id: number): Promise<Tutor | undefined>;
  getAllTutors(): Promise<Tutor[]>;
  createTutor(tutor: InsertTutor): Promise<Tutor>;
  
  // ScheduledCall operations
  getScheduledCall(id: number): Promise<ScheduledCall | undefined>;
  getAllScheduledCalls(): Promise<ScheduledCall[]>;
  createScheduledCall(call: InsertScheduledCall): Promise<ScheduledCall>;
  
  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  getTodaySessions(): Promise<TodaySession[]>;
  createSession(session: InsertSession): Promise<Session>;
  
  // SessionReport operations
  getSessionReport(id: number): Promise<SessionReport | undefined>;
  getAllSessionReports(): Promise<SessionReport[]>;
  createSessionReport(report: InsertSessionReport): Promise<SessionReport>;
  
  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getAllInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  // Dashboard operations
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private inquiries: Map<number, Inquiry>;
  private tutors: Map<number, Tutor>;
  private scheduledCalls: Map<number, ScheduledCall>;
  private sessions: Map<number, Session>;
  private sessionReports: Map<number, SessionReport>;
  private invoices: Map<number, Invoice>;
  
  private userIdCounter: number;
  private studentIdCounter: number;
  private inquiryIdCounter: number;
  private tutorIdCounter: number;
  private callIdCounter: number;
  private sessionIdCounter: number;
  private reportIdCounter: number;
  private invoiceIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.inquiries = new Map();
    this.tutors = new Map();
    this.scheduledCalls = new Map();
    this.sessions = new Map();
    this.sessionReports = new Map();
    this.invoices = new Map();
    
    this.userIdCounter = 1;
    this.studentIdCounter = 1;
    this.inquiryIdCounter = 1;
    this.tutorIdCounter = 1;
    this.callIdCounter = 1;
    this.sessionIdCounter = 1;
    this.reportIdCounter = 1;
    this.invoiceIdCounter = 1;
    
    // Initialize with a default admin user
    this.createUser({
      username: "admin",
      email: "admin@tutorsync.com",
      password: "password",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "555-123-4567"
    });

    // Add some sample inquiries
    this.createInquiry({
      parentFirstName: "Jack",
      parentLastName: "Smith",
      parentEmail: "jack.smith@example.com",
      parentPhone: "555-111-1111",
      studentName: "Tommy Smith",
      studentGrade: "10",
      subject: "math",
      specificNeeds: "Algebra II",
      location: "online",
      zipCode: "10001",
      availability: ["weekday-afternoon", "weekend"],
      additionalInfo: "Struggling with quadratic equations",
      budget: "50-60",
      referral: "google"
    });

    this.createInquiry({
      parentFirstName: "Alice",
      parentLastName: "Davis",
      parentEmail: "alice.davis@example.com",
      parentPhone: "555-222-2222",
      studentName: "Emma Davis",
      studentGrade: "8",
      subject: "english",
      specificNeeds: "Essay Writing",
      location: "student-home",
      zipCode: "10002",
      availability: ["weekday-evening"],
      additionalInfo: "Needs help with structure and grammar",
      budget: "40-50",
      referral: "friend"
    });

    this.createInquiry({
      parentFirstName: "Robert",
      parentLastName: "Johnson",
      parentEmail: "robert.johnson@example.com",
      parentPhone: "555-333-3333",
      studentName: "Michael Johnson",
      studentGrade: "12",
      subject: "science",
      specificNeeds: "AP Chemistry",
      location: "tutor-location",
      zipCode: "10003",
      availability: ["weekday-evening", "weekend"],
      additionalInfo: "Preparing for AP exam",
      budget: "60-70",
      referral: "school"
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      phone: userData.phone || null,
      avatar: userData.avatar || null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  
  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }
  
  async createStudent(studentData: InsertStudent): Promise<Student> {
    const id = this.studentIdCounter++;
    const now = new Date();
    const student: Student = {
      id,
      ...studentData,
      createdAt: now
    };
    this.students.set(id, student);
    return student;
  }
  
  // Inquiry operations
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }
  
  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }
  
  async getRecentInquiries(): Promise<Inquiry[]> {
    // Get the 5 most recent inquiries
    return Array.from(this.inquiries.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }
  
  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryIdCounter++;
    const now = new Date();
    const inquiry: Inquiry = {
      id,
      ...inquiryData,
      status: "new",
      createdAt: now.toISOString()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
  
  async updateInquiryStatus(id: number, status: string): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry: Inquiry = {
      ...inquiry,
      status: status as any // Type assertion because status is a limited enum
    };
    
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
  
  // Tutor operations
  async getTutor(id: number): Promise<Tutor | undefined> {
    return this.tutors.get(id);
  }
  
  async getAllTutors(): Promise<Tutor[]> {
    return Array.from(this.tutors.values());
  }
  
  async createTutor(tutorData: InsertTutor): Promise<Tutor> {
    const id = this.tutorIdCounter++;
    const now = new Date();
    const tutor: Tutor = {
      id,
      ...tutorData,
      createdAt: now.toISOString()
    };
    this.tutors.set(id, tutor);
    return tutor;
  }
  
  // ScheduledCall operations
  async getScheduledCall(id: number): Promise<ScheduledCall | undefined> {
    return this.scheduledCalls.get(id);
  }
  
  async getAllScheduledCalls(): Promise<ScheduledCall[]> {
    return Array.from(this.scheduledCalls.values());
  }
  
  async createScheduledCall(callData: InsertScheduledCall): Promise<ScheduledCall> {
    const id = this.callIdCounter++;
    const now = new Date();
    
    // Handle date and time conversion if needed
    let callDate = callData.callDate;
    if (typeof callDate === 'string') {
      callDate = new Date(callDate).toISOString();
    }
    
    const call: ScheduledCall = {
      id,
      ...callData,
      callDate: callDate as any, // Type assertion to handle potential Date -> string conversion
      status: "scheduled",
      createdAt: now.toISOString()
    };
    this.scheduledCalls.set(id, call);
    return call;
  }
  
  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }
  
  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }
  
  async getTodaySessions(): Promise<TodaySession[]> {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    // Convert the sessions to the TodaySession format
    return Array.from(this.sessions.values())
      .filter(session => {
        const sessionDate = new Date(session.date.toString()).toISOString().split('T')[0];
        return sessionDate === today && session.status === "scheduled";
      })
      .map(session => {
        // Fetch student and tutor info
        const student = this.students.get(session.studentId);
        const tutorUser = this.users.get(this.tutors.get(session.tutorId)?.userId || 0);
        
        return {
          id: session.id,
          time: `${session.startTime} - ${session.endTime}`,
          subject: session.subject,
          topic: session.notes || "General tutoring",
          student: {
            id: session.studentId,
            name: student ? `${student.firstName} ${student.lastName}` : `Student #${session.studentId}`,
            initials: student ? `${student.firstName.charAt(0)}${student.lastName.charAt(0)}` : "ST"
          },
          tutor: {
            id: session.tutorId,
            name: tutorUser ? `${tutorUser.firstName} ${tutorUser.lastName}` : `Tutor #${session.tutorId}`,
            initials: tutorUser ? `${tutorUser.firstName.charAt(0)}${tutorUser.lastName.charAt(0)}` : "TU"
          }
        };
      })
      .slice(0, 3); // Limit to 3 sessions for the UI
  }
  
  async createSession(sessionData: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const now = new Date();
    const session: Session = {
      id,
      ...sessionData,
      status: "scheduled",
      createdAt: now.toISOString()
    };
    this.sessions.set(id, session);
    return session;
  }
  
  // SessionReport operations
  async getSessionReport(id: number): Promise<SessionReport | undefined> {
    return this.sessionReports.get(id);
  }
  
  async getAllSessionReports(): Promise<SessionReport[]> {
    return Array.from(this.sessionReports.values());
  }
  
  async createSessionReport(reportData: InsertSessionReport): Promise<SessionReport> {
    const id = this.reportIdCounter++;
    const now = new Date();
    const report: SessionReport = {
      id,
      ...reportData,
      adminApproved: false,
      sentToParent: false,
      createdAt: now.toISOString()
    };
    this.sessionReports.set(id, report);
    return report;
  }
  
  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }
  
  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }
  
  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceIdCounter++;
    const now = new Date();
    const invoice: Invoice = {
      id,
      ...invoiceData,
      status: "draft",
      paidDate: null,
      createdAt: now.toISOString()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  // Dashboard operations
  async getDashboardStats(): Promise<DashboardStats> {
    // Calculate dashboard statistics
    const newInquiries = Array.from(this.inquiries.values())
      .filter(i => i.status === "new").length;
    
    const activeStudents = this.students.size;
    
    const activeTutors = Array.from(this.tutors.values())
      .filter(t => t.isActive).length;
    
    // Calculate monthly revenue from paid invoices in current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRevenue = Array.from(this.invoices.values())
      .filter(inv => {
        if (inv.status !== "paid") return false;
        const paidDate = inv.paidDate ? new Date(inv.paidDate) : null;
        return paidDate && paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
      })
      .reduce((total, inv) => total + inv.amount, 0);
    
    // Format monthly revenue as currency string
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    
    return {
      newInquiries,
      activeStudents,
      activeTutors,
      monthlyRevenue: formatter.format(monthlyRevenue / 100) // Convert cents to dollars
    };
  }
}

export const storage = new MemStorage();
