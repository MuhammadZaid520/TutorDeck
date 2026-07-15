import { createContext, useContext, useState, type ReactNode } from "react";
import type { TutorUser, AuthState } from "../types";
import { getCurrencyForCountry } from "../utils/countryDefaults";
import { api } from "../lib/api";

const AUTH_STORAGE_KEY = "tutor-auth-v2";

interface AuthContextValue {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, country: string) => Promise<void>;
  logout: () => void;
  updateCountry: (country: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadAuthFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return { user: null, token: null, isLoading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuthFromStorage());

  function saveToStorage(state: AuthState) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  async function login(email: string, password: string) {
    setAuth((prev) => ({ ...prev, isLoading: true }));
    try {
      const { token, user: apiUser } = await api.login(email, password);
      const { code, symbol } = getCurrencyForCountry("Pakistan");
      const user: TutorUser = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.name,
        country: "Pakistan",
        timezone: "Asia/Karachi",
        currency: code as TutorUser["currency"],
        currencySymbol: symbol,
        createdAt: new Date().toISOString(),
      };
      const newAuth = { user, token, isLoading: false };
      setAuth(newAuth);
      saveToStorage(newAuth);
    } catch (err) {
      setAuth((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }

  async function signup(email: string, password: string, name: string, country: string) {
    setAuth((prev) => ({ ...prev, isLoading: true }));
    try {
      const { token, user: apiUser } = await api.register(name, email, password);
      const { code, symbol } = getCurrencyForCountry(country);
      const user: TutorUser = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.name,
        country,
        timezone: "UTC",
        currency: code as TutorUser["currency"],
        currencySymbol: symbol,
        createdAt: new Date().toISOString(),
      };
      const newAuth = { user, token, isLoading: false };
      setAuth(newAuth);
      saveToStorage(newAuth);
    } catch (err) {
      setAuth((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }

  function logout() {
    setAuth({ user: null, token: null, isLoading: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  function updateCountry(country: string) {
    const { code, symbol } = getCurrencyForCountry(country);
    setAuth((prev) => ({
      ...prev,
      user: prev.user
        ? { ...prev.user, country, currency: code as TutorUser["currency"], currencySymbol: symbol }
        : null,
    }));
  }

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout, updateCountry }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
