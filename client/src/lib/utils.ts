import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  // Convert cents to dollars
  const dollars = amount / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(dollars);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export const subjectOptions = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
  { value: 'history', label: 'History' },
  { value: 'foreign-language', label: 'Foreign Language' },
  { value: 'test-prep', label: 'Test Preparation (SAT/ACT)' },
  { value: 'other', label: 'Other' }
];

export const gradeOptions = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
  { value: 'college', label: 'College/University' }
];

export const timePreferenceOptions = [
  { value: 'morning', label: 'Morning (9am-12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm-4pm)' },
  { value: 'evening', label: 'Evening (4pm-8pm)' },
  { value: 'flexible', label: 'Flexible' }
];

export const sessionFrequencyOptions = [
  { value: '1', label: '1 session/week' },
  { value: '2', label: '2 sessions/week' },
  { value: '3', label: '3 sessions/week' },
  { value: '4', label: '4+ sessions/week' }
];

export const locationPreferenceOptions = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid (Mix of Both)' }
];

export const contactPreferenceOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text Message' }
];

export const weekdayOptions = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' }
];

export const progressAssessmentOptions = [
  { value: 'excellent', label: 'Excellent - Exceeding expectations' },
  { value: 'good', label: 'Good - Meeting expectations' },
  { value: 'satisfactory', label: 'Satisfactory - Some progress' },
  { value: 'needs-improvement', label: 'Needs Improvement - Limited progress' },
  { value: 'concerning', label: 'Concerning - Additional support needed' }
];

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\d{10,}$/.test(phone.replace(/\D/g, ''));
}
