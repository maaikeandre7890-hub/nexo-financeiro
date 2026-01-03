
import React from 'react';
import { useApp } from '../contexts/AppContext';

const Atraso: React.FC = () => {
  const { state, totals, markAsPaid } = useApp();
  const overdueItems = state.receivables.filter(r => r.status === 'Atrasado');

  return (
    <div className="space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
             <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em]">Alerta de Inadimplência</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Em <br/><span className="text-rose-600">Atraso.</span></h1>
        </div>
      </div>

      <div className="glass-card rounded-[4rem] border-rose-500/10 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-br from-rose-500/[0.03] to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-4">
           <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Montante Exposto ao Risco</p>
           <div className="text-6xl md:text-8xl font-black text-white mono tracking-tighter italic">R$ {totals.overdue.toLocaleString()}</div>
           <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
             <span className="text-rose-400">{overdueItems.length}</span> títulos com vencimento expirado
           </p>
        </div>
        <button className="relative z-10 w-full md:w-auto px-12 py-6 bg-rose-500 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-rose-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4">
          <i className="fa-solid fa-comments-dollar"></i>
          Iniciar Cobrança Ativa
        </button>
      </div>

      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden border-rose-500/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Identidade</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Data de Vencimento</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Valor Principal</th>
              <th className="px-12 py-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {overdueItems.map(rec => (
              <tr key={rec.id} className="hover:bg-rose-500/[0.01] transition-all group">
                <td className="px-12 py-10">
                   <p className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{rec.clientName}</p>
                   <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-1">Nível de Risco: Alto</p>
                </td>
                <td className="px-12 py-10">
                  <span className="text-sm font-black text-rose-400 mono italic">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-12 py-10">
                  <span className="text-xl font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
                </td>
                <td className="px-12 py-10 text-right">
                  <button onClick={() => markAsPaid(rec.id)} className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] hover:text-white transition-colors">Marcar como Pago</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {overdueItems.length === 0 && (
          <div className="py-24 text-center opacity-30 italic">Nenhum título em atraso. Excelente gestão.</div>
        )}
      </div>

      <div className="md:hidden space-y-6">
        {overdueItems.map(rec => (
          <div key={rec.id} className="glass-card p-8 rounded-[3rem] border-rose-500/10 space-y-6">
            <div className="flex justify-between items-center">
               <h4 className="font-black text-white text-base tracking-tight">{rec.clientName}</h4>
               <span className="text-[9px] text-rose-500 font-black uppercase">Vencido</span>
            </div>
            <div className="flex justify-between items-center bg-rose-500/5 p-6 rounded-[2rem] border border-rose-500/10">
               <span className="text-xs font-black text-rose-400 mono">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
               <span className="text-lg font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => markAsPaid(rec.id)} 
              className="w-full py-5 bg-white text-black font-black rounded-[2rem] text-[10px] uppercase tracking-widest shadow-lg"
            >
              Baixar Título
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Atraso;
