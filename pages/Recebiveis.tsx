
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';

const Recebiveis: React.FC = () => {
  const { state, markAsPaid } = useApp();
  const [filter, setFilter] = useState<'Todos' | 'Pendente' | 'Pago' | 'Atrasado'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = state.receivables.filter(r => 
    filter === 'Todos' ? true : r.status === filter
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 italic">Fluxo de Recebíveis</h1>
          <p className="text-slate-500 font-medium italic">Monitoramento de entradas e controle de fluxo de caixa.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 px-8 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Lançar Receita
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Todos', 'Pendente', 'Pago', 'Atrasado'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`py-4 px-6 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5' 
                : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            {f === 'Todos' ? 'Geral' : f}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          {filteredItems.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cliente</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valor</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Vencimento</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredItems.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{rec.clientName}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{rec.category}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-400">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        rec.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : 
                        rec.status === 'Atrasado' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {rec.status !== 'Pago' && (
                        <button 
                          onClick={() => markAsPaid(rec.id)}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                        >
                          Confirmar Recebimento
                        </button>
                      )}
                      {rec.status === 'Pago' && (
                        <i className="fa-solid fa-circle-check text-emerald-500 text-lg opacity-50"></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-24 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-white/5">
                <i className="fa-solid fa-receipt text-3xl text-slate-800"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Nenhum título encontrado</h3>
                <p className="text-slate-500 text-sm">Não existem faturas para este critério de busca.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Recebiveis;
