import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.tsx';

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
    <div className="space-y-12 py-6 page-enter pb-20">
      <div className="space-y-4">
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em]">Protocolo de Risco Ativo</span>
         </div>
         <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-none">
            Capital em <br/><span className="text-rose-600 underline decoration-rose-600/30 underline-offset-8">Exposição.</span>
         </h1>
      </div>

      <div className="glass-card p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-rose-500/[0.08] to-transparent border-rose-500/20 relative overflow-hidden rounded-[4rem] shadow-2xl">
        <div className="relative z-10 space-y-4 text-center md:text-left">
           <p className="text-[11px] font-black text-rose-400 uppercase tracking-[0.4em]">Inadimplência Bruta Detectada</p>
           <div className="text-6xl md:text-9xl font-black text-white mono tracking-tighter italic drop-shadow-2xl">R$ {formatNumber(totals.overdue)}</div>
           <p className="text-rose-400/60 font-black text-[11px] uppercase tracking-[0.3em] italic">
             {overdueItems.length} Operações em interrupção de fluxo
           </p>
        </div>
        <button className="relative z-10 w-full md:w-auto px-12 py-6 bg-rose-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(225,29,72,0.4)] hover:bg-rose-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4">
          <i className="fa-solid fa-bolt-lightning text-lg"></i>
          Cobrança em Lote
        </button>
        {/* Decorativo de Fundo */}
        <div className="absolute right-0 top-0 opacity-[0.03] rotate-12 pointer-events-none">
          <i className="fa-solid fa-triangle-exclamation text-[300px] text-white"></i>
        </div>
      </div>

      <div className="md:hidden space-y-4 px-1">
        {overdueItems.map(rec => (
          <div key={rec.id} className="glass-card p-8 space-y-6 border-rose-500/20 bg-[#0B0D10]">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="text-lg font-black text-white italic">{rec.clientName}</h4>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mono">Vencido: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white mono italic">R$ {formatNumber(rec.amount)}</p>
              </div>
            </div>
            <button 
              onClick={() => handleBaixar(rec.id)}
              className="w-full py-5 bg-emerald-500 text-black font-black text-[11px] uppercase rounded-2xl tracking-[0.2em] shadow-lg"
            >
              Confirmar Recebimento
            </button>
          </div>
        ))}
      </div>

      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden border-rose-500/10 bg-[#0B0D10]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-rose-500/10">
              <th className="px-12 py-10 text-[10px] font-black text-rose-500/50 uppercase tracking-[0.5em]">Devedor / Risco</th>
              <th className="px-12 py-10 text-[10px] font-black text-rose-500/50 uppercase tracking-[0.5em]">Data Crítica</th>
              <th className="px-12 py-10 text-[10px] font-black text-rose-500/50 uppercase tracking-[0.5em]">Montante Exposto</th>
              <th className="px-12 py-10 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {overdueItems.map(rec => (
              <tr key={rec.id} className="hover:bg-rose-500/[0.02] transition-all group">
                <td className="px-12 py-12">
                   <p className="font-black text-white text-xl tracking-tighter italic group-hover:text-rose-500 transition-colors">{rec.clientName}</p>
                   <p className="text-[10px] text-rose-500 font-black uppercase tracking-[0.3em] mt-2">Score Crítico — Terminal Ativo</p>
                </td>
                <td className="px-12 py-12">
                  <span className="text-base font-black text-rose-400 mono italic">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-12 py-12">
                  <span className="text-3xl font-black text-white mono italic">R$ {formatNumber(rec.amount)}</span>
                </td>
                <td className="px-12 py-12 text-right">
                  <button 
                    onClick={() => handleBaixar(rec.id)} 
                    className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] hover:text-white transition-all border border-emerald-500/20 px-6 py-3 rounded-xl hover:bg-emerald-500 hover:text-black"
                  >
                    Confirmar Fluxo
                  </button>
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