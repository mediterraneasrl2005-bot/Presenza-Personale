import React, { useState, useEffect } from 'react';
import { MapPin, Clock, LogOut, CheckCircle2 } from 'lucide-react';
import datiDipendenti from './dipendenti.json';

export default function App() {
  const [user, setUser] = useState<any>(null); // Stato per l'utente loggato
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('Pronto');

  // Funzione di Login col PIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trovato = datiDipendenti.find(d => d.pin === pin);
    if (trovato) {
      setUser(trovato);
    } else {
      alert("PIN errato!");
    }
  };

  // Se l'utente non è loggato, vede la lista nomi e inserimento PIN
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8 text-accent">Accesso Dipendenti</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <input 
            type="password" 
            placeholder="Inserisci il tuo PIN" 
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-center text-2xl tracking-widest"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button type="submit" className="w-full bg-accent p-4 rounded-xl font-bold">ENTRA</button>
        </form>
      </div>
    );
  }

  // --- INTERFACCIA CHE VEDE IL DIPENDENTE DOPO IL LOGIN ---
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-slate-400 text-sm">Bentornato,</p>
          <h2 className="text-xl font-bold">{user.nome}</h2>
        </div>
        <button onClick={() => setUser(null)} className="p-2 bg-slate-800 rounded-lg"><LogOut size={20}/></button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <button 
          onClick={() => setStatus('Entrata Registrata')}
          className="h-32 bg-emerald-500 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Clock size={32}/>
          <span className="text-xl font-black">ENTRATA</span>
        </button>

        <button 
          onClick={() => setStatus('Uscita Registrata')}
          className="h-32 bg-rose-500 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
        >
          <LogOut size={32}/>
          <span className="text-xl font-black">USCITA</span>
        </button>
      </div>

      <div className="mt-10 p-6 bg-slate-800 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-accent" size={18}/>
          <span className="text-sm font-bold text-slate-300">Stato GPS:</span>
        </div>
        <p className="text-emerald-400 font-mono text-sm">{status}</p>
      </div>
    </div>
  );
}
