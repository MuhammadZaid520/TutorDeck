import type {
  Student,
  Batch,
  Session,
  Payment,
  Expense,
  AppSettings,
  Concession,
  Enrollment
} from "../types";
import { todayISO, addDays } from "../utils/dates";

export const DEFAULT_LEVELS = [
  "O' Level",
  "IGCSE",
  "GCSE",
  "IB",
  "AS Level",
  "A Level",
  "Grade 8",
  "Grade 7",
  "Grade 6",
  "Grade 5",
  "Grade 4",
  "Grade 3",
];

export const CONCESSIONS: Concession[] = [
  { id: "c1", label: "Sibling discount", type: "percent", value: 10 },
  { id: "c2", label: "Early bird (paid before 1st)", type: "percent", value: 5 },
  { id: "c3", label: "Referral credit", type: "flat", value: 20 },
];

export const SETTINGS: AppSettings = {
  tutorName: "Your Name",
  tutorTimezone: "Asia/Karachi",
  paymentReminderDaysAfterDue: 2,
  qualificationLevels: DEFAULT_LEVELS,
  concessions: CONCESSIONS,
  currency: {
    baseCurrency: "USD",
    exchangeRates: {
      USD: 1,
      GBP: 0.78,
      PKR: 278,
      EUR: 0.92,
      AED: 3.67,
      INR: 83.2,
      CAD: 1.36,
      AUD: 1.53,
      NZD: 1.63,
      BDT: 110,
      LKR: 320,
      SAR: 3.75,
    },
  },
};

const t = todayISO();

export const STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Ayesha Khan",
    contact: { email: "ayesha.parent@example.com", phone: "+92 300 1234567", timezone: "Asia/Karachi" },
    active: true,
    joinedDate: addDays(t, -140),
    enrollments: [
      {
        id: "e1",
        type: "individual",
        level: "A Level",
        subject: "Chemistry",
        currency: "PKR",
        feeAmount: 18000,
        planType: "prepaid",
        billingCycleDays: 30,
        planStartDate: addDays(t, -20),
        planExpiryDate: addDays(t, 10),
        concessions: [],
        status: "paid",
        active: true
      }
    ]
  },
  {
    id: "s2",
    name: "Daniel Foster",
    contact: { email: "dan.foster.uk@example.com", timezone: "Europe/London" },
    active: true,
    joinedDate: addDays(t, -200),
    enrollments: [
      {
        id: "e2",
        type: "individual",
        level: "GCSE",
        subject: "Maths",
        currency: "GBP",
        feeAmount: 120,
        planType: "postpaid",
        billingCycleDays: 30,
        planStartDate: addDays(t, -35),
        planExpiryDate: addDays(t, -5),
        concessions: [],
        status: "overdue",
        active: true
      },
      {
        id: "e2b",
        type: "batch",
        batchId: "b1",
        currency: "USD",
        feeAmount: 60,
        planType: "prepaid",
        billingCycleDays: 30,
        planStartDate: addDays(t, -30),
        planExpiryDate: addDays(t, 0),
        concessions: [],
        status: "due",
        active: true
      }
    ]
  },
  {
    id: "s3",
    name: "Sara & Hina Malik (siblings)",
    contact: { email: "malik.family@example.com", timezone: "Asia/Karachi" },
    active: true,
    joinedDate: addDays(t, -60),
    enrollments: [
      {
        id: "e3",
        type: "individual",
        level: "IGCSE",
        subject: "Biology",
        currency: "USD",
        feeAmount: 80,
        planType: "prepaid",
        billingCycleDays: 30,
        planStartDate: addDays(t, -2),
        planExpiryDate: addDays(t, 28),
        concessions: ["c1"],
        status: "paid",
        active: true
      }
    ]
  },
  {
    id: "s4",
    name: "Omar Siddiqui",
    contact: { email: "omar.s@example.com", timezone: "Asia/Dubai" },
    active: true,
    joinedDate: addDays(t, -10),
    enrollments: [
      {
        id: "e4",
        type: "individual",
        level: "O' Level",
        subject: "Physics",
        currency: "AED",
        feeAmount: 600,
        planType: "wallet",
        billingCycleDays: 0,
        planStartDate: addDays(t, -10),
        planExpiryDate: addDays(t, 50),
        walletBalanceSessions: 3,
        concessions: [],
        status: "due",
        active: true
      }
    ]
  },
  {
    id: "s5",
    name: "Priya Nair",
    contact: { email: "priya.nair@example.com", timezone: "Asia/Kolkata" },
    active: true,
    joinedDate: addDays(t, -1),
    enrollments: [
      {
        id: "e5",
        type: "individual",
        level: "IB",
        subject: "Economics",
        currency: "USD",
        feeAmount: 95,
        planType: "prepaid",
        billingCycleDays: 30,
        planStartDate: addDays(t, -1),
        planExpiryDate: addDays(t, 29),
        concessions: ["c2"],
        status: "paid",
        active: true
      }
    ]
  },
];

