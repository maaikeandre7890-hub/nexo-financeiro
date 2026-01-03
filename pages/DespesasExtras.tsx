
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AddExpenseModal } from '../components/Modals';

const DespesasExtras: React.FC = () => {
  const { state, totals } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight italic">Controle de Despesas</h1>
          <p className="text-slate-500 font-medium italic">Gestão de saídas, custos fixos e variáveis.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-400 text-white font-black py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-rose-500/20 active:scale-95"
        >
          <i className="fa-solid fa-minus"></i>
          Nova Despesa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2rem] border-rose-500/10">
           <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-2">Total Gasto (Mês)</p>
           <h2 className="text-4xl font-black text-white mono">R$ {totals.totalExpenses.toLocaleString()}</h2>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-white/5">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Categorias Dominantes</p>
           <div className="flex gap-4">
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black text-zinc-400">INFRA</span>
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black text-zinc-400">FIXO</span>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 border-b border-zinc-800/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Descrição</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Categoria</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Data</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {state.expenses.length > 0 ? (
              state.expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-rose-500/[0.01] transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-white">{exp.description}</td>
                  <td className="px-8 py-6">
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 py-1 bg-zinc-900 rounded">{exp.category}</span>
                  </td>
                  <td className="px-8 py-6 text-zinc-400 text-xs font-medium">{new Date(exp.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-6 text-right font-black text-rose-400 mono">R$ {exp.amount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 italic">Nenhuma despesa registrada.</td>
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
