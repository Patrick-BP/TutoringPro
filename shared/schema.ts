import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User related tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // admin, tutor, parent
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

// Tutor specific information
export const tutors = pgTable("tutors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  subjects: text("subjects").array(),
  availability: json("availability"),
  education: text("education"),
  hourlyRate: integer("hourly_rate"),
  location: text("location"),
  bio: text("bio"),
  active: boolean("active").default(true)
});

export const insertTutorSchema = createInsertSchema(tutors).omit({ 
  id: true 
});

// Parent/student related information
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  grade: text("grade").notNull(),
  learningNeeds: text("learning_needs"),
  active: boolean("active").default(true)
});

export const insertStudentSchema = createInsertSchema(students).omit({ 
  id: true 
});

// Parent inquiries
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  grade: text("grade").notNull(),
  subject: text("subject").notNull(),
  learningNeeds: text("learning_needs"),
  days: text("days").array(),
  timePreference: text("time_preference"),
  sessionFrequency: text("session_frequency"),
  locationPreference: text("location_preference"),
  budget: integer("budget"),
  parentName: text("parent_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  contactPreference: text("contact_preference"),
  status: text("status").default("new"), // new, in_progress, matched, closed
  createdAt: timestamp("created_at").defaultNow()
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({ 
  id: true, 
  parentId: true,
  status: true,
  createdAt: true
});

// Parent call scheduling
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => users.id),
  adminId: integer("admin_id").references(() => users.id),
  inquiryId: integer("inquiry_id").references(() => inquiries.id),
  date: timestamp("date").notNull(),
  duration: integer("duration").default(30), // in minutes
  notes: text("notes"),
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCallSchema = createInsertSchema(calls).omit({ 
  id: true,
  status: true,
  createdAt: true
});

// Tutoring sessions
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull().references(() => tutors.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  subject: text("subject").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ 
  id: true,
  status: true,
  createdAt: true
});

// Session reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  topicsCovered: text("topics_covered").notNull(),
  summary: text("summary").notNull(),
  homeworkAssigned: text("homework_assigned"),
  progressAssessment: text("progress_assessment").notNull(),
  internalNotes: text("internal_notes"),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true,
  approved: true,
  createdAt: true
});

// Invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull().references(() => tutors.id),
  parentId: integer("parent_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // in cents
  description: text("description").notNull(),
  status: text("status").default("pending"), // pending, paid, cancelled
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({ 
  id: true,
  status: true,
  paidDate: true,
  createdAt: true
});

// Invoice items
export const invoiceItems = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  sessionId: integer("session_id").references(() => sessions.id),
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // in cents
  quantity: integer("quantity").default(1)
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({ 
  id: true 
});

// Export all types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tutor = typeof tutors.$inferSelect;
export type InsertTutor = z.infer<typeof insertTutorSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
