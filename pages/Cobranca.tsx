
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Cobranca: React.FC = () => {
  const { state } = useApp();
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

  return (
    <div className="space-y-10 py-2 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Cobrança Automática</h1>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Premium</span>
          </div>
          <p className="text-zinc-500 text-sm font-medium">Recuperação de crédito inteligência via WhatsApp e E-mail.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Todos', 'Preventiva', 'Hoje', 'Atraso'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-transparent text-zinc-500 border-white/5 hover:border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-white/5 min-h-[400px] flex flex-col">
        {filteredItems.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cliente / Título</th>
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
                  <td className="px-8 py-6">
                    <span className={`text-xs font-bold ${item.status === 'Atrasado' ? 'text-rose-500' : 'text-zinc-400'}`}>
                      {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-white mono">R$ {item.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all">
                      Disparar Cobrança
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-shield-check text-2xl text-emerald-500/20"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 italic">Nenhuma cobrança necessária</h3>
            <p className="text-zinc-600 text-sm max-w-xs font-medium">Todos os seus recebíveis estão em conformidade com o cronograma financeiro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cobranca;
