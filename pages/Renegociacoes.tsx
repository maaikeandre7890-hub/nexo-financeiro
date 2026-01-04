
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Receivable } from '../types';

const Renegociacoes: React.FC = () => {
  const { state, totals, formatNumber, markAsPaid } = useApp();
  const [payingRec, setPayingRec] = useState<Receivable | null>(null);

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentMonthName = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ][currentMonthIdx];
  const currentMonthPrefix = `${now.getFullYear()}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

  // Filtra parcelas de renegociação do mês atual
  const activeRenegotiations = useMemo(() => {
    return state.receivables.filter(r => 
      r.category === 'Renegociação' && 
      r.dueDate.startsWith(currentMonthPrefix)
    );
  }, [state.receivables, currentMonthPrefix]);

  const totalToReceive = useMemo(() => {
    return activeRenegotiations
      .filter(r => r.status !== 'Pago')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [activeRenegotiations]);

  const uniqueClientsCount = useMemo(() => {
    const clients = new Set(activeRenegotiations.map(r => r.clientId));
    return clients.size;
  }, [activeRenegotiations]);

  const handlePayment = (method: Receivable['paymentMethod']) => {
    if (payingRec) {
      markAsPaid(payingRec.id, method);
      setPayingRec(null);
    }
  };

  return (
    <div className="space-y-12 py-6 page-enter">
      {/* Header e Resumo do Mês */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Gestão de Acordos • {currentMonthName}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
            Acordos & <br/><span className="text-amber-500">Renegociações.</span>
          </h1>
        </div>
      </section>

      {/* BLOCO 1 – RESUMO DO MÊS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-card p-12 rounded-[3.5rem] bg-gradient-to-br from-amber-500/[0.05] to-transparent border-amber-500/10 flex items-center justify-between group">
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Total a Receber (Negociado)</p>
              <h2 className="text-5xl font-black text-white mono tracking-tighter italic group-hover:text-amber-500 transition-colors">
                R$ {formatNumber(totalToReceive)}
              </h2>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-3 tracking-widest italic">
                Apenas parcelas pendentes deste mês
              </p>
           </div>
           <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex items-center justify-center text-amber-500 shadow-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-calculator text-3xl"></i>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[3.5rem] border-white/5 flex items-center justify-between group">
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Clientes com Acordo Ativo</p>
              <h2 className="text-5xl font-black text-white mono tracking-tighter italic">
                {uniqueClientsCount} <span className="text-xl text-slate-700">Contratos</span>
              </h2>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-3 tracking-widest italic">
                Em fase de recuperação de crédito
              </p>
           </div>
           <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-slate-500 shadow-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-users-viewfinder text-3xl"></i>
           </div>
        </div>
      </div>

      {/* BLOCO 2 – LISTA DE RENEGOCIAÇÕES */}
      <div className="glass-card rounded-[4rem] overflow-hidden bg-[#020608] border-white/[0.02]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Cliente</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Parcela / Restante</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Valor do Acordo</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Status</th>
              <th className="px-12 py-8 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {activeRenegotiations.map((rec) => {
              const client = state.clients.find(c => c.id === rec.clientId);
              const remainingInstallments = client ? client.installments : 0; // Simplificado

              return (
                <tr key={rec.id} className="hover:bg-amber-500/[0.015] transition-all group border-l-4 border-l-transparent hover:border-l-amber-500">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center font-black text-amber-500 text-lg">
                        {rec.clientName.substring(0, 1).toUpperCase()}
                      </div>
                      <p className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{rec.clientName}</p>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="space-y-1">
                      <p className="text-[11px] text-white font-bold">Vence dia {new Date(rec.dueDate).getDate()}</p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">Acordo de médio prazo</p>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <span className="text-xl font-black text-white mono">R$ {formatNumber(rec.amount)}</span>
                  </td>
                  <td className="px-12 py-10">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      rec.status === 'Pago' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    }`}>
                      {rec.status === 'Pago' ? 'Liquidado' : 'Aguardando'}
                    </span>
                  </td>
                  <td className="px-12 py-10 text-right">
                    {rec.status !== 'Pago' && (
                      <button 
                        onClick={() => setPayingRec(rec)}
                        className="px-8 py-3 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/10"
                      >
                        Registrar Pagamento
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {activeRenegotiations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-12 py-24 text-center text-slate-700 italic font-medium">
                   Nenhum acordo registrado com parcelas para este mês.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Pagamento */}
      {payingRec && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPayingRec(null)}></div>
          <div className="relative w-full max-w-sm glass-card p-12 rounded-[3.5rem] border-white/10 space-y-8 bg-[#0a151b] text-center">
             <div className="space-y-3">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                   <i className="fa-solid fa-hand-holding-dollar text-2xl"></i>
                </div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Baixa de Renegociação</p>
                <h3 className="text-4xl font-black text-white mono">R$ {formatNumber(payingRec.amount)}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase italic tracking-tighter">{payingRec.clientName}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {['PIX', 'Boleto', 'Cartão', 'Dinheiro'].map(m => (
                  <button 
                    key={m} 
                    onClick={() => handlePayment(m as any)} 
                    className="py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all shadow-inner"
                  >
                    {m}
                  </button>
                ))}
             </div>
             
             <button 
                onClick={() => setPayingRec(null)}
                className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors pt-4 block w-full"
             >
               Cancelar Operação
             </button>
          </div>
        </div>
      )}

      {/* Informativo de Dashboard */}
      <div className="p-10 glass-card rounded-[3rem] border-white/5 bg-[#030d12] flex items-center gap-8">
         <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center text-slate-600 text-xl border border-white/5">
            <i className="fa-solid fa-circle-info"></i>
         </div>
         <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
           <strong className="text-white">Nota de Auditoria:</strong> Por segurança, os valores negociados só aparecem na Dashboard Principal ("Dinheiro que entrou") após a confirmação do pagamento acima. Isso evita previsões de caixa irreais baseadas em promessas de pagamento.
         </p>
      </div>
    </div>
  );
};

export default Renegociacoes;
