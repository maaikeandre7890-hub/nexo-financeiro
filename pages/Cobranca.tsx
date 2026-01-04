
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Cobranca: React.FC = () => {
  const { state, formatNumber } = useApp();
  const [filter, setFilter] = useState<'Todos' | 'Preventiva' | 'Hoje' | 'Atraso'>('Todos');

  const filteredItems = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return state.receivables.filter(r => {
      if (r.status === 'Pago') return false;
      if (filter === 'Todos') return true;
      if (filter === 'Preventiva') {
        const dueDate = new Date(r.dueDate);
        const diff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 3;
      }
      if (filter === 'Hoje') return r.dueDate === todayStr;
      if (filter === 'Atraso') return r.status === 'Atrasado';
      return true;
    });
  }, [state.receivables, filter]);

  const handleWhatsAppCharge = (item: any) => {
    const client = state.clients.find(c => c.id === item.clientId);
    const message = `Olá, tudo bem? Aqui é da ${state.companyName}. Passando apenas para lembrar do pagamento de R$ ${formatNumber(item.amount)} que vence em ${new Date(item.dueDate).toLocaleDateString('pt-BR')}.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8 md:space-y-10 py-2 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Cobrança Rápida</h1>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Automatizado</span>
          </div>
          <p className="text-zinc-500 text-sm font-medium">Envie lembretes de pagamento em um clique via WhatsApp.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {['Todos', 'Preventiva', 'Hoje', 'Atraso'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-6 py-3 md:py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-transparent text-zinc-500 border-white/5 hover:border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="hidden md:block glass-card rounded-3xl overflow-hidden border-white/5 min-h-[400px]">
        {filteredItems.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vencimento</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">{item.clientName}</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase">{item.id}</p>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-zinc-400">{new Date(item.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-6 text-sm font-black text-white mono">R$ {formatNumber(item.amount)}</td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleWhatsAppCharge(item)}
                      className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                    >
                      Enviar WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
            <i className="fa-solid fa-shield-check text-4xl mb-6"></i>
            <h3 className="text-xl font-bold text-white mb-2 italic">Tudo em conformidade</h3>
            <p className="text-xs font-bold text-slate-600 uppercase">Nenhuma cobrança pendente para este filtro.</p>
          </div>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="glass-card p-5 rounded-2xl border-white/5 space-y-4">
               <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-white text-sm tracking-tight">{item.clientName}</h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{item.id}</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Pendente</span>
               </div>
               <div className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Vencimento</p>
                    <p className="text-xs font-black text-zinc-400">{new Date(item.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Valor</p>
                    <p className="text-base font-black text-white mono">R$ {formatNumber(item.amount)}</p>
                  </div>
               </div>
               <button 
                  onClick={() => handleWhatsAppCharge(item)}
                  className="w-full py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl active:scale-95 transition-all"
               >
                  Cobrar via WhatsApp
               </button>
            </div>
          ))
        ) : (
          <div className="p-10 text-center opacity-30">
             <i className="fa-solid fa-circle-check text-4xl mb-4 text-emerald-500"></i>
             <p className="text-xs font-black uppercase tracking-widest text-slate-600">Nenhuma conta pendente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cobranca;
