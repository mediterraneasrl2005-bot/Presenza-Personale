import React, { useState } from 'react';
import { MapPin, Clock, LogOut, Users, LayoutDashboard, AlertCircle } from 'lucide-react';
import datiDipendenti from './dipendenti.json';

// --- Componente Card per la tua Dashboard ---
const Card = ({ title, subtitle, icon: Icon, color }: any) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-1 ${color}`} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-white">{subtitle}</h3>
      </div>
      <Icon className="text-slate-500" size={20} />
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- IL TUO PIN DA AMMINISTRATORE ---
    if (pin === "0000") { 
      setIsAdmin(true);
      setUser({ nome: "Amministratore" });
      return;
    }

    // --- PIN DEI DIPENDENTI ---
    const trovato = datiDipendenti.find(d => d.pin === pin);
    if (trovato) {
      setIsAdmin(false);
      setUser(trovato);
    } else {
      alert("PIN errato!");
    }
  };

  // 1. SCHERMATA DI LOGIN (Quella che vedi all'inizio)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-2 text-emerald-400">MEDITERRANEA SRL</h1>
        <p className="text-slate-400 mb-8 text-sm">Inserisci il PIN per accedere</p>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <input 
            type="password" 
            placeholder="----" 
            className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 text-center text-3xl tracking-[1em] focus:border-emerald-500 outline-none"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-2xl font-bold transition-all">ACCEDI</button>
        </form>
      </div>
    );
  }

  // 2. TUA DASHBOARD (Se inserisci il PIN 0000)
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black">Dashboard Admin</h1>
            <p className="text-slate-400 text-sm">Controllo Cantieri</p>
          </div>
          <button onClick={() => {setUser(null); setPin('');}} className="p-2 bg-slate-800 rounded-lg"><LogOut size={20}/></button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title="Dipendenti" subtitle={datiDipendenti.length} icon={Users} color="bg-blue-500" />
          <Card title="Ore Totali" subtitle="1.240h" icon={Clock} color="bg-emerald-500" />
          <Card title="Allarmi" subtitle="0" icon={AlertCircle} color="bg-rose-500" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase">
               <tr>
                 <th className="p-4">Nome</th>
                 <th className="p-4">PIN</th>
                 <th className="p-4">Stato</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-800">
               {datiDipendenti.slice(0, 10).map(d => (
                 <tr key={d.nome}>
                   <td className="p-4 font-bold">{d.nome}</td>
                   <td className="p-4 text-emerald-400 font-mono">{d.pin}</td>
                   <td className="p-4"><span className="text-[10px] bg-slate-800 px-2 py-1 rounded">Offline</span></td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    );
  }

  // 3. INTERFACCIA DIPENDENTE (Se inseriscono il loro PIN)
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold italic">{user.nome}</h2>
        <button onClick={() => {setUser(null); setPin('');}} className="p-2 bg-slate-800 rounded-lg"><LogOut size={20}/></button>
      </div>
      <div className="space-y-6">
        <button className="w-full h-40 bg-emerald-500 rounded-[2rem] font-black text-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">ENTRATA</button>
        <button className="w-full h-40 bg-rose-500 rounded-[2rem] font-black text-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-transform">USCITA</button>
      </div>
    </div>
  );
}
