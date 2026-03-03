import React, { useState } from 'react';
import { Clock, LogOut, Users, AlertCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// --- DATI DIPENDENTI (in attesa del tuo dipendenti.json) ---
const datiDipendenti = [
  { nome: "MARINO MARIA ROSA",    pin: "1001", ore: [8,8,0,8,8,0,0,8,8,8,0,8,8,0,0,8,8,8,0,8,8,0,0,8,8,8,0,8] },
  { nome: "DOMINO ENRICA",        pin: "1002", ore: [8,0,8,8,8,0,0,8,0,8,8,8,0,0,8,8,8,0,8,8,0,0,8,8,0,8,8,0] },
  { nome: "FARRUGGIA GIUSEPPINA", pin: "1003", ore: [8,8,8,0,8,0,0,8,8,0,8,8,8,0,0,8,8,8,8,0,0,0,8,8,8,8,0,8] },
  { nome: "MAGGI CONCETTA",       pin: "1004", ore: [8,8,8,8,0,0,0,8,8,8,8,0,0,0,8,8,8,8,8,0,0,8,8,8,8,0,8,8] },
  { nome: "CONTICELLI ANGELA",    pin: "1005", ore: [0,8,8,8,8,0,0,0,8,8,8,8,0,0,8,8,0,8,8,8,0,8,8,0,8,8,8,0] },
  { nome: "OVECI MARIANNA",       pin: "1006", ore: [8,8,0,8,8,0,0,8,8,8,0,8,8,0,8,8,8,8,0,0,0,8,8,8,8,8,0,8] },
  { nome: "LIPARI OSCAR",         pin: "1007", ore: [8,8,8,8,8,0,0,8,8,8,8,8,0,0,8,8,8,8,8,0,0,8,8,8,8,8,0,0] },
  { nome: "RIGGIO DOMENICO",      pin: "1008", ore: [8,0,8,8,8,0,0,8,8,8,8,8,0,0,0,8,8,8,8,8,0,8,8,8,8,0,8,8] },
  { nome: "FERRANTE IGNAZIO",     pin: "1009", ore: [8,8,8,8,8,0,0,8,8,8,8,8,0,0,8,8,8,8,8,0,0,8,8,8,8,8,0,8] },
  { nome: "SUCATO ROBERTO",       pin: "1010", ore: [8,8,8,0,8,0,0,8,8,0,8,8,8,0,8,8,8,8,0,8,0,8,8,8,0,8,8,8] },
];

// --- Card Statistica ---
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

// --- Calendario Mensile per Dipendente ---
const CalendarioFebbraio = ({ dipendente }: { dipendente: any }) => {
  const giorni = Array.from({ length: 28 }, (_, i) => i + 1);
  // 1 Feb 2026 è Domenica → offset 0
  const primoGiornoOffset = 6; // 0=Lun ... 6=Dom

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-white text-sm">{dipendente.nome}</h4>
        <span className="text-emerald-400 font-bold text-sm">
          {dipendente.ore.reduce((a: number, b: number) => a + b, 0)}h totali
        </span>
      </div>
      {/* Header giorni settimana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['L','M','M','G','V','S','D'].map((g, i) => (
          <div key={i} className="text-center text-[9px] text-slate-500 font-bold py-1">{g}</div>
        ))}
      </div>
      {/* Griglia giorni */}
      <div className="grid grid-cols-7 gap-1">
        {/* Celle vuote offset */}
        {Array.from({ length: primoGiornoOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Giorni del mese */}
        {giorni.map((giorno) => {
          const ore = dipendente.ore[giorno - 1] ?? 0;
          const isWeekend = (giorno + primoGiornoOffset - 1) % 7 >= 5;
          const hasOre = ore > 0;
          return (
            <div
              key={giorno}
              title={`${giorno} Feb: ${ore}h`}
              className={`
                aspect-square rounded-md flex flex-col items-center justify-center text-[9px] font-bold cursor-default transition-all
                ${isWeekend ? 'bg-slate-800/30 text-slate-600' : 
                  hasOre ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                  'bg-rose-500/10 text-rose-500/60 border border-rose-500/20'}
              `}
            >
              <span className="text-[8px] opacity-60">{giorno}</span>
              {!isWeekend && <span>{ore > 0 ? `${ore}h` : '—'}</span>}
            </div>
          );
        })}
      </div>
      {/* Legenda */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
          <span className="text-[9px] text-slate-500">Presente</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-rose-500/10 border border-rose-500/20" />
          <span className="text-[9px] text-slate-500">Assente</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-slate-800/30" />
          <span className="text-[9px] text-slate-500">Weekend</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDip, setSelectedDip] = useState<any>(null);
  const [adminView, setAdminView] = useState<'lista' | 'calendario'>('lista');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "0000") {
      setIsAdmin(true);
      setUser({ nome: "Amministratore" });
      return;
    }
    const trovato = datiDipendenti.find(d => d.pin === pin);
    if (trovato) {
      setIsAdmin(false);
      setUser(trovato);
    } else {
      alert("PIN errato!");
    }
  };

  const totaleOreGenerale = datiDipendenti.reduce((sum, d) => 
    sum + d.ore.reduce((a, b) => a + b, 0), 0
  );

  // ─── LOGIN ───────────────────────────────────────────────
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
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-2xl font-bold transition-all">
            ACCEDI
          </button>
        </form>
      </div>
    );
  }

  // ─── DASHBOARD ADMIN ─────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black">Dashboard Admin</h1>
            <p className="text-slate-400 text-sm">Controllo Cantieri</p>
          </div>
          <button onClick={() => { setUser(null); setPin(''); setSelectedDip(null); }} className="p-2 bg-slate-800 rounded-lg">
            <LogOut size={20} />
          </button>
        </header>

        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title="Dipendenti" subtitle={datiDipendenti.length} icon={Users} color="bg-blue-500" />
          <Card title="Ore Totali (Feb)" subtitle={`${totaleOreGenerale}h`} icon={Clock} color="bg-emerald-500" />
          <Card title="Allarmi" subtitle="0" icon={AlertCircle} color="bg-rose-500" />
        </div>

        {/* Tab Switch */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAdminView('lista')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminView === 'lista' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Users size={14} className="inline mr-2" />Lista Dipendenti
          </button>
          <button
            onClick={() => setAdminView('calendario')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminView === 'calendario' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Calendar size={14} className="inline mr-2" />Calendari Presenze
          </button>
        </div>

        {/* ── VISTA LISTA ── */}
        {adminView === 'lista' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase">
                <tr>
                  <th className="p-4">Nome Dipendente</th>
                  <th className="p-4">PIN</th>
                  <th className="p-4">Ore Totali (Feb)</th>
                  <th className="p-4">Stato Oggi</th>
                  <th className="p-4">Dettaglio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {datiDipendenti.map(d => {
                  const totOre = d.ore.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={d.nome} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold">{d.nome}</td>
                      <td className="p-4 text-emerald-400 font-mono">{d.pin}</td>
                      <td className="p-4">
                        <span className="text-white font-bold">{totOre}h</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-1 rounded">
                          Offline
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => { setSelectedDip(d); setAdminView('calendario'); }}
                          className="text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-1 rounded transition-colors"
                        >
                          Vedi Calendario →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── VISTA CALENDARI ── */}
        {adminView === 'calendario' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold">Riepilogo Presenze — Febbraio 2026</h3>
              {selectedDip && (
                <button
                  onClick={() => setSelectedDip(null)}
                  className="ml-auto text-[11px] bg-slate-800 text-slate-400 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Mostra tutti
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(selectedDip ? [selectedDip] : datiDipendenti).map(d => (
                <CalendarioFebbraio key={d.nome} dipendente={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── INTERFACCIA DIPENDENTE ───────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold italic">{user.nome}</h2>
        <button onClick={() => { setUser(null); setPin(''); }} className="p-2 bg-slate-800 rounded-lg">
          <LogOut size={20} />
        </button>
      </div>

      {/* Riepilogo ore del mese per il dipendente */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Le tue ore — Febbraio 2026</span>
          <span className="text-emerald-400 font-black text-xl">
            {user.ore?.reduce((a: number, b: number) => a + b, 0) ?? 0}h
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <button className="w-full h-40 bg-emerald-500 rounded-[2rem] font-black text-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">
          ENTRATA
        </button>
        <button className="w-full h-40 bg-rose-500 rounded-[2rem] font-black text-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-transform">
          USCITA
        </button>
      </div>
    </div>
  );
}
