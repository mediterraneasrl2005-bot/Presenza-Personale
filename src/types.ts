export interface Employee {
  id: number;
  nome: string;
  pin: string;
  ore_g: number;
  attivo: number;
}

export interface Attendance {
  id: number;
  employee_id: number;
  nome?: string;
  tipo: 'entrata' | 'uscita';
  timestamp: string;
  gps: string;
  cantiere: string;
}

export interface CalendarOverride {
  id: number;
  employee_id: number;
  data: string;
  tipo: 'F' | 'M' | 'A' | 'L104' | 'ore' | '';
  valore: number;
}

export interface Note {
  id: number;
  testo: string;
  data_creazione: string;
}
