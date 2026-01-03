
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2 italic">Fluxo de Recebíveis</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium italic">Monitoramento de entradas e controle de fluxo de caixa.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Lançar Receita
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
        {['Todos', 'Pendente', 'Pago', 'Atrasado'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap py-3 md:py-4 px-6 md:px-10 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg' 
                : 'bg-transparent text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            {f === 'Todos' ? 'Geral' : f}
          </button>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block glass-card rounded-[2.5rem] overflow-hidden border-white/5">
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
              <i className="fa-solid fa-receipt text-3xl text-slate-800"></i>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Nenhum título encontrado</h3>
                <p className="text-slate-500 text-sm">Não existem faturas para este critério de busca.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((rec) => (
            <div key={rec.id} className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-white text-sm tracking-tight">{rec.clientName}</h4>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{rec.category}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  rec.status === 'Pago' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 
                  rec.status === 'Atrasado' ? 'bg-rose-500/5 text-rose-400 border-rose-500/20' : 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                }`}>
                  {rec.status}
                </span>
              </div>
              <div className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Vencimento</p>
                  <p className="text-xs font-black text-zinc-400">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Valor</p>
                  <p className="text-base font-black text-white mono">R$ {rec.amount.toLocaleString()}</p>
                </div>
              </div>
              {rec.status !== 'Pago' && (
                <button 
                  onClick={() => markAsPaid(rec.id)}
                  className="w-full py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl active:scale-95 transition-all"
                >
                  Baixar Título
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
            <i className="fa-solid fa-receipt text-3xl"></i>
            <p className="text-xs font-bold uppercase tracking-widest">Vazio</p>
          </div>
        )}
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Recebiveis;
