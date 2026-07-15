import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Student, Batch, Session, Payment, Expense, AppSettings } from "../types";
import { SETTINGS } from "../data/mockData";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

interface AppState {
  students: Student[];
  batches: Batch[];
  sessions: Session[];
  payments: Payment[];
  expenses: Expense[];
  settings: AppSettings;
  isLoading: boolean;
}

interface AppContextValue extends AppState {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  addPayment: (p: Payment) => void;
  addExpense: (e: Expense) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  rescheduleSession: (id: string, newDate: string, newTime: string) => void;
  cancelSession: (id: string, reason?: string) => void;
  updateSession: (id: string, patch: Partial<Session>) => void;
  refetch: () => void;
}

// Helper: map backend student → frontend Student shape
function mapStudent(s: any): Student {
  return {
    id: s.id,
    name: s.name,
    contact: {
      email: s.email || "",
      phone: s.phone,
      guardianName: s.parentName,
      timezone: "Asia/Karachi",
    },
    active: true,
    joinedDate: s.joinedDate || new Date().toISOString(),
    notes: "",
    enrollments: [],
  };
}

// Helper: map backend batch → frontend Batch shape
function mapBatch(b: any): Batch {
  return {
    id: b.id,
    name: b.name,
    level: "",
    subject: b.subject || "",
    currency: "PKR",
    feePerStudent: 0,
    planType: "prepaid",
    billingCycleDays: 30,
    studentIds: b.students?.map((s: any) => s.id) ?? [],
    schedule: [],
    active: true,
  };
}

// Helper: map backend session → frontend Session shape
function mapSession(s: any): Session {
  return {
    id: s.id,
    recordType: s.batchId ? "batch" : "individual",
    recordId: s.batchId || s.id,
    title: s.title,
    date: new Date(s.date).toISOString().split("T")[0],
    startTime: new Date(s.date).toTimeString().slice(0, 5),
    durationMins: s.duration || 60,
    status: (s.status?.toLowerCase() ?? "scheduled") as any,
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const token = auth.token;

  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<AppSettings>(SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [rawStudents, rawBatches, rawSessions, rawTransactions] = await Promise.all([
        api.getStudents(token),
        api.getBatches(token),
        api.getSessions(token),
        api.getTransactions(token),
      ]);

      setStudents(rawStudents.map(mapStudent));
      setBatches(rawBatches.map(mapBatch));
      setSessions(rawSessions.map(mapSession));

      // Split transactions into payments and expenses
      const income = rawTransactions.filter((t: any) => t.type === "INCOME");
      const exp = rawTransactions.filter((t: any) => t.type === "EXPENSE");

      setPayments(income.map((t: any): Payment => ({
        id: t.id,
        recordType: "individual",
        recordId: t.studentId || t.id,
        amount: t.amount,
        currency: "PKR",
        date: new Date(t.date).toISOString().split("T")[0],
        periodStart: new Date(t.date).toISOString().split("T")[0],
        periodEnd: new Date(t.date).toISOString().split("T")[0],
        note: t.description,
      })));

      setExpenses(exp.map((t: any): Expense => ({
        id: t.id,
        date: new Date(t.date).toISOString().split("T")[0],
        category: t.category,
        description: t.description || "",
        amount: t.amount,
        currency: "PKR",
      })));
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch when user logs in
  useEffect(() => {
    if (token) {
      fetchAll();
    } else {
      // Clear state on logout
      setStudents([]);
      setBatches([]);
      setSessions([]);
      setPayments([]);
      setExpenses([]);
    }
  }, [token, fetchAll]);

  function addPayment(p: Payment) {
    setPayments((prev) => [p, ...prev]);
  }

  function addExpense(e: Expense) {
    setExpenses((prev) => [e, ...prev]);
  }

  function updateStudent(id: string, patch: Partial<Student>) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, active: false } : s)));
  }

  function rescheduleSession(id: string, newDate: string, newTime: string) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, date: newDate, startTime: newTime, status: "rescheduled", rescheduledFrom: s.date }
          : s
      )
    );
  }

  function cancelSession(id: string, reason?: string) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "cancelled", cancellationReason: reason } : s))
    );
  }

  function updateSession(id: string, patch: Partial<Session>) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <AppContext.Provider
      value={{
        students,
        batches,
        sessions,
        payments,
        expenses,
        settings,
        isLoading,
        setStudents,
        setBatches,
        setSessions,
        setPayments,
        setExpenses,
        setSettings,
        addPayment,
        addExpense,
        updateStudent,
        removeStudent,
        rescheduleSession,
        cancelSession,
        updateSession,
        refetch: fetchAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
