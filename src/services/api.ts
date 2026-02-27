import { Employee, Attendance, CalendarOverride, Note } from "../types";

const API_BASE = "/api";

export const api = {
  getEmployees: () => fetch(`${API_BASE}/employees`).then(r => r.json()) as Promise<Employee[]>,
  saveEmployee: (emp: Partial<Employee>) => {
    const method = emp.id ? 'PUT' : 'POST';
    const url = emp.id ? `${API_BASE}/employees/${emp.id}` : `${API_BASE}/employees`;
    return fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp)
    }).then(r => r.json());
  },
  deleteEmployee: (id: number) => fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' }).then(r => r.json()),

  getAttendance: () => fetch(`${API_BASE}/attendance`).then(r => r.json()) as Promise<Attendance[]>,
  clockIn: (data: { pin: string; tipo: string; gps: string; cantiere: string }) => 
    fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => {
      if (!r.ok) throw new Error("PIN non valido");
      return r.json();
    }),

  getCalendar: (month: string) => fetch(`${API_BASE}/calendar/${month}`).then(r => r.json()) as Promise<CalendarOverride[]>,
  saveCalendarOverride: (data: Partial<CalendarOverride>) => 
    fetch(`${API_BASE}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getNotes: () => fetch(`${API_BASE}/notes`).then(r => r.json()) as Promise<Note[]>,
  saveNote: (testo: string) => 
    fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testo })
    }).then(r => r.json()),
};
