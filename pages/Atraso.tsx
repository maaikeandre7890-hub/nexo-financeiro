
import React from 'react';
import { useApp } from '../contexts/AppContext';

const Atraso: React.FC = () => {
  const { state, totals, markAsPaid } = useApp();
  const overdueItems = state.receivables.filter(r => r.status === 'Atrasado');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-xl shadow-rose-500/5">
          <i className="fa-solid fa-triangle-exclamation text-rose-500 text-3xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight italic">Parcelas em Atraso</h1>
          <p className="text-slate-500 font-medium italic">Faturas vencidas que necessitam de cobrança imediata ou renegociação.</p>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border-rose-500/20 p-10 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-rose-500/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 text-center md:text-left">
           <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-2">Exposição ao Risco</p>
           <div className="text-5xl md:text-6xl font-black text-white mono tracking-tighter">R$ {totals.overdue.toLocaleString()}</div>
           <p className="text-slate-500 mt-4 font-bold text-sm italic">Valor total acumulado em <span className="text-rose-400">{overdueItems.length} faturas</span> vencidas.</p>
        </div>
        <button className="relative z-10 bg-rose-500 hover:bg-rose-400 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-2xl shadow-rose-500/30 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs">
          <i className="fa-solid fa-comments-dollar"></i>
          Iniciar Régua de Cobrança
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Listagem de Inadimplência</h3>
        <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
           {overdueItems.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-900/50 border-b border-slate-800/50">
                     <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Cliente</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Vencido em</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Valor</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/30">
                   {overdueItems.map(rec => (
                     <tr key={rec.id} className="hover:bg-rose-500/[0.02] transition-colors">
                       <td className="px-8 py-6 font-bold text-white">{rec.clientName}</td>
                       <td className="px-8 py-6 text-rose-400 text-xs font-black">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</td>
                       <td className="px-8 py-6 text-white font-black mono">R$ {rec.amount.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right">
                         <button 
                           onClick={() => markAsPaid(rec.id)}
                           className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline"
                         >
                           Registrar Baixa
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <div className="p-20 text-center text-slate-600 italic">
               Nenhuma parcela em atraso no momento. Parabéns pela gestão!
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Atraso;
