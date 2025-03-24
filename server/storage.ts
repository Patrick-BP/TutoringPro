import { 
  users, type User, type InsertUser,
  tutors, type Tutor, type InsertTutor,
  students, type Student, type InsertStudent,
  inquiries, type Inquiry, type InsertInquiry,
  calls, type Call, type InsertCall,
  sessions, type Session, type InsertSession,
  reports, type Report, type InsertReport,
  invoices, type Invoice, type InsertInvoice,
  invoiceItems, type InvoiceItem, type InsertInvoiceItem
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  listUsers(role?: string): Promise<User[]>;
  
  // Tutor operations
  getTutor(id: number): Promise<Tutor | undefined>;
  getTutorByUserId(userId: number): Promise<Tutor | undefined>;
  createTutor(tutor: InsertTutor): Promise<Tutor>;
  updateTutor(id: number, tutor: Partial<Tutor>): Promise<Tutor | undefined>;
  listTutors(active?: boolean): Promise<Tutor[]>;
  
  // Student operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentsByParentId(parentId: number): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<Student>): Promise<Student | undefined>;
  listStudents(active?: boolean): Promise<Student[]>;
  
  // Inquiry operations
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getInquiriesByParentId(parentId: number): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, inquiry: Partial<Inquiry>): Promise<Inquiry | undefined>;
  listInquiries(status?: string): Promise<Inquiry[]>;
  
  // Call operations
  getCall(id: number): Promise<Call | undefined>;
  getCallsByParentId(parentId: number): Promise<Call[]>;
  createCall(call: InsertCall): Promise<Call>;
  updateCall(id: number, call: Partial<Call>): Promise<Call | undefined>;
  listCalls(status?: string): Promise<Call[]>;
  
  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  getSessionsByTutorId(tutorId: number): Promise<Session[]>;
  getSessionsByStudentId(studentId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<Session>): Promise<Session | undefined>;
  listSessions(status?: string): Promise<Session[]>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getReportBySessionId(sessionId: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  listReports(approved?: boolean): Promise<Report[]>;
  
  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoicesByTutorId(tutorId: number): Promise<Invoice[]>;
  getInvoicesByParentId(parentId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  listInvoices(status?: string): Promise<Invoice[]>;
  
  // Invoice item operations
  getInvoiceItem(id: number): Promise<InvoiceItem | undefined>;
  getInvoiceItemsByInvoiceId(invoiceId: number): Promise<InvoiceItem[]>;
  createInvoiceItem(invoiceItem: InsertInvoiceItem): Promise<InvoiceItem>;
  updateInvoiceItem(id: number, invoiceItem: Partial<InvoiceItem>): Promise<InvoiceItem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tutors: Map<number, Tutor>;
  private students: Map<number, Student>;
  private inquiries: Map<number, Inquiry>;
  private calls: Map<number, Call>;
  private sessions: Map<number, Session>;
  private reports: Map<number, Report>;
  private invoices: Map<number, Invoice>;
  private invoiceItems: Map<number, InvoiceItem>;
  
  private currentIds: {
    users: number;
    tutors: number;
    students: number;
    inquiries: number;
    calls: number;
    sessions: number;
    reports: number;
    invoices: number;
    invoiceItems: number;
  };

  constructor() {
    this.users = new Map();
    this.tutors = new Map();
    this.students = new Map();
    this.inquiries = new Map();
    this.calls = new Map();
    this.sessions = new Map();
    this.reports = new Map();
    this.invoices = new Map();
    this.invoiceItems = new Map();
    
    this.currentIds = {
      users: 1,
      tutors: 1,
      students: 1,
      inquiries: 1,
      calls: 1,
      sessions: 1,
      reports: 1,
      invoices: 1,
      invoiceItems: 1
    };
    
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      email: "admin@tutorsync.com",
      fullName: "Admin User",
      role: "admin"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async listUsers(role?: string): Promise<User[]> {
    const users = Array.from(this.users.values());
    return role ? users.filter(user => user.role === role) : users;
  }

  // Tutor operations
  async getTutor(id: number): Promise<Tutor | undefined> {
    return this.tutors.get(id);
  }
  
  async getTutorByUserId(userId: number): Promise<Tutor | undefined> {
    return Array.from(this.tutors.values()).find(
      (tutor) => tutor.userId === userId,
    );
  }
  
  async createTutor(insertTutor: InsertTutor): Promise<Tutor> {
    const id = this.currentIds.tutors++;
    const tutor: Tutor = { ...insertTutor, id };
    this.tutors.set(id, tutor);
    return tutor;
  }
  
  async updateTutor(id: number, tutorData: Partial<Tutor>): Promise<Tutor | undefined> {
    const tutor = this.tutors.get(id);
    if (!tutor) return undefined;
    
    const updatedTutor = { ...tutor, ...tutorData };
    this.tutors.set(id, updatedTutor);
    return updatedTutor;
  }
  
  async listTutors(active?: boolean): Promise<Tutor[]> {
    const tutors = Array.from(this.tutors.values());
    return active !== undefined 
      ? tutors.filter(tutor => tutor.active === active)
      : tutors;
  }

  // Student operations
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  
  async getStudentsByParentId(parentId: number): Promise<Student[]> {
    return Array.from(this.students.values()).filter(
      (student) => student.parentId === parentId,
    );
  }
  
  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentIds.students++;
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }
  
  async updateStudent(id: number, studentData: Partial<Student>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...studentData };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }
  
  async listStudents(active?: boolean): Promise<Student[]> {
    const students = Array.from(this.students.values());
    return active !== undefined 
      ? students.filter(student => student.active === active)
      : students;
  }

  // Inquiry operations
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }
  
  async getInquiriesByParentId(parentId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(
      (inquiry) => inquiry.parentId === parentId,
    );
  }
  
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentIds.inquiries++;
    const now = new Date();
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      parentId: null, 
      status: "new", 
      createdAt: now 
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
  
  async updateInquiry(id: number, inquiryData: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, ...inquiryData };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
  
  async listInquiries(status?: string): Promise<Inquiry[]> {
    const inquiries = Array.from(this.inquiries.values());
    return status 
      ? inquiries.filter(inquiry => inquiry.status === status)
      : inquiries;
  }

  // Call operations
  async getCall(id: number): Promise<Call | undefined> {
    return this.calls.get(id);
  }
  
  async getCallsByParentId(parentId: number): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(
      (call) => call.parentId === parentId,
    );
  }
  
  async createCall(insertCall: InsertCall): Promise<Call> {
    const id = this.currentIds.calls++;
    const now = new Date();
    const call: Call = { 
      ...insertCall, 
      id, 
      status: "scheduled", 
      createdAt: now 
    };
    this.calls.set(id, call);
    return call;
  }
  
  async updateCall(id: number, callData: Partial<Call>): Promise<Call | undefined> {
    const call = this.calls.get(id);
    if (!call) return undefined;
    
    const updatedCall = { ...call, ...callData };
    this.calls.set(id, updatedCall);
    return updatedCall;
  }
  
  async listCalls(status?: string): Promise<Call[]> {
    const calls = Array.from(this.calls.values());
    return status 
      ? calls.filter(call => call.status === status)
      : calls;
  }

  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }
  
  async getSessionsByTutorId(tutorId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.tutorId === tutorId,
    );
  }
  
  async getSessionsByStudentId(studentId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.studentId === studentId,
    );
  }
  
  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentIds.sessions++;
    const now = new Date();
    const session: Session = { 
      ...insertSession, 
      id, 
      status: "scheduled", 
      createdAt: now 
    };
    this.sessions.set(id, session);
    return session;
  }
  
  async updateSession(id: number, sessionData: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...sessionData };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  
  async listSessions(status?: string): Promise<Session[]> {
    const sessions = Array.from(this.sessions.values());
    return status 
      ? sessions.filter(session => session.status === status)
      : sessions;
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async getReportBySessionId(sessionId: number): Promise<Report | undefined> {
    return Array.from(this.reports.values()).find(
      (report) => report.sessionId === sessionId,
    );
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentIds.reports++;
    const now = new Date();
    const report: Report = { 
      ...insertReport, 
      id, 
      approved: false, 
      createdAt: now 
    };
    this.reports.set(id, report);
    return report;
  }
  
  async updateReport(id: number, reportData: Partial<Report>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...reportData };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }
  
  async listReports(approved?: boolean): Promise<Report[]> {
    const reports = Array.from(this.reports.values());
    return approved !== undefined 
      ? reports.filter(report => report.approved === approved)
      : reports;
  }

  // Invoice operations
  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }
  
  async getInvoicesByTutorId(tutorId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(
      (invoice) => invoice.tutorId === tutorId,
    );
  }
  
  async getInvoicesByParentId(parentId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(
      (invoice) => invoice.parentId === parentId,
    );
  }
  
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentIds.invoices++;
    const now = new Date();
    const invoice: Invoice = { 
      ...insertInvoice, 
      id, 
      status: "pending", 
      paidDate: null, 
      createdAt: now 
    };
    this.invoices.set(id, invoice);
    return invoice;
  }
  
  async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updatedInvoice = { ...invoice, ...invoiceData };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }
  
  async listInvoices(status?: string): Promise<Invoice[]> {
    const invoices = Array.from(this.invoices.values());
    return status 
      ? invoices.filter(invoice => invoice.status === status)
      : invoices;
  }

  // Invoice item operations
  async getInvoiceItem(id: number): Promise<InvoiceItem | undefined> {
    return this.invoiceItems.get(id);
  }
  
  async getInvoiceItemsByInvoiceId(invoiceId: number): Promise<InvoiceItem[]> {
    return Array.from(this.invoiceItems.values()).filter(
      (item) => item.invoiceId === invoiceId,
    );
  }
  
  async createInvoiceItem(insertInvoiceItem: InsertInvoiceItem): Promise<InvoiceItem> {
    const id = this.currentIds.invoiceItems++;
    const invoiceItem: InvoiceItem = { ...insertInvoiceItem, id };
    this.invoiceItems.set(id, invoiceItem);
    return invoiceItem;
  }
  
  async updateInvoiceItem(id: number, itemData: Partial<InvoiceItem>): Promise<InvoiceItem | undefined> {
    const item = this.invoiceItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemData };
    this.invoiceItems.set(id, updatedItem);
    return updatedItem;
  }
}

export const storage = new MemStorage();
