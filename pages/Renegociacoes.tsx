
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Receivable } from '../types';

const Renegociacoes: React.FC = () => {
  const { state, totals, formatNumber, markAsPaid } = useApp();
  const [payingRec, setPayingRec] = useState<Receivable | null>(null);

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentMonthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][currentMonthIdx];
  const currentMonthPrefix = `${now.getFullYear()}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

  const activeRenegotiations = useMemo(() => {
    return state.receivables.filter(r => 
      r.category === 'Renegociação' && 
      r.dueDate.startsWith(currentMonthPrefix)
    );
  }, [state.receivables, currentMonthPrefix]);

  const totalToReceive = useMemo(() => {
    return activeRenegotiations.filter(r => r.status !== 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
  }, [activeRenegotiations]);

  const handlePayment = (method: Receivable['paymentMethod']) => {
    if (payingRec) {
      markAsPaid(payingRec.id, method);
      setPayingRec(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 py-4 md:py-6 page-enter pb-24">
      <div className="px-2 md:px-0 space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"></div>
             <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Acordos • {currentMonthName}</span>
          </div>
          <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
            Acordos & <br/><span className="text-amber-500">Negócios.</span>
          </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-1 md:px-0">
        <div className="glass-card p-6 md:p-12 bg-gradient-to-br from-amber-500/[0.05] to-transparent border-amber-500/10 flex items-center justify-between group">
           <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Pendente no Mês</p>
              <h2 className="text-3xl md:text-5xl font-black text-white mono italic group-hover:text-amber-500 transition-colors">
                R$ {formatNumber(totalToReceive)}
              </h2>
           </div>
           <div className="w-14 h-14 md:w-20 md:h-20 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl">
              <i className="fa-solid fa-calculator text-xl md:text-3xl"></i>
           </div>
        </div>
        
        <div className="hidden md:flex glass-card p-12 rounded-[3.5rem] border-white/5 items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Contratos Ativos</p>
              <h2 className="text-5xl font-black text-white mono italic">
                {new Set(activeRenegotiations.map(r => r.clientId)).size} <span className="text-xl text-slate-700">Fluxos</span>
              </h2>
           </div>
           <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-slate-500 shadow-2xl">
              <i className="fa-solid fa-users-viewfinder text-3xl"></i>
           </div>
        </div>
      </div>

      {/* Mobile Card List - Ajuste de Respiro mb-3 */}
      <div className="md:hidden space-y-4 px-1">
        {activeRenegotiations.map(rec => (
          <div key={rec.id} className="glass-card p-6 mb-3 space-y-5 border-amber-500/10 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-sm">
                  {rec.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{rec.clientName}</h4>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase">Venc: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white mono">R$ {formatNumber(rec.amount)}</p>
                <div className="flex flex-col items-end gap-1.5 mt-1">
                   <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                      rec.status === 'Pago' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                   }`}>{rec.status}</span>
                   {rec.paymentMethod && (
                     <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest px-1.5 py-0.5 bg-white/5 rounded border border-white/10">{rec.paymentMethod}</span>
                   )}
                </div>
              </div>
            </div>
            {rec.status !== 'Pago' && (
              <button 
                onClick={() => setPayingRec(rec)}
                className="w-full py-4 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl tracking-[0.2em] shadow-lg shadow-amber-500/10"
              >
                Registrar Recebimento
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden bg-[#020608] border-white/[0.02]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Cliente</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Vencimento</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Valor do Acordo</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Status</th>
              <th className="px-12 py-8 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {activeRenegotiations.map((rec) => (
              <tr key={rec.id} className="hover:bg-amber-500/[0.015] transition-all group">
                <td className="px-12 py-10">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center font-black text-amber-500 text-lg">
                      {rec.clientName.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-white text-lg tracking-tight">{rec.clientName}</p>
                      {rec.paymentMethod && <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{rec.paymentMethod}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-12 py-10">
                  <p className="text-[11px] text-white font-bold">Dia {new Date(rec.dueDate).getDate()}</p>
                </td>
                <td className="px-12 py-10">
                  <span className="text-xl font-black text-white mono">R$ {formatNumber(rec.amount)}</span>
                </td>
                <td className="px-12 py-10">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    rec.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}>{rec.status}</span>
                </td>
                <td className="px-12 py-10 text-right">
                  {rec.status !== 'Pago' && (
                    <button onClick={() => setPayingRec(rec)} className="px-8 py-3 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl tracking-widest hover:bg-amber-400 active:scale-95 transition-all">Registrar Pagamento</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Pagamento - Centralização Absoluta Corrigida */}
      {payingRec && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setPayingRec(null)}></div>
          <div className="relative w-full max-w-sm glass-card p-10 rounded-[3rem] border-white/10 space-y-8 bg-[#0a151b] text-center shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="space-y-3">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Liquidando Acordo</p>
                <h3 className="text-3xl font-black text-white mono">R$ {formatNumber(payingRec.amount)}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{payingRec.clientName}</p>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {['PIX', 'Débito', 'Crédito', 'Dinheiro'].map(m => (
                  <button key={m} onClick={() => handlePayment(m as any)} className="py-4 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
                    {m}
                  </button>
                ))}
             </div>
             <button onClick={() => setPayingRec(null)} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors block w-full">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Renegociacoes;
