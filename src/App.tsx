import React, { useState, useEffect } from 'react';
import { Clock, LogOut, Users, AlertCircle, Calendar, MapPin, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const supabase = createClient(
  'https://lzgjrxptcblfbfmyleey.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Z2pyeHB0Y2JsZmJmbXlsZWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTE1ODgsImV4cCI6MjA4ODEyNzU4OH0.DrFFUtZ9NDjag7SAegxYkwB1xEOELbmNL4tZhgg50OA'
);

const DIPENDENTI_INIZIALI = [
  { id: 1,  nome: "MARINO MARIA ROSA",     pin: "1001", ore_g: 0.5,  totale_ore: 8 },
  { id: 2,  nome: "DOMINO ENRICA",          pin: "1002", ore_g: 5,    totale_ore: 100 },
  { id: 3,  nome: "FARRUGGIA GIUSEPPINA",   pin: "1003", ore_g: 1.5,  totale_ore: 30 },
  { id: 4,  nome: "MAGGI CONCETTA",         pin: "1004", ore_g: 1.5,  totale_ore: 30 },
  { id: 5,  nome: "CONTICELLI ANGELA",      pin: "1005", ore_g: 1.5,  totale_ore: 30 },
  { id: 6,  nome: "OVECI MARIANNA",         pin: "1006", ore_g: 1.5,  totale_ore: 30 },
  { id: 7,  nome: "LIPARI OSCAR",           pin: "1007", ore_g: 2,    totale_ore: 40 },
  { id: 8,  nome: "RIGGIO DOMENICO",        pin: "1008", ore_g: 2,    totale_ore: 40 },
  { id: 9,  nome: "FERRANTE IGNAZIO",       pin: "1009", ore_g: 2,    totale_ore: 40 },
  { id: 10, nome: "SUCATO ROBERTO",         pin: "1010", ore_g: 2,    totale_ore: 40 },
  { id: 11, nome: "GIULIANO GIUSEPPE",      pin: "1011", ore_g: 0,    totale_ore: 0 },
  { id: 12, nome: "VIOLA CATERINA",         pin: "1012", ore_g: 2,    totale_ore: 40 },
  { id: 13, nome: "PANNIZZO ANTONY",        pin: "1013", ore_g: 6,    totale_ore: 120 },
  { id: 14, nome: "TESTAGROSSA LETIZIA",    pin: "1014", ore_g: 8,    totale_ore: 160 },
  { id: 15, nome: "ARRANNO ELEONORA",       pin: "1015", ore_g: 2,    totale_ore: 32 },
  { id: 16, nome: "BAGNASCO ELEONORA",      pin: "1016", ore_g: 2,    totale_ore: 28 },
  { id: 17, nome: "CANE ROSA",              pin: "1017", ore_g: 2,    totale_ore: 40 },
  { id: 18, nome: "CANNINO CARMELA",        pin: "1018", ore_g: 2,    totale_ore: 38 },
  { id: 19, nome: "CATALDO ROSALIA",        pin: "1019", ore_g: 2,    totale_ore: 36 },
  { id: 20, nome: "PEDALINO FRANCESCO",     pin: "1020", ore_g: 2,    totale_ore: 32 },
  { id: 21, nome: "BATTAGLIA VANESSA",      pin: "1021", ore_g: 1,    totale_ore: 20 },
  { id: 22, nome: "BONOMOLO SALVATORE",     pin: "1022", ore_g: 8,    totale_ore: 160 },
  { id: 23, nome: "BUSCEMI DANIELE",        pin: "1023", ore_g: 8,    totale_ore: 160 },
  { id: 24, nome: "MUHAMMAD ABU ZAID",      pin: "1024", ore_g: 6,    totale_ore: 120 },
  { id: 25, nome: "ALAM MD KHURSHED",       pin: "1025", ore_g: 3,    totale_ore: 60 },
  { id: 26, nome: "BOTTA NICOLA",           pin: "1026", ore_g: 1.75, totale_ore: 29.75 },
  { id: 27, nome: "DONATO GIUSEPPA",        pin: "1027", ore_g: 1.75, totale_ore: 35 },
  { id: 28, nome: "MARANGIO MARIA ASSUNTA", pin: "1028", ore_g: 1.1,  totale_ore: 22 },
  { id: 29, nome: "PATELLA SILVANA",        pin: "1029", ore_g: 1.75, totale_ore: 35 },
  { id: 30, nome: "SARDIGNA FRANCESCO",     pin: "1030", ore_g: 1.1,  totale_ore: 22 },
  { id: 31, nome: "TIBAUDO LOREDANA",       pin: "1031", ore_g: 1.75, totale_ore: 35 },
  { id: 32, nome: "MARTINES GABRIELE",      pin: "1032", ore_g: 8,    totale_ore: 32 },
];

const MESI = [
  { label: "Gennaio 2025",   anno: 2025, mese: 0,  giorni: 31 },
  { label: "Febbraio 2025",  anno: 2025, mese: 1,  giorni: 28 },
  { label: "Marzo 2025",     anno: 2025, mese: 2,  giorni: 31 },
  { label: "Aprile 2025",    anno: 2025, mese: 3,  giorni: 30 },
  { label: "Maggio 2025",    anno: 2025, mese: 4,  giorni: 31 },
  { label: "Giugno 2025",    anno: 2025, mese: 5,  giorni: 30 },
  { label: "Luglio 2025",    anno: 2025, mese: 6,  giorni: 31 },
  { label: "Agosto 2025",    anno: 2025, mese: 7,  giorni: 31 },
  { label: "Settembre 2025", anno: 2025, mese: 8,  giorni: 30 },
  { label: "Ottobre 2025",   anno: 2025, mese: 9,  giorni: 31 },
  { label: "Novembre 2025",  anno: 2025, mese: 10, giorni: 30 },
  { label: "Dicembre 2025",  anno: 2025, mese: 11, giorni: 31 },
  { label: "Gennaio 2026",   anno: 2026, mese: 0,  giorni: 31 },
  { label: "Febbraio 2026",  anno: 2026, mese: 1,  giorni: 28 },
  { label: "Marzo 2026",     anno: 2026, mese: 2,  giorni: 31 },
  { label: "Aprile 2026",    anno: 2026, mese: 3,  giorni: 30 },
  { label: "Maggio 2026",    anno: 2026, mese: 4,  giorni: 31 },
  { label: "Giugno 2026",    anno: 2026, mese: 5,  giorni: 30 },
  { label: "Luglio 2026",    anno: 2026, mese: 6,  giorni: 31 },
  { label: "Agosto 2026",    anno: 2026, mese: 7,  giorni: 31 },
  { label: "Settembre 2026", anno: 2026, mese: 8,  giorni: 30 },
  { label: "Ottobre 2026",   anno: 2026, mese: 9,  giorni: 31 },
  { label: "Novembre 2026",  anno: 2026, mese: 10, giorni: 30 },
  { label: "Dicembre 2026",  anno: 2026, mese: 11, giorni: 31 },
];

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

const CalendarioMensile = ({ dipendente, meseInfo, presenzeMese }: any) => {
  const { giorni, anno, mese } = meseInfo;
  const primoGiorno = new Date(anno, mese, 1).getDay();
  const offset = primoGiorno === 0 ? 6 : primoGiorno - 1;
  const giornoMap: Record<number, { entrata?: string; uscita?: string }> = {};
  presenzeMese
    .filter((p: any) => p.dipendente_id === dipendente.id)
    .forEach((p: any) => {
      const giorno = new Date(p.timestamp).getDate();
      if (!giornoMap[giorno]) giornoMap[giorno] = {};
      if (p.tipo === 'entrata') giornoMap[giorno].entrata = p.timestamp;
      if (p.tipo === 'uscita')  giornoMap[giorno].uscita  = p.timestamp;
    });
  const giorniPresenti = Object.keys(giornoMap).length;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3 gap-2">
        <h4 className="font-bold text-white text-[11px] leading-tight">{dipendente.nome}</h4>
        <span className="text-emerald-400 font-bold text-xs whitespace-nowrap">{giorniPresenti} giorni</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-0.5">
        {['L','M','M','G','V','S','D'].map((g, i) => (
          <div key={i} className="text-center text-[8px] text-slate-600 font-bold py-0.5">{g}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: giorni }, (_, i) => i + 1).map((giorno) => {
          const dow = new Date(anno, mese, giorno).getDay();
          const isWeekend = dow === 0 || dow === 6;
          const presenza = giornoMap[giorno];
          const hasEntrata = !!presenza?.entrata;
          const hasUscita  = !!presenza?.uscita;
          return (
            <div key={giorno}
              className={`aspect-square rounded flex flex-col items-center justify-center cursor-default
                ${isWeekend ? 'bg-slate-800/20 text-slate-700'
                  : hasEntrata && hasUscita ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : hasEntrata ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-slate-800/40 text-slate-600'}`}>
              <span className="text-[7px] opacity-60 leading-none">{giorno}</span>
              {!isWeekend && <span className="text-[8px] leading-none">{hasEntrata && hasUscita ? '✓' : hasEntrata ? '→' : ''}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MappaPresenze = ({ presenze }: { presenze: any[] }) => {
  const conGps = presenze.filter(p => p.latitudine && p.longitudine);
  if (conGps.length === 0) return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
      <MapPin className="mx-auto mb-3 text-slate-600" size={32} />
      <p className="text-slate-500 text-sm">Nessuna timbratura con GPS disponibile</p>
    </div>
  );
  const centro: [number, number] = [
    conGps.reduce((s, p) => s + p.latitudine, 0) / conGps.length,
    conGps.reduce((s, p) => s + p.longitudine, 0) / conGps.length,
  ];
  const iconaEntrata = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  });
  const iconaUscita = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  });
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <MapPin size={16} className="text-emerald-400" />Mappa Timbrature
        </h3>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-400">● Entrata</span>
          <span className="text-rose-400">● Uscita</span>
        </div>
      </div>
      <MapContainer center={centro} zoom={13} style={{ height: '450px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
        {conGps.map((p: any) => (
          <Marker key={p.id} position={[p.latitudine, p.longitudine]} icon={p.tipo === 'entrata' ? iconaEntrata : iconaUscita}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold">{p.nome}</p>
                <p className="capitalize">{p.tipo} — {new Date(p.timestamp).toLocaleString('it-IT')}</p>
                {p.cantiere_nome && <p className="text-blue-600 mt-1">🏗️ {p.cantiere_nome}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDip, setSelectedDip] = useState<any>(null);
  const [adminView, setAdminView] = useState<'lista' | 'calendario' | 'mappa' | 'gestione'>('lista');
  const [meseSelIdx, setMeseSelIdx] = useState(14);
  const [presenze, setPresenze] = useState<any[]>([]);
  const [ultimePresenze, setUltimePresenze] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'entrata' | 'uscita' | null>(null);
  const [gpsError, setGpsError] = useState('');
  const [gpsAttivo, setGpsAttivo] = useState(false);
  const [cantieri, setCantieri] = useState<any[]>([]);
  const [mostraSceltaCantiere, setMostraSceltaCantiere] = useState(false);
  const [tipoTimbraturaPending, setTipoTimbraturaPending] = useState<'entrata' | 'uscita' | null>(null);

  // Gestione dipendenti
  const [dipendenti, setDipendenti] = useState<any[]>(DIPENDENTI_INIZIALI);
  const [editingDip, setEditingDip] = useState<any>(null);
  const [showAddDip, setShowAddDip] = useState(false);
  const [newDip, setNewDip] = useState({ nome: '', pin: '', ore_g: 0, totale_ore: 0 });

  const meseInfo = MESI[meseSelIdx];

  useEffect(() => {
    if (!isAdmin) return;
    const { anno, mese } = meseInfo;
    const dataInizio = new Date(anno, mese, 1).toISOString();
    const dataFine   = new Date(anno, mese + 1, 0, 23, 59, 59).toISOString();
    supabase.from('presenze').select('*')
      .gte('timestamp', dataInizio).lte('timestamp', dataFine)
      .order('timestamp', { ascending: false })
      .then(({ data }) => { if (data) setPresenze(data); });
  }, [isAdmin, meseSelIdx]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from('presenze').select('*')
      .order('timestamp', { ascending: false })
      .then(({ data }) => { if (data) setUltimePresenze(data); });
  }, [isAdmin, presenze]);

  useEffect(() => {
    if (!user || isAdmin) return;
    supabase
      .from('dipendente_cantieri')
      .select('cantiere_id, cantieri(id, nome, indirizzo)')
      .eq('dipendente_id', user.id)
      .then(({ data }) => {
        if (data) {
          const lista = data.map((r: any) => r.cantieri).filter(Boolean);
          setCantieri(lista);
        }
      });
  }, [user]);

  const getPosizioneGPS = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject('GPS non supportato'); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject('Impossibile ottenere la posizione GPS: ' + err.message),
            { enableHighAccuracy: false, timeout: 60000, maximumAge: 300000 }
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const attivaGPS = async () => {
    try {
      await getPosizioneGPS();
      setGpsAttivo(true);
      setGpsError('');
    } catch {
      setGpsAttivo(true);
      setGpsError('GPS non disponibile — la timbratura verrà registrata senza posizione.');
    }
  };

  const timbra = async (tipo: 'entrata' | 'uscita', cantiere: any) => {
    if (!user || loading) return;
    setLoading(true);
    setGpsError('');
    setMostraSceltaCantiere(false);
    let lat = null, lng = null, indirizzo = null;
    try {
      const pos = await getPosizioneGPS();
      lat = pos.lat; lng = pos.lng;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        indirizzo = data.display_name || null;
      } catch { }
    } catch (err: any) { setGpsError(err.toString()); }
    const { error } = await supabase.from('presenze').insert({
      dipendente_id: user.id, nome: user.nome, tipo,
      timestamp: new Date().toISOString(),
      data: new Date().toISOString().split('T')[0],
      latitudine: lat, longitudine: lng, indirizzo,
      cantiere_id: cantiere?.id || null,
      cantiere_nome: cantiere?.nome || null,
    });
    setLoading(false);
    if (!error) { setFeedback(tipo); setTimeout(() => setFeedback(null), 3000); }
    else alert('Errore nella timbratura. Riprova.');
  };

  const getStatoDipendente = (id: number) => {
    const ultima = ultimePresenze.find(p => p.dipendente_id === id);
    return ultima ? ultima.tipo : null;
  };

  const salvaDipendente = () => {
    if (!editingDip) return;
    setDipendenti(prev => prev.map(d => d.id === editingDip.id ? editingDip : d));
    setEditingDip(null);
  };

  const eliminaDipendente = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo dipendente?')) {
      setDipendenti(prev => prev.filter(d => d.id !== id));
    }
  };

  const aggiungiDipendente = () => {
    if (!newDip.nome || !newDip.pin) { alert('Nome e PIN sono obbligatori!'); return; }
    const nuovoId = Math.max(...dipendenti.map(d => d.id)) + 1;
    setDipendenti(prev => [...prev, { ...newDip, id: nuovoId }]);
    setNewDip({ nome: '', pin: '', ore_g: 0, totale_ore: 0 });
    setShowAddDip(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "0000") { setIsAdmin(true); setUser({ nome: "Amministratore" }); return; }
    const trovato = dipendenti.find(d => d.pin === pin);
    if (trovato) { setIsAdmin(false); setUser(trovato); }
    else alert("PIN errato!");
  };

  const handleLogout = () => {
    setUser(null); setPin(''); setSelectedDip(null);
    setAdminView('lista'); setPresenze([]); setGpsAttivo(false);
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!user) return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-black mb-2 text-emerald-400">MEDITERRANEA SRL</h1>
      <p className="text-slate-400 mb-8 text-sm">Inserisci il PIN per accedere</p>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input type="password" placeholder="----"
          className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 text-center text-3xl tracking-[1em] focus:border-emerald-500 outline-none"
          value={pin} onChange={(e) => setPin(e.target.value)} />
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-2xl font-bold transition-all">
          ACCEDI
        </button>
      </form>
    </div>
  );

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (isAdmin) {
    const dipPresentiOggi = new Set(
      presenze.filter(p => p.data === new Date().toISOString().split('T')[0]).map(p => p.dipendente_id)
    ).size;
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black">Dashboard Admin</h1>
            <p className="text-slate-400 text-sm">Controllo Cantieri</p>
          </div>
          <button onClick={handleLogout} className="p-2 bg-slate-800 rounded-lg"><LogOut size={20} /></button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title="Dipendenti Totali" subtitle={dipendenti.length} icon={Users} color="bg-blue-500" />
          <Card title="Presenti Oggi" subtitle={dipPresentiOggi} icon={AlertCircle} color="bg-emerald-500" />
          <Card title="Timbrature Mese" subtitle={presenze.length} icon={Clock} color="bg-violet-500" />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(['lista','calendario','mappa','gestione'] as const).map(v => (
            <button key={v} onClick={() => setAdminView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminView === v ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {v === 'lista' ? '👥 Lista' : v === 'calendario' ? '📅 Calendari' : v === 'mappa' ? '🗺️ Mappa GPS' : '⚙️ Gestione'}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 text-sm">Mese:</span>
            <select value={meseSelIdx} onChange={(e) => setMeseSelIdx(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-emerald-500 cursor-pointer">
              {MESI.map((m, i) => <option key={i} value={i}>{m.label}</option>)}
            </select>
          </div>
        </div>

        {/* LISTA */}
        {adminView === 'lista' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">PIN</th>
                  <th className="p-4">Ultima Timbratura</th>
                  <th className="p-4">Cantiere</th>
                  <th className="p-4">Stato</th>
                  <th className="p-4">Dettaglio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dipendenti.map(d => {
                  const stato = getStatoDipendente(d.id);
                  const ultimaRec = ultimePresenze.find(p => p.dipendente_id === d.id);
                  return (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-slate-500 text-xs">{d.id}</td>
                      <td className="p-4 font-bold text-xs">{d.nome}</td>
                      <td className="p-4 text-emerald-400 font-mono text-xs">{d.pin}</td>
                      <td className="p-4 text-slate-400 text-xs">
                        {ultimaRec ? new Date(ultimaRec.timestamp).toLocaleString('it-IT') : '—'}
                      </td>
                      <td className="p-4 text-xs text-blue-400">{ultimaRec?.cantiere_nome || '—'}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                          stato === 'entrata' ? 'bg-emerald-500/20 text-emerald-400' :
                          stato === 'uscita'  ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-800 text-slate-500'}`}>
                          {stato === 'entrata' ? '● In Servizio' : stato === 'uscita' ? '○ Uscito' : 'Offline'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => { setSelectedDip(d); setAdminView('calendario'); }}
                          className="text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-1 rounded transition-colors">
                          Vedi →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CALENDARI */}
        {adminView === 'calendario' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-base font-bold">Presenze — {meseInfo.label}</h3>
              {selectedDip && (
                <button onClick={() => setSelectedDip(null)}
                  className="ml-auto text-[11px] bg-slate-800 text-slate-400 hover:bg-slate-700 px-3 py-1 rounded-lg">
                  ← Tutti
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {(selectedDip ? [selectedDip] : dipendenti).map(d => (
                <CalendarioMensile key={d.id} dipendente={d} meseInfo={meseInfo} presenzeMese={presenze} />
              ))}
            </div>
          </div>
        )}

        {/* MAPPA */}
        {adminView === 'mappa' && <MappaPresenze presenze={presenze} />}

        {/* GESTIONE DIPENDENTI */}
        {adminView === 'gestione' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">⚙️ Gestione Dipendenti</h3>
              <button onClick={() => setShowAddDip(!showAddDip)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                <Plus size={16} /> Nuovo Dipendente
              </button>
            </div>

            {/* Form nuovo dipendente */}
            {showAddDip && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4">
                <h4 className="font-bold mb-3 text-emerald-400">➕ Aggiungi Dipendente</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input placeholder="Nome completo" value={newDip.nome}
                    onChange={e => setNewDip({...newDip, nome: e.target.value.toUpperCase()})}
                    className="col-span-2 p-2 bg-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                  <input placeholder="PIN (es. 1033)" value={newDip.pin}
                    onChange={e => setNewDip({...newDip, pin: e.target.value})}
                    className="p-2 bg-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                  <input placeholder="Ore/giorno" type="number" value={newDip.ore_g}
                    onChange={e => setNewDip({...newDip, ore_g: Number(e.target.value)})}
                    className="p-2 bg-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={aggiungiDipendente}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                    <Save size={14} /> Salva
                  </button>
                  <button onClick={() => setShowAddDip(false)}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-all">
                    <X size={14} /> Annulla
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Nome</th>
                    <th className="p-4">PIN</th>
                    <th className="p-4">Ore/Giorno</th>
                    <th className="p-4">Ore Totali</th>
                    <th className="p-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {dipendenti.map(d => (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-slate-500 text-xs">{d.id}</td>
                      <td className="p-4">
                        {editingDip?.id === d.id ? (
                          <input value={editingDip.nome}
                            onChange={e => setEditingDip({...editingDip, nome: e.target.value.toUpperCase()})}
                            className="w-full p-1 bg-slate-700 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                        ) : <span className="font-bold text-xs">{d.nome}</span>}
                      </td>
                      <td className="p-4">
                        {editingDip?.id === d.id ? (
                          <input value={editingDip.pin}
                            onChange={e => setEditingDip({...editingDip, pin: e.target.value})}
                            className="w-20 p-1 bg-slate-700 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                        ) : <span className="text-emerald-400 font-mono text-xs">{d.pin}</span>}
                      </td>
                      <td className="p-4">
                        {editingDip?.id === d.id ? (
                          <input type="number" value={editingDip.ore_g}
                            onChange={e => setEditingDip({...editingDip, ore_g: Number(e.target.value)})}
                            className="w-20 p-1 bg-slate-700 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                        ) : <span className="text-xs">{d.ore_g}h</span>}
                      </td>
                      <td className="p-4">
                        {editingDip?.id === d.id ? (
                          <input type="number" value={editingDip.totale_ore}
                            onChange={e => setEditingDip({...editingDip, totale_ore: Number(e.target.value)})}
                            className="w-20 p-1 bg-slate-700 rounded text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                        ) : <span className="text-xs">{d.totale_ore}h</span>}
                      </td>
                      <td className="p-4">
                        {editingDip?.id === d.id ? (
                          <div className="flex gap-1">
                            <button onClick={salvaDipendente}
                              className="p-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded transition-colors">
                              <Save size={14} />
                            </button>
                            <button onClick={() => setEditingDip(null)}
                              className="p-1 bg-slate-700 text-slate-400 hover:bg-slate-600 rounded transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => setEditingDip({...d})}
                              className="p-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => eliminaDipendente(d.id)}
                              className="p-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── DIPENDENTE ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold">{user.nome}</h2>
        <button onClick={handleLogout} className="p-2 bg-slate-800 rounded-lg"><LogOut size={20} /></button>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-2xl text-center font-bold text-lg
          ${feedback === 'entrata' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
          ✓ {feedback === 'entrata' ? 'Entrata registrata!' : 'Uscita registrata!'}
          <p className="text-sm font-normal mt-1 opacity-70">{new Date().toLocaleTimeString('it-IT')}</p>
        </div>
      )}

      {gpsError && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
          ⚠️ {gpsError}
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6 flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-xs mb-1">Ore contrattuali/giorno</p>
          <p className="text-emerald-400 font-black text-2xl">{user.ore_g}h</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-1">Ore totali</p>
          <p className="text-white font-bold text-lg">{user.totale_ore}h</p>
        </div>
      </div>

      {!gpsAttivo && (
        <div className="mb-6">
          <button onClick={attivaGPS}
            className="w-full p-4 bg-blue-500/20 border-2 border-blue-500/40 hover:bg-blue-500/30 rounded-2xl text-blue-400 font-bold text-lg transition-all flex items-center justify-center gap-3">
            <MapPin size={24} />ATTIVA POSIZIONE GPS
          </button>
          <p className="text-center text-slate-500 text-xs mt-2">Necessario per registrare la posizione alla timbratura</p>
        </div>
      )}

      {gpsAttivo && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
          <MapPin size={14} /> Posizione GPS attiva ✓
        </div>
      )}

      {mostraSceltaCantiere && (
        <div className="mb-6 bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <h3 className="font-bold text-white mb-3 text-center">
            {tipoTimbraturaPending === 'entrata' ? '🟢 ENTRATA' : '🔴 USCITA'} — Scegli il cantiere
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cantieri.map(c => (
              <button key={c.id} onClick={() => timbra(tipoTimbraturaPending!, c)}
                className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-left transition-colors">
                <p className="font-bold text-white text-sm">{c.nome}</p>
                {c.indirizzo && <p className="text-slate-400 text-xs">{c.indirizzo}</p>}
              </button>
            ))}
          </div>
          <button onClick={() => setMostraSceltaCantiere(false)}
            className="w-full mt-3 p-2 text-slate-500 text-sm hover:text-slate-300">
            Annulla
          </button>
        </div>
      )}

      {!mostraSceltaCantiere && (
        <div className="space-y-4">
          <button
            onClick={() => { setTipoTimbraturaPending('entrata'); setMostraSceltaCantiere(true); }}
            disabled={loading}
            className="w-full h-36 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-[2rem] font-black text-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
            {loading ? '📍 Registrazione...' : 'ENTRATA'}
          </button>
          <button
            onClick={() => { setTipoTimbraturaPending('uscita'); setMostraSceltaCantiere(true); }}
            disabled={loading}
            className="w-full h-36 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 rounded-[2rem] font-black text-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">
            {loading ? '📍 Registrazione...' : 'USCITA'}
          </button>
        </div>
      )}

      <p className="text-center text-slate-600 text-xs mt-6 flex items-center justify-center gap-1">
        <MapPin size={10} /> La posizione GPS viene registrata ad ogni timbratura
      </p>
    </div>
  );
}