export const BATCHES: Batch[] = [
  {
    id: "b1",
    name: "IGCSE Maths — Evening Batch",
    level: "IGCSE",
    subject: "Maths",
    currency: "USD",
    feePerStudent: 60,
    planType: "prepaid",
    billingCycleDays: 30,
    studentIds: ["s2"],
    schedule: [
      { day: "Monday", startTime: "17:00", endTime: "18:00", durationMins: 60 },
      { day: "Thursday", startTime: "17:00", endTime: "18:00", durationMins: 60 },
    ],
    active: true,
  },
  {
    id: "b2",
    name: "A Level Chemistry — Weekend Batch",
    level: "A Level",
    subject: "Chemistry",
    currency: "GBP",
    feePerStudent: 70,
    planType: "postpaid",
    billingCycleDays: 30,
    studentIds: [],
    schedule: [{ day: "Saturday", startTime: "10:00", endTime: "11:30", durationMins: 90 }],
    active: true,
  },
];

export const SESSIONS: Session[] = [
  {
    id: "ss1",
    recordType: "individual",
    recordId: "e1",
    title: "Ayesha Khan — Chemistry",
    date: t,
    startTime: "16:00",
    durationMins: 60,
    status: "scheduled",
  },
  {
    id: "ss2",
    recordType: "individual",
    recordId: "e2",
    title: "Daniel Foster — Maths",
    date: t,
    startTime: "18:00",
    durationMins: 45,
    status: "scheduled",
  },
  {
    id: "ss3",
    recordType: "batch",
    recordId: "b1",
    title: "IGCSE Maths — Evening Batch",
    date: addDays(t, 1),
    startTime: "17:00",
    durationMins: 60,
    status: "scheduled",
  },
  {
    id: "ss4",
    recordType: "individual",
    recordId: "e4",
    title: "Omar Siddiqui — Physics",
    date: addDays(t, -1),
    startTime: "15:00",
    durationMins: 60,
    status: "cancelled",
    cancellationReason: "Student unwell",
  },
  {
    id: "ss5",
    recordType: "batch",
    recordId: "b2",
    title: "A Level Chemistry — Weekend Batch",
    date: addDays(t, 3),
    startTime: "10:00",
    durationMins: 90,
    status: "rescheduled",
    rescheduledFrom: addDays(t, 2),
  },
];

export const PAYMENTS: Payment[] = [
  {
    id: "p1",
    recordType: "individual",
    recordId: "e1",
    amount: 18000,
    currency: "PKR",
    date: addDays(t, -20),
    periodStart: addDays(t, -20),
    periodEnd: addDays(t, 10),
    method: "Bank transfer",
  },
  {
    id: "p2",
    recordType: "individual",
    recordId: "e3",
    amount: 144,
    currency: "USD",
    date: addDays(t, -2),
    periodStart: addDays(t, -2),
    periodEnd: addDays(t, 28),
    method: "PayPal",
    note: "Sibling discount applied (10%)",
  },
  {
    id: "p3",
    recordType: "individual",
    recordId: "e5",
    amount: 90.25,
    currency: "USD",
    date: addDays(t, -1),
    periodStart: addDays(t, -1),
    periodEnd: addDays(t, 29),
    method: "Wise",
    note: "Early bird discount applied (5%)",
  },
];

export const EXPENSES: Expense[] = [
  { id: "e1", date: addDays(t, -15), category: "Software", description: "Zoom Pro subscription", amount: 15.99, currency: "USD" },
  { id: "e2", date: addDays(t, -10), category: "Internet", description: "Monthly broadband bill", amount: 6500, currency: "PKR" },
  { id: "e3", date: addDays(t, -6), category: "Marketing", description: "Instagram ads", amount: 20, currency: "USD" },
  { id: "e4", date: addDays(t, -3), category: "Supplies", description: "Whiteboard markers & printing", amount: 1200, currency: "PKR" },
];
