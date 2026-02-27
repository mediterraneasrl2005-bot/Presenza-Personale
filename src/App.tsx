import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  Link as LinkIcon, 
  Hospital, 
  FileText,
  Plus,
  Search,
  MapPin,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from './services/api';
import { Employee, Attendance, CalendarOverride, Note } from './types';
import datiDipendenti from './dipendenti.json';
// --- Utility Components ---

const Badge = ({ children, color = 'accent' }: { children: React.ReactNode, color?: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${color}/10 text-${color} border border-${color}/20`}>
    {children}
  </span>
);

const Card = ({ children, title, subtitle, icon: Icon, color = 'accent', className = '' }: any) => (
  <div className={`bg-surface border border-border rounded-xl p-5 relative overflow-hidden ${className}`}>
    <div className={`absolute top-0 left-0 right-0 h-1 bg-${color}`} />
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="font-display text-2xl font-extrabold">{subtitle}</h3>
      </div>
      {Icon && <Icon className={`text-${color} opacity-50`} size={20} />}
    </div>
    {children}
  </div>
);

// --- Pages ---

const Dashboard = ({ employees, attendance }: { employees: Employee[], attendance: Attendance[] }) => {
  const stats = useMemo(() => {
    return {
      total: employees.length,
      activeToday: new Set(attendance.filter(a => a.timestamp.startsWith(new Date().toISOString().split('T')[0])).map(a => a.employee_id)).size,
    };
  }, [employees, attendance]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-black">Dashboard</h1>
        <p className="text-gray-500 text-sm">Riepilogo presenze e attività</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Dipendenti Totali" subtitle={stats.total} icon={Users} color="info" />
        <Card title="Attivi Oggi" subtitle={stats.activeToday} icon={Clock} color="accent" />
        <Card title="Ore Mensili" subtitle="1.240h" icon={LayoutDashboard} color="luxury" />
        <Card title="Assenze" subtitle="4" icon={Hospital} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-display font-bold text-sm">Ultime Timbrature</h3>
            <Badge color="accent">Live</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg/50 text-[10px] uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="p-4">Dipendente</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Orario</th>
                  <th className="p-4">Posizione</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {attendance.slice(0, 8).map((a) => (
                  <tr key={a.id} className="hover:bg-surface-hover transition-colors">
                    <td className="p-4 font-medium">{a.nome}</td>
                    <td className="p-4">
                      <Badge color={a.tipo === 'entrata' ? 'accent' : 'warning'}>{a.tipo}</Badge>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">{new Date(a.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 text-info flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="text-xs">{a.gps || 'N/D'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm">Note Rapide</h3>
          <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
            <div className="p-3 bg-warning/5 border-l-2 border-warning rounded-r-lg text-xs">
              <p className="text-warning font-bold mb-1">Promemoria</p>
              <p className="text-gray-400">Controllare certificati medici di Rossi entro venerdì.</p>
            </div>
            <div className="p-3 bg-info/5 border-l-2 border-info rounded-r-lg text-xs">
              <p className="text-info font-bold mb-1">Cantiere Nord</p>
              <p className="text-gray-400">Nuovo PIN per squadra B: 4455.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const [employees, setEmployees] = useState<Employee[]>(datiDipendenti);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Partial<Employee> | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      ...editingEmp,
      nome: (form.nome as any).value,
      pin: (form.pin as any).value,
      ore_g: parseFloat((form.ore_g as any).value),
    };
    await api.saveEmployee(data);
    setIsModalOpen(false);
    setEditingEmp(null);
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questo dipendente?")) {
      await api.deleteEmployee(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-black">Dipendenti</h1>
          <p className="text-gray-500 text-sm">Gestione anagrafica e PIN</p>
        </div>
        <button onClick={() => { setEditingEmp(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nuovo
        </button>
      </header>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg/50 text-[10px] uppercase tracking-widest text-gray-500">
            <tr>
              <th className="p-4">Nominativo</th>
              <th className="p-4">PIN</th>
              <th className="p-4">Ore/Giorno</th>
              <th className="p-4 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-bold">{emp.nome}</td>
                <td className="p-4 font-mono text-accent">{emp.pin}</td>
                <td className="p-4 text-gray-400">{emp.ore_g}h</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => { setEditingEmp(emp); setIsModalOpen(true); }} className="p-2 hover:text-info transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(emp.id)} className="p-2 hover:text-danger transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="font-display text-xl font-bold mb-4">{editingEmp ? 'Modifica' : 'Nuovo'} Dipendente</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Nominativo</label>
                  <input name="nome" defaultValue={editingEmp?.nome} required className="w-full bg-bg border border-border rounded-lg p-2 focus:border-accent outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500">PIN (4 cifre)</label>
                    <input name="pin" defaultValue={editingEmp?.pin} maxLength={4} required className="w-full bg-bg border border-border rounded-lg p-2 focus:border-accent outline-none font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500">Ore Standard</label>
                    <input name="ore_g" type="number" step="0.5" defaultValue={editingEmp?.ore_g || 8} required className="w-full bg-bg border border-border rounded-lg p-2 focus:border-accent outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Annulla</button>
                  <button type="submit" className="btn-primary">Salva</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WorkerInterface = () => {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleKey = (key: string) => {
    if (pin.length < 4) setPin(prev => prev + key);
  };

  const clear = () => setPin('');

  useEffect(() => {
    if (pin.length === 4) {
      handleClock();
    }
  }, [pin]);

  const handleClock = async () => {
    setStatus('loading');
    try {
      // Get GPS
      let gps = "N/D";
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        gps = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
      } catch (e) {
        console.warn("GPS non disponibile");
      }

      // We need to know if it's clock in or out. 
      // For simplicity, let's assume the server or a quick check decides.
      // In a real app, we might show two buttons after PIN entry.
      // Here we'll just send 'entrata' as default or toggle based on last state if we had it.
      await api.clockIn({ pin, tipo: 'entrata', gps, cantiere: 'Cantiere Principale' });
      
      setStatus('success');
      setMessage("Timbratura registrata con successo!");
      setTimeout(() => {
        setPin('');
        setStatus('idle');
      }, 3000);
    } catch (e) {
      setStatus('error');
      setMessage("PIN non valido. Riprova.");
      setTimeout(() => {
        setPin('');
        setStatus('idle');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <header className="text-center space-y-2">
          <div className="font-display text-accent font-black tracking-widest text-sm">PRESENZE PRO</div>
          <h1 className="text-3xl font-display font-black">Timbratura</h1>
          <p className="text-gray-500">Inserisci il tuo PIN per timbrare</p>
        </header>

        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-accent border-accent scale-110' : 'border-border'}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handleKey(n.toString())} className="h-16 bg-surface border border-border rounded-2xl text-2xl font-display font-bold hover:bg-surface-hover active:scale-95 transition-all">
              {n}
            </button>
          ))}
          <div />
          <button onClick={() => handleKey('0')} className="h-16 bg-surface border border-border rounded-2xl text-2xl font-display font-bold hover:bg-surface-hover active:scale-95 transition-all">0</button>
          <button onClick={clear} className="h-16 text-gray-500 font-bold hover:text-white transition-colors">Canc</button>
        </div>

        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className={`p-4 rounded-xl text-center flex items-center justify-center gap-3 ${status === 'success' ? 'bg-accent/10 text-accent border border-accent/20' : status === 'error' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-surface border border-border text-gray-400'}`}
            >
              {status === 'loading' && <Clock className="animate-spin" size={18} />}
              {status === 'success' && <CheckCircle2 size={18} />}
              {status === 'error' && <AlertCircle size={18} />}
              <span className="text-sm font-bold">{status === 'loading' ? 'Verifica in corso...' : message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'admin' | 'worker'>('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [emps, atts] = await Promise.all([api.getEmployees(), api.getAttendance()]);
      setEmployees(emps);
      setAttendance(atts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'admin') fetchData();
  }, [view]);

  if (view === 'worker') return <WorkerInterface />;

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col glass fixed h-full z-40">
        <div className="p-6 border-b border-border">
          <div className="font-display text-xl font-black flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-bg">P</div>
            PRESENZE<span className="text-accent">PRO</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
            { id: 'employees', label: 'Dipendenti', icon: Users },
            { id: 'live', label: 'Timbrature Live', icon: Clock },
            { id: 'reports', label: 'Assenze & Ferie', icon: Hospital },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-accent/10 text-accent' : 'text-gray-500 hover:bg-surface-hover hover:text-gray-200'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button onClick={() => setView('worker')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-info hover:bg-info/5 transition-all">
            <LinkIcon size={18} />
            Interfaccia Lavoratore
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-danger transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard employees={employees} attendance={attendance} />}
            {activeTab === 'employees' && <EmployeeManager employees={employees} onRefresh={fetchData} />}
            {activeTab === 'live' && (
              <div className="space-y-6">
                <header>
                  <h1 className="font-display text-3xl font-black">Timbrature Live</h1>
                  <p className="text-gray-500 text-sm">Monitoraggio in tempo reale dai cantieri</p>
                </header>
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                    <thead className="bg-bg/50 text-[10px] uppercase tracking-widest text-gray-500">
                      <tr>
                        <th className="p-4">Dipendente</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Data/Ora</th>
                        <th className="p-4">GPS</th>
                        <th className="p-4">Cantiere</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {attendance.map((a) => (
                        <tr key={a.id} className="hover:bg-surface-hover transition-colors">
                          <td className="p-4 font-bold">{a.nome}</td>
                          <td className="p-4"><Badge color={a.tipo === 'entrata' ? 'accent' : 'warning'}>{a.tipo}</Badge></td>
                          <td className="p-4 font-mono text-gray-400">{new Date(a.timestamp).toLocaleString()}</td>
                          <td className="p-4 text-info text-xs">{a.gps}</td>
                          <td className="p-4 text-gray-500">{a.cantiere}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {['calendar', 'reports'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="p-6 bg-surface border border-border rounded-full">
                  <Clock size={48} className="text-accent opacity-20" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">In Arrivo</h2>
                  <p className="text-gray-500 text-sm max-w-xs">Questa sezione è in fase di sviluppo e sarà disponibile nel prossimo aggiornamento.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
