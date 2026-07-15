// Central API client — reads the backend URL from env
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }
    ),

  // ── Students ─────────────────────────────────────────────────────
  getStudents: (token: string) =>
    request<any[]>('/students', {}, token),

  createStudent: (data: any, token: string) =>
    request<any>('/students', { method: 'POST', body: JSON.stringify(data) }, token),

  updateStudent: (id: string, data: any, token: string) =>
    request<any>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  deleteStudent: (id: string, token: string) =>
    request<void>(`/students/${id}`, { method: 'DELETE' }, token),

  // ── Batches ──────────────────────────────────────────────────────
  getBatches: (token: string) =>
    request<any[]>('/batches', {}, token),

  createBatch: (data: any, token: string) =>
    request<any>('/batches', { method: 'POST', body: JSON.stringify(data) }, token),

  updateBatch: (id: string, data: any, token: string) =>
    request<any>(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  deleteBatch: (id: string, token: string) =>
    request<void>(`/batches/${id}`, { method: 'DELETE' }, token),

  // ── Finances ─────────────────────────────────────────────────────
  getTransactions: (token: string) =>
    request<any[]>('/finances', {}, token),

  createTransaction: (data: any, token: string) =>
    request<any>('/finances', { method: 'POST', body: JSON.stringify(data) }, token),

  deleteTransaction: (id: string, token: string) =>
    request<void>(`/finances/${id}`, { method: 'DELETE' }, token),

  // ── Sessions ─────────────────────────────────────────────────────
  getSessions: (token: string) =>
    request<any[]>('/sessions', {}, token),

  createSession: (data: any, token: string) =>
    request<any>('/sessions', { method: 'POST', body: JSON.stringify(data) }, token),

  updateSession: (id: string, data: any, token: string) =>
    request<any>(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  deleteSession: (id: string, token: string) =>
    request<void>(`/sessions/${id}`, { method: 'DELETE' }, token),
};
