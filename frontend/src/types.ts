// ---- Core enums / unions -------------------------------------------------

export type CurrencyCode = "USD" | "GBP" | "PKR" | "EUR" | "AED" | "INR" | "CAD" | "AUD" | "NZD" | "BDT" | "LKR" | "SAR";

export type PlanType = "prepaid" | "postpaid" | "wallet";

export type PaymentStatus = "paid" | "due" | "overdue";

export type SessionStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";

export type RecordType = "individual" | "batch";

// Qualification levels are configurable in Settings, not hardcoded —
// this is just the shape, the actual list lives in data/mockData.ts
export type QualificationLevel = string;

// ---- Auth -----------------------------------------------------------------

export interface TutorUser {
  id: string;
  email: string;
  name: string;
  country: string; // ISO code or full name
  timezone: string;
  currency: CurrencyCode;
  currencySymbol: string; // e.g. "$", "£", "₨"
  createdAt: string;
}

export interface AuthState {
  user: TutorUser | null;
  token: string | null;
  isLoading: boolean;
}

// ---- Concessions ------------------------------------------------------

export interface Concession {
  id: string;
  label: string; // e.g. "Sibling discount", "Early bird"
  type: "percent" | "flat";
  value: number; // 10 = 10% or flat currency amount
}

// ---- Enrollments ------------------------------------------------------

export interface Enrollment {
  id: string;
  type: RecordType; // 'individual' or 'batch'
  batchId?: string; // only if type === 'batch'
  subject?: string; // only if type === 'individual'
  level?: QualificationLevel; // only if type === 'individual'
  currency: CurrencyCode;
  feeAmount: number;
  planType: PlanType;
  billingCycleDays: number;
  planStartDate: string;
  planExpiryDate: string;
  walletBalanceSessions?: number;
  concessions: string[];
  status: PaymentStatus;
  active: boolean;
}

// ---- People -------------------------------------------------------------

export interface ContactInfo {
  guardianName?: string;
  email: string;
  phone?: string;
  timezone: string; // IANA tz, e.g. "Asia/Karachi"
}

export interface Student {
  id: string;
  name: string;
  contact: ContactInfo;
  active: boolean;
  joinedDate: string;
  notes?: string;
  enrollments: Enrollment[];
}

export interface Batch {
  id: string;
  name: string;
  level: QualificationLevel;
  subject: string;
  currency: CurrencyCode;
  feePerStudent: number;
  planType: PlanType;
  billingCycleDays: number;
  studentIds: string[]; // references Student.id (type: "batch")
  schedule: { day: string; startTime: string; endTime: string; durationMins: number }[];
  active: boolean;
}

// ---- Sessions -------------------------------------------------------------

export interface Session {
  id: string;
  recordType: RecordType;
  recordId: string; // Enrollment.id or Batch.id
  title: string;
  date: string; // ISO date
  startTime: string; // "16:00"
  durationMins: number;
  status: SessionStatus;
  rescheduledFrom?: string; // ISO date if this session was moved
  cancellationReason?: string;
}

// ---- Money -------------------------------------------------------------

export interface Payment {
  id: string;
  recordType: RecordType;
  recordId: string;
  amount: number;
  currency: CurrencyCode;
  date: string; // date received
  periodStart: string;
  periodEnd: string;
  method?: string; // bank transfer, PayPal, cash...
  note?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
}

// ---- Settings -------------------------------------------------------------

export interface CurrencySettings {
  baseCurrency: CurrencyCode;
  exchangeRates: Record<CurrencyCode, number>; // units of currency per 1 base currency
}

export interface AppSettings {
  currency: CurrencySettings;
  qualificationLevels: QualificationLevel[];
  concessions: Concession[];
  paymentReminderDaysAfterDue: number; // e.g. 2
  tutorName: string;
  tutorTimezone: string;
}
