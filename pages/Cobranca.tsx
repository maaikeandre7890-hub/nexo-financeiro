import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Cobranca: React.FC = () => {
  const { state, formatNumber } = useApp();
  const [filter, setFilter] = useState<'Todos' | 'Lembrete' | 'Hoje' | 'Atrasados'>('Todos');

  const filteredItems = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return state.receivables.filter(r => {
      if (r.status === 'Pago') return false;
      if (filter === 'Todos') return true;
      if (filter === 'Lembrete') {
        const dueDate = new Date(r.dueDate);
        const diff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 3;
      }
      if (filter === 'Hoje') return r.dueDate === todayStr;
      if (filter === 'Atrasados') return r.status === 'Atrasado' || (r.status === 'Pendente' && r.dueDate < todayStr);
      return true;
    });
  }, [state.receivables, filter]);

  const handleWhatsAppCharge = (item: any) => {
    const client = state.clients.find(c => c.id === item.clientId);
    const clientRecs = state.receivables
      .filter(r => r.clientId === item.clientId)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const installmentNumber = clientRecs.findIndex(r => r.id === item.id) + 1;
    const totalInstallments = client?.installments || clientRecs.length;
    const statusLabel = item.status === 'Atrasado' ? 'em atraso' : item.status.toLowerCase();

    const message = `Olá, ${item.clientName}!\n\nIdentificamos que sua parcela ${installmentNumber} de ${totalInstallments},\nno valor de R$ ${formatNumber(item.amount)},\nencontra-se ${statusLabel}.\n\nCaso já tenha realizado o pagamento, desconsidere esta mensagem.\nSe precisar, é só falar com a gente para regularizar.\n\n${state.companyName}`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${client?.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-10 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Central de Lembretes</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">Cobranca <br/><span className="text-slate-600">Direta.</span></h1>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
        {['Todos', 'Lembrete', 'Hoje', 'Atrasados'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/[0.01] text-zinc-500 border-white/5 hover:border-white/10'
            }`}
          >
            {f === 'Lembrete' ? 'Vencendo Logo' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6 flex flex-col justify-between group">
               <div className="space-y-1">
                  <h4 className="font-black text-white text-lg tracking-tight group-hover:text-emerald-500 transition-colors">{item.clientName}</h4>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Vence em: {new Date(item.dueDate).toLocaleDateString('pt-BR')}</p>
               </div>
               
               <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Valor do Boleto</p>
                  <p className="text-2xl font-black text-white mono">R$ {formatNumber(item.amount)}</p>
               </div>

               <button 
                  onClick={() => handleWhatsAppCharge(item)}
                  className="w-full py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10"
               >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  Lembrar Cliente
               </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center opacity-30 italic">
             <i className="fa-solid fa-circle-check text-5xl mb-6 text-emerald-500"></i>
             <p className="text-sm font-black uppercase tracking-widest text-slate-600">Não há cobranças pendentes para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cobranca;