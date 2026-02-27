import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// --- Componenti di Utilità ---
const Badge = ({ children, color = 'accent' }: { children: React.ReactNode, color?: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${color}/10 text-${color} border border-${color}/20`}>
    {children}
  </span>
);

const Card = ({ title, subtitle, icon: Icon, color = 'accent' }: any) => (
  <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-1 bg-${color}`} />
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="font-display text-2xl font-extrabold">{subtitle}</h3>
      </div>
      {Icon && <Icon className="opacity-50" size={20} />}
    </div>
  </div>
);

// --- Componente Principale ---
export default function App() {
    const [employees, setEmployees] = useState<Employee[]>(datiDipendenti);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmp, setEditingEmp] = useState<Partial<Employee> | null>(null);

    // Carica i dati iniziali
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const att = await api.getAttendance();
            setAttendance(att);
        } catch (error) {
            console.error("Errore nel caricamento presenze:", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = {
            ...editingEmp,
            nome: (form.nome as any).value,
            pin: (form.pin as any).value,
            ore_g: parseFloat((form.ore_g as any).value),
        };
        // Qui andrebbe la chiamata API per salvare, per ora aggiorniamo lo stato locale
        setIsModalOpen(false);
        setEditingEmp(null);
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-display text-3xl font-black">MEDITERRANEA SRL</h1>
                    <p className="text-gray-500">Gestione Presenze Febbraio 2026</p>
                </div>
                <button 
                    onClick={() => { setEditingEmp(null); setIsModalOpen(true); }}
                    className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Nuovo Dipendente
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title="Dipendenti Totali" subtitle={employees.length} icon={Users} color="blue-500" />
                <Card title="Ore Totali Mese" subtitle="1.240h" icon={Clock} color="green-500" />
                <Card title="Assenze Oggi" subtitle="4" icon={AlertCircle} color="red-500" />
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-[10px] uppercase tracking-widest text-gray-500">
                        <tr>
                            <th className="p-4">Nominativo</th>
                            <th className="p-4">PIN</th>
                            <th className="p-4">Ore/Giorno</th>
                            <th className="p-4 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-muted/50 transition-colors">
                                <td className="p-4 font-bold">{emp.nome}</td>
                                <td className="p-4 font-mono text-accent">{emp.pin || '----'}</td>
                                <td className="p-4 text-gray-400">{emp.ore_g || 8}h</td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => { setEditingEmp(emp); setIsModalOpen(true); }} className="p-2 hover:text-blue-500">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal per Nuovo/Modifica */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="font-display text-xl font-bold mb-4">{editingEmp ? 'Modifica' : 'Nuovo'} Dipendente</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">Nominativo</label>
                                    <input name="nome" defaultValue={editingEmp?.nome} required className="w-full bg-background border border-border rounded-lg p-2 outline-none focus:border-accent" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">PIN</label>
                                        <input name="pin" defaultValue={editingEmp?.pin} maxLength={4} className="w-full bg-background border border-border rounded-lg p-2 font-mono" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-gray-500 mb-1">Ore Standard</label>
                                        <input name="ore_g" type="number" step="0.5" defaultValue={editingEmp?.ore_g || 8} className="w-full bg-background border border-border rounded-lg p-2" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Annulla</button>
                                    <button type="submit" className="bg-accent text-white px-4 py-2 rounded-lg">Salva</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
