import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTutorSchema, 
  insertStudentSchema, 
  insertInquirySchema, 
  insertCallSchema, 
  insertSessionSchema, 
  insertReportSchema, 
  insertInvoiceSchema, 
  insertInvoiceItemSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Error handler for validation errors
  const validateRequest = (schema: z.ZodSchema<any>) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ 
            message: "Validation error", 
            errors: validationError.details 
          });
        } else {
          next(error);
        }
      }
    };
  };

  // Authentication routes
  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we would create and return a JWT token here
      res.json({ 
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error during login" });
    }
  });

  apiRouter.post("/auth/register", validateRequest(insertUserSchema), async (req, res) => {
    try {
      const { username, email } = req.body;
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(req.body);
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  // User routes
  apiRouter.get("/users", async (req, res) => {
    try {
      const role = req.query.role as string | undefined;
      const users = await storage.listUsers(role);
      
      // Don't return passwords
      const safeUsers = users.map(({ password, ...rest }) => rest);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching users" });
    }
  });

  apiRouter.get("/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching user" });
    }
  });

  // Tutor routes
  apiRouter.post("/tutors", validateRequest(insertTutorSchema), async (req, res) => {
    try {
      const tutor = await storage.createTutor(req.body);
      res.status(201).json(tutor);
    } catch (error) {
      res.status(500).json({ message: "Server error creating tutor" });
    }
  });

  apiRouter.get("/tutors", async (req, res) => {
    try {
      const activeStr = req.query.active as string | undefined;
      const active = activeStr === 'true' ? true : 
                    activeStr === 'false' ? false : 
                    undefined;
      
      const tutors = await storage.listTutors(active);
      res.json(tutors);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching tutors" });
    }
  });

  apiRouter.get("/tutors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tutor ID" });
      }
      
      const tutor = await storage.getTutor(id);
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      res.json(tutor);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching tutor" });
    }
  });

  // Student routes
  apiRouter.post("/students", validateRequest(insertStudentSchema), async (req, res) => {
    try {
      const student = await storage.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ message: "Server error creating student" });
    }
  });

  apiRouter.get("/students", async (req, res) => {
    try {
      const activeStr = req.query.active as string | undefined;
      const active = activeStr === 'true' ? true : 
                    activeStr === 'false' ? false : 
                    undefined;
      
      const parentIdStr = req.query.parentId as string | undefined;
      
      if (parentIdStr) {
        const parentId = parseInt(parentIdStr);
        if (isNaN(parentId)) {
          return res.status(400).json({ message: "Invalid parent ID" });
        }
        
        const students = await storage.getStudentsByParentId(parentId);
        return res.json(students);
      }
      
      const students = await storage.listStudents(active);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching students" });
    }
  });

  apiRouter.get("/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
      
      const student = await storage.getStudent(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching student" });
    }
  });

  // Inquiry routes
  apiRouter.post("/inquiries", validateRequest(insertInquirySchema), async (req, res) => {
    try {
      const inquiry = await storage.createInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Server error creating inquiry" });
    }
  });

  apiRouter.get("/inquiries", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const parentIdStr = req.query.parentId as string | undefined;
      
      if (parentIdStr) {
        const parentId = parseInt(parentIdStr);
        if (isNaN(parentId)) {
          return res.status(400).json({ message: "Invalid parent ID" });
        }
        
        const inquiries = await storage.getInquiriesByParentId(parentId);
        return res.json(inquiries);
      }
      
      const inquiries = await storage.listInquiries(status);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching inquiries" });
    }
  });

  apiRouter.get("/inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      const inquiry = await storage.getInquiry(id);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching inquiry" });
    }
  });

  apiRouter.patch("/inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      const inquiry = await storage.getInquiry(id);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      const updatedInquiry = await storage.updateInquiry(id, req.body);
      res.json(updatedInquiry);
    } catch (error) {
      res.status(500).json({ message: "Server error updating inquiry" });
    }
  });

  // Call routes
  apiRouter.post("/calls", validateRequest(insertCallSchema), async (req, res) => {
    try {
      const call = await storage.createCall(req.body);
      res.status(201).json(call);
    } catch (error) {
      res.status(500).json({ message: "Server error creating call" });
    }
  });

  apiRouter.get("/calls", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const parentIdStr = req.query.parentId as string | undefined;
      
      if (parentIdStr) {
        const parentId = parseInt(parentIdStr);
        if (isNaN(parentId)) {
          return res.status(400).json({ message: "Invalid parent ID" });
        }
        
        const calls = await storage.getCallsByParentId(parentId);
        return res.json(calls);
      }
      
      const calls = await storage.listCalls(status);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching calls" });
    }
  });

  apiRouter.get("/calls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid call ID" });
      }
      
      const call = await storage.getCall(id);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      
      res.json(call);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching call" });
    }
  });

  apiRouter.patch("/calls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid call ID" });
      }
      
      const call = await storage.getCall(id);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      
      const updatedCall = await storage.updateCall(id, req.body);
      res.json(updatedCall);
    } catch (error) {
      res.status(500).json({ message: "Server error updating call" });
    }
  });

  // Session routes
  apiRouter.post("/sessions", validateRequest(insertSessionSchema), async (req, res) => {
    try {
      const session = await storage.createSession(req.body);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Server error creating session" });
    }
  });

  apiRouter.get("/sessions", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const tutorIdStr = req.query.tutorId as string | undefined;
      const studentIdStr = req.query.studentId as string | undefined;
      
      if (tutorIdStr) {
        const tutorId = parseInt(tutorIdStr);
        if (isNaN(tutorId)) {
          return res.status(400).json({ message: "Invalid tutor ID" });
        }
        
        const sessions = await storage.getSessionsByTutorId(tutorId);
        return res.json(sessions);
      }
      
      if (studentIdStr) {
        const studentId = parseInt(studentIdStr);
        if (isNaN(studentId)) {
          return res.status(400).json({ message: "Invalid student ID" });
        }
        
        const sessions = await storage.getSessionsByStudentId(studentId);
        return res.json(sessions);
      }
      
      const sessions = await storage.listSessions(status);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching sessions" });
    }
  });

  apiRouter.get("/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching session" });
    }
  });

  apiRouter.patch("/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const updatedSession = await storage.updateSession(id, req.body);
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ message: "Server error updating session" });
    }
  });

  // Report routes
  apiRouter.post("/reports", validateRequest(insertReportSchema), async (req, res) => {
    try {
      const report = await storage.createReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Server error creating report" });
    }
  });

  apiRouter.get("/reports", async (req, res) => {
    try {
      const approvedStr = req.query.approved as string | undefined;
      const approved = approvedStr === 'true' ? true : 
                      approvedStr === 'false' ? false : 
                      undefined;
      
      const sessionIdStr = req.query.sessionId as string | undefined;
      
      if (sessionIdStr) {
        const sessionId = parseInt(sessionIdStr);
        if (isNaN(sessionId)) {
          return res.status(400).json({ message: "Invalid session ID" });
        }
        
        const report = await storage.getReportBySessionId(sessionId);
        return res.json(report ? [report] : []);
      }
      
      const reports = await storage.listReports(approved);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching reports" });
    }
  });

  apiRouter.get("/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const report = await storage.getReport(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching report" });
    }
  });

  apiRouter.patch("/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const report = await storage.getReport(id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      const updatedReport = await storage.updateReport(id, req.body);
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Server error updating report" });
    }
  });

  // Invoice routes
  apiRouter.post("/invoices", validateRequest(insertInvoiceSchema), async (req, res) => {
    try {
      const invoice = await storage.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Server error creating invoice" });
    }
  });

  apiRouter.get("/invoices", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const tutorIdStr = req.query.tutorId as string | undefined;
      const parentIdStr = req.query.parentId as string | undefined;
      
      if (tutorIdStr) {
        const tutorId = parseInt(tutorIdStr);
        if (isNaN(tutorId)) {
          return res.status(400).json({ message: "Invalid tutor ID" });
        }
        
        const invoices = await storage.getInvoicesByTutorId(tutorId);
        return res.json(invoices);
      }
      
      if (parentIdStr) {
        const parentId = parseInt(parentIdStr);
        if (isNaN(parentId)) {
          return res.status(400).json({ message: "Invalid parent ID" });
        }
        
        const invoices = await storage.getInvoicesByParentId(parentId);
        return res.json(invoices);
      }
      
      const invoices = await storage.listInvoices(status);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching invoices" });
    }
  });

  apiRouter.get("/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching invoice" });
    }
  });

  apiRouter.patch("/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      const updatedInvoice = await storage.updateInvoice(id, req.body);
      res.json(updatedInvoice);
    } catch (error) {
      res.status(500).json({ message: "Server error updating invoice" });
    }
  });

  // Invoice items routes
  apiRouter.post("/invoice-items", validateRequest(insertInvoiceItemSchema), async (req, res) => {
    try {
      const item = await storage.createInvoiceItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Server error creating invoice item" });
    }
  });

  apiRouter.get("/invoice-items", async (req, res) => {
    try {
      const invoiceIdStr = req.query.invoiceId as string | undefined;
      
      if (invoiceIdStr) {
        const invoiceId = parseInt(invoiceIdStr);
        if (isNaN(invoiceId)) {
          return res.status(400).json({ message: "Invalid invoice ID" });
        }
        
        const items = await storage.getInvoiceItemsByInvoiceId(invoiceId);
        return res.json(items);
      }
      
      res.status(400).json({ message: "Invoice ID is required" });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching invoice items" });
    }
  });

  apiRouter.get("/invoice-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice item ID" });
      }
      
      const item = await storage.getInvoiceItem(id);
      if (!item) {
        return res.status(404).json({ message: "Invoice item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching invoice item" });
    }
  });

  apiRouter.patch("/invoice-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice item ID" });
      }
      
      const item = await storage.getInvoiceItem(id);
      if (!item) {
        return res.status(404).json({ message: "Invoice item not found" });
      }
      
      const updatedItem = await storage.updateInvoiceItem(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Server error updating invoice item" });
    }
  });

  // Use the API router with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
