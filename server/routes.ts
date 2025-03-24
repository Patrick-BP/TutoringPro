import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertInquirySchema, insertScheduledCallSchema, insertSessionReportSchema, insertInvoiceSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler for validation errors
  const handleValidationError = (error: unknown) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return { message: validationError.message };
    }
    return { message: "An unexpected error occurred" };
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, we would set up a session here
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error during login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // In a real app, we would destroy the session here
    return res.status(200).json({ message: "Logged out successfully" });
  });

  // Dashboard stats
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Inquiry routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      return res.status(200).json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      return res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.get("/api/inquiries/recent", async (req, res) => {
    try {
      const inquiries = await storage.getRecentInquiries();
      return res.status(200).json(inquiries);
    } catch (error) {
      console.error("Error fetching recent inquiries:", error);
      return res.status(500).json({ message: "Failed to fetch recent inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const newInquiry = await storage.createInquiry(inquiryData);
      return res.status(201).json(newInquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      if (error instanceof ZodError) {
        return res.status(400).json(handleValidationError(error));
      }
      return res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // Scheduled calls routes
  app.get("/api/scheduled-calls", async (req, res) => {
    try {
      const calls = await storage.getAllScheduledCalls();
      return res.status(200).json(calls);
    } catch (error) {
      console.error("Error fetching scheduled calls:", error);
      return res.status(500).json({ message: "Failed to fetch scheduled calls" });
    }
  });

  app.post("/api/scheduled-calls", async (req, res) => {
    try {
      const callData = insertScheduledCallSchema.parse(req.body);
      const newCall = await storage.createScheduledCall(callData);
      
      // Update the inquiry status to "scheduled"
      if (callData.inquiryId) {
        await storage.updateInquiryStatus(callData.inquiryId, "scheduled");
      }
      
      return res.status(201).json(newCall);
    } catch (error) {
      console.error("Error scheduling call:", error);
      if (error instanceof ZodError) {
        return res.status(400).json(handleValidationError(error));
      }
      return res.status(500).json({ message: "Failed to schedule call" });
    }
  });

  // Sessions routes
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      return res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/today", async (req, res) => {
    try {
      const sessions = await storage.getTodaySessions();
      return res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching today's sessions:", error);
      return res.status(500).json({ message: "Failed to fetch today's sessions" });
    }
  });

  // Tutor routes
  app.get("/api/tutors", async (req, res) => {
    try {
      const tutors = await storage.getAllTutors();
      return res.status(200).json(tutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      return res.status(500).json({ message: "Failed to fetch tutors" });
    }
  });

  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      return res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Session reports routes
  app.get("/api/session-reports", async (req, res) => {
    try {
      const reports = await storage.getAllSessionReports();
      return res.status(200).json(reports);
    } catch (error) {
      console.error("Error fetching session reports:", error);
      return res.status(500).json({ message: "Failed to fetch session reports" });
    }
  });

  app.post("/api/session-reports", async (req, res) => {
    try {
      const reportData = insertSessionReportSchema.parse(req.body);
      const newReport = await storage.createSessionReport(reportData);
      return res.status(201).json(newReport);
    } catch (error) {
      console.error("Error creating session report:", error);
      if (error instanceof ZodError) {
        return res.status(400).json(handleValidationError(error));
      }
      return res.status(500).json({ message: "Failed to create session report" });
    }
  });

  // Invoices routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      return res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const newInvoice = await storage.createInvoice(invoiceData);
      return res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      if (error instanceof ZodError) {
        return res.status(400).json(handleValidationError(error));
      }
      return res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
