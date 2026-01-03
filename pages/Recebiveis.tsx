
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';

const Recebiveis: React.FC = () => {
  const { state, markAsPaid, deleteReceivable } = useApp();
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
          <p className="text-slate-500 text-sm md:text-base font-medium italic">Gestão centralizada de faturamento e entradas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-emerald-500 text-slate-950 font-black py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Lançar Receita
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
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

      <div className="hidden md:block glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-white/[0.03]">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entidade</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor Bruto</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredItems.map((rec) => (
              <tr key={rec.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-white group-hover:text-emerald-500 transition-colors">{rec.clientName}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase">{rec.category}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-slate-400">
                  {new Date(rec.dueDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    rec.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : 
                    rec.status === 'Atrasado' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right flex justify-end gap-3">
                  {rec.status !== 'Pago' && (
                    <button 
                      onClick={() => markAsPaid(rec.id)}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/20"
                    >
                      Liquidar
                    </button>
                  )}
                  <button 
                    onClick={() => { if(confirm('Excluir este título permanentemente?')) deleteReceivable(rec.id)}}
                    className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredItems.map((rec) => (
          <div key={rec.id} className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-white text-sm">{rec.clientName}</h4>
                <p className="text-[9px] text-zinc-500 uppercase">{rec.category}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  rec.status === 'Pago' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/5'
                }`}>{rec.status}</span>
                <button onClick={() => deleteReceivable(rec.id)} className="text-slate-700"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
            <div className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl">
              <span className="text-xs font-black text-zinc-400">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
              <span className="text-base font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
            </div>
            {rec.status !== 'Pago' && (
              <button onClick={() => markAsPaid(rec.id)} className="w-full py-4 bg-emerald-500 text-black font-black rounded-xl">Registrar Baixa</button>
            )}
          </div>
        ))}
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Recebiveis;
