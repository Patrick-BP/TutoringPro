import { pgTable, text, serial, integer, boolean, date, time, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users (Administrators, Parents, Tutors)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["admin", "parent", "tutor"] }).notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Students
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  grade: text("grade").notNull(),
  parentId: integer("parent_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

// Inquiries
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  parentFirstName: text("parent_first_name").notNull(),
  parentLastName: text("parent_last_name").notNull(),
  parentEmail: text("parent_email").notNull(),
  parentPhone: text("parent_phone").notNull(),
  studentName: text("student_name").notNull(),
  studentGrade: text("student_grade").notNull(),
  subject: text("subject").notNull(),
  specificNeeds: text("specific_needs"),
  location: text("location").notNull(),
  zipCode: text("zip_code"),
  availability: text("availability").array(),
  additionalInfo: text("additional_info"),
  budget: text("budget"),
  referral: text("referral"),
  status: text("status", { enum: ["new", "scheduled", "matched", "completed", "cancelled"] }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Tutors
export const tutors = pgTable("tutors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  subjects: text("subjects").array(),
  education: text("education"),
  bio: text("bio"),
  hourlyRate: text("hourly_rate"),
  availability: json("availability"),
  location: text("location"),
  zipCode: text("zip_code"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTutorSchema = createInsertSchema(tutors).omit({
  id: true,
  createdAt: true,
});

// Scheduled calls
export const scheduledCalls = pgTable("scheduled_calls", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiry_id"),
  parentId: integer("parent_id"),
  adminId: integer("admin_id"),
  callDate: date("call_date").notNull(),
  callTime: time("call_time").notNull(),
  callType: text("call_type", { enum: ["phone", "video"] }).notNull(),
  callPurpose: text("call_purpose").notNull(),
  status: text("status", { enum: ["scheduled", "completed", "cancelled"] }).notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScheduledCallSchema = createInsertSchema(scheduledCalls).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Sessions
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull(),
  studentId: integer("student_id").notNull(),
  subject: text("subject").notNull(),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  status: text("status", { enum: ["scheduled", "completed", "cancelled"] }).notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Session Reports
export const sessionReports = pgTable("session_reports", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().unique(),
  content: text("content").notNull(),
  progress: text("progress").notNull(),
  nextSteps: text("next_steps"),
  adminApproved: boolean("admin_approved").default(false),
  sentToParent: boolean("sent_to_parent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionReportSchema = createInsertSchema(sessionReports).omit({
  id: true,
  adminApproved: true,
  sentToParent: true,
  createdAt: true,
});

// Invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull(),
  parentId: integer("parent_id").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["draft", "sent", "paid", "overdue"] }).notNull().default("draft"),
  dueDate: date("due_date").notNull(),
  paidDate: date("paid_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  status: true,
  paidDate: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Tutor = typeof tutors.$inferSelect;
export type InsertTutor = z.infer<typeof insertTutorSchema>;

export type ScheduledCall = typeof scheduledCalls.$inferSelect;
export type InsertScheduledCall = z.infer<typeof insertScheduledCallSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type SessionReport = typeof sessionReports.$inferSelect;
export type InsertSessionReport = z.infer<typeof insertSessionReportSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
