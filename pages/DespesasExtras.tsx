
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AddExpenseModal } from '../components/Modals';

const DespesasExtras: React.FC = () => {
  const { state, totals, deleteExpense } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">Registro de Saídas</h1>
          <p className="text-slate-500 font-medium italic">Monitoramento de custos operacionais e reinvestimentos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-400 text-white font-black py-4 px-8 rounded-xl transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="fa-solid fa-minus"></i>
          Nova Despesa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2rem] border-rose-500/10 bg-rose-500/[0.02]">
           <p className="text-[10px] font-black text-rose-400 uppercase mb-2">Total Consumido (Ciclo Atual)</p>
           <h2 className="text-4xl font-black text-white mono">R$ {totals.totalExpenses.toLocaleString()}</h2>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">Nodes de Saída</p>
              <p className="text-xl font-black text-white">{state.expenses.length} Transações</p>
           </div>
           <i className="fa-solid fa-receipt text-3xl text-slate-800"></i>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 border-b border-zinc-800/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Natureza do Gasto</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Categoria</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Data</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {state.expenses.length > 0 ? (
              state.expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-rose-500/[0.01] transition-colors group">
                  <td className="px-8 py-6 text-sm font-bold text-white">{exp.description}</td>
                  <td className="px-8 py-6">
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 py-1 bg-zinc-900 rounded">{exp.category}</span>
                  </td>
                  <td className="px-8 py-6 text-zinc-400 text-xs font-medium">{new Date(exp.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-6">
                      <span className="font-black text-rose-400 mono">R$ {exp.amount.toLocaleString()}</span>
                      <button 
                        onClick={() => { if(confirm('Remover esta despesa permanentemente?')) deleteExpense(exp.id)}}
                        className="text-slate-800 hover:text-rose-500 transition-colors"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 italic">Nenhuma saída registrada no período.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DespesasExtras;
