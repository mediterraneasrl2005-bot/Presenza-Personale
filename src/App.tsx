// Sostituisci la tabella dentro "if (isAdmin)" con questa:
<div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
  <table className="w-full text-left text-sm">
    <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase">
      <tr>
        <th className="p-4">Nome Dipendente</th>
        <th className="p-4">PIN</th>
        <th className="p-4">Ore Totali (Feb)</th>
        <th className="p-4">Stato Oggi</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-800">
      {datiDipendenti.map(d => (
        <tr key={d.nome} className="hover:bg-slate-800/30">
          <td className="p-4 font-bold">{d.nome}</td>
          <td className="p-4 text-emerald-400 font-mono">{d.pin}</td>
          <td className="p-4">
            <span className="text-white font-bold">{d.totale_ore || 0}h</span>
          </td>
          <td className="p-4">
            <span className={`text-[10px] px-2 py-1 rounded ${d.nome === user.nome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {d.nome === user.nome ? 'In Servizio' : 'Offline'}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* --- NUOVA SEZIONE CALENDARIO --- */}
<div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
    <CalendarIcon size={20} className="text-emerald-400"/> 
    Riepilogo Presenze Febbraio 2026
  </h3>
  <p className="text-slate-400 text-xs mb-4">Visualizzazione delle ore giornaliere caricate dal sistema.</p>
  {/* Qui il codice genererà la griglia 1-28 come nel tuo PDF */}
</div>
