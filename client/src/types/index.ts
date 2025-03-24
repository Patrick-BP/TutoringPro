import type { 
  User, Student, Inquiry, Tutor, 
  ScheduledCall, Session, SessionReport, Invoice 
} from "@shared/schema";

export type { 
  User, Student, Inquiry, Tutor, 
  ScheduledCall, Session, SessionReport, Invoice 
};

export type DashboardStats = {
  newInquiries: number;
  activeStudents: number;
  activeTutors: number;
  monthlyRevenue: string;
};

export type TodaySession = {
  id: number;
  time: string;
  subject: string;
  topic: string;
  student: {
    id: number;
    name: string;
    initials: string;
  };
  tutor: {
    id: number;
    name: string;
    initials: string;
  };
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "parent" | "tutor";
  phone: string | null;
  avatar: string | null;
  isAuthenticated: boolean;
};
