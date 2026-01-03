
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
    <div className="space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Fluxo de Entrada</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <br/><span className="text-slate-600">Recebíveis.</span></h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-xl"
        >
          Novo Recebimento
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {['Todos', 'Pendente', 'Pago', 'Atrasado'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg' 
                : 'bg-white/[0.01] text-slate-500 border-white/[0.03] hover:border-white/10'
            }`}
          >
            {f === 'Todos' ? 'Tudo' : f}
          </button>
        ))}
      </div>

      <div className="hidden md:block glass-card rounded-[4rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Cliente / Categoria</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Vencimento</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Status</th>
              <th className="px-12 py-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-right">Valor</th>
              <th className="px-12 py-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredItems.map((rec) => (
              <tr key={rec.id} className="hover:bg-white/[0.01] transition-all group">
                <td className="px-12 py-10">
                  <p className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{rec.clientName}</p>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">{rec.category}</p>
                </td>
                <td className="px-12 py-10">
                  <span className="text-sm font-black text-slate-400 mono">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-12 py-10">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    rec.status === 'Pago' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 
                    rec.status === 'Atrasado' ? 'bg-rose-500/5 text-rose-400 border-rose-500/20' : 
                    'bg-amber-500/5 text-amber-400 border-amber-500/20'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="px-12 py-10 text-right">
                  <span className="text-xl font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
                </td>
                <td className="px-12 py-10 text-right">
                   <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      {rec.status !== 'Pago' && (
                        <button 
                          onClick={() => markAsPaid(rec.id)}
                          className="px-6 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all"
                        >
                          Baixar
                        </button>
                      )}
                      <button 
                        onClick={() => { if(confirm('Apagar permanentemente?')) deleteReceivable(rec.id)}}
                        className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="py-24 text-center opacity-30 italic">Nenhum registro encontrado.</div>
        )}
      </div>

      <div className="md:hidden space-y-6">
        {filteredItems.map((rec) => (
          <div key={rec.id} className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-white text-base tracking-tight">{rec.clientName}</h4>
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">{rec.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                rec.status === 'Pago' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/5'
              }`}>{rec.status}</span>
            </div>
            <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-[2rem] border border-white/[0.05]">
              <span className="text-xs font-black text-slate-500 mono">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
              <span className="text-lg font-black text-white mono">R$ {rec.amount.toLocaleString()}</span>
            </div>
            {rec.status !== 'Pago' && (
              <button 
                onClick={() => markAsPaid(rec.id)}
                className="w-full py-5 bg-emerald-500 text-black font-black rounded-[2rem] text-[10px] uppercase tracking-widest"
              >
                Confirmar Recebimento
              </button>
            )}
          </div>
        ))}
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Recebiveis;
