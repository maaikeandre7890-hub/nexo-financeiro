
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const DespesasExtras: React.FC = () => {
  const { state, totals, deleteExpense, formatNumber } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">Minhas Despesas</h1>
          <p className="text-slate-500 font-medium italic">Controle tudo o que você pagou ou tem para pagar.</p>
        </div>
        <button 
          onClick={() => navigate('/despesas/novo')}
          className="bg-rose-500 hover:bg-rose-400 text-white font-black py-4 px-8 rounded-xl transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="fa-solid fa-minus"></i>
          Nova Despesa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2rem] border-rose-500/10 bg-rose-500/[0.02]">
           <p className="text-[10px] font-black text-rose-400 uppercase mb-2">Total Pago este Mês</p>
           <h2 className="text-4xl font-black text-white mono">R$ {formatNumber(totals.totalExpenses)}</h2>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-2">Total de Pagamentos</p>
              <p className="text-xl font-black text-white">{state.expenses.length} Contas</p>
           </div>
           <i className="fa-solid fa-receipt text-3xl text-slate-800"></i>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 border-b border-zinc-800/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">O que foi pago?</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Tipo</th>
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
                      <span className="font-black text-rose-400 mono">R$ {formatNumber(exp.amount)}</span>
                      <button 
                        onClick={() => { if(confirm('Remover esta despesa para sempre?')) deleteExpense(exp.id)}}
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
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 italic">Você ainda não registrou nenhuma conta paga.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DespesasExtras;
