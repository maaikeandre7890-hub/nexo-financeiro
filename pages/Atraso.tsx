
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const Atraso: React.FC = () => {
  const { state, totals, markAsPaid, formatNumber } = useApp();
  const navigate = useNavigate();
  
  const overdueItems = state.receivables.filter(r => 
    r.status === 'Atrasado' || (r.status === 'Pendente' && r.dueDate < new Date().toISOString().split('T')[0])
  );

  const handleBaixar = (id: string) => {
    markAsPaid(id, 'PIX');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 md:space-y-12 py-4 md:py-6 page-enter pb-20">
      <div className="space-y-3 px-2 md:px-0">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Alerta de Risco</span>
         </div>
         <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
            Em <br className="hidden md:block"/><span className="text-rose-600">Atraso.</span>
         </h1>
      </div>

      <div className="glass-card p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-rose-500/[0.05] to-transparent relative overflow-hidden">
        <div className="relative z-10 space-y-2 md:space-y-4 text-center md:text-left">
           <p className="text-[9px] md:text-[10px] font-black text-rose-400 uppercase tracking-widest">Exposição Mensal</p>
           <div className="text-4xl md:text-8xl font-black text-white mono tracking-tighter italic">R$ {formatNumber(totals.overdue)}</div>
           <p className="text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest italic">
             {overdueItems.length} títulos pendentes no período
           </p>
        </div>
        <button className="relative z-10 w-full md:w-auto px-10 py-4 md:py-6 bg-rose-500 text-white rounded-xl md:rounded-[2.5rem] font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 flex items-center justify-center gap-3">
          <i className="fa-solid fa-comments-dollar"></i>
          Cobrar Todos
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-1">
        {overdueItems.map(rec => (
          <div key={rec.id} className="glass-card p-5 space-y-4 border-rose-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">{rec.clientName}</h4>
                <p className="text-[10px] font-bold text-rose-500 mono">Vencido: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white mono">R$ {formatNumber(rec.amount)}</p>
              </div>
            </div>
            <button 
              onClick={() => handleBaixar(rec.id)}
              className="w-full py-3 bg-white/[0.03] border border-white/10 text-emerald-500 font-black text-[10px] uppercase rounded-xl tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
            >
              Confirmar Recebimento
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden border-rose-500/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Identidade</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Vencimento</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Valor Principal</th>
              <th className="px-12 py-8 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {overdueItems.map(rec => (
              <tr key={rec.id} className="hover:bg-rose-500/[0.01] transition-all group">
                <td className="px-12 py-10">
                   <p className="font-black text-white text-lg tracking-tight">{rec.clientName}</p>
                   <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-1">Risco Ativo</p>
                </td>
                <td className="px-12 py-10">
                  <span className="text-sm font-black text-rose-400 mono italic">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-12 py-10">
                  <span className="text-xl font-black text-white mono">R$ {formatNumber(rec.amount)}</span>
                </td>
                <td className="px-12 py-10 text-right">
                  <button onClick={() => handleBaixar(rec.id)} className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] hover:text-white transition-colors">Confirmar Recebimento</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Atraso;
