
import React from 'react';
import { useApp } from '../contexts/AppContext';

const Relatorios: React.FC = () => {
  const { totals, state } = useApp();

  const dre = [
    { label: 'Total Recebido (Dinheiro que entrou)', val: state.receivables.filter(r => r.status === 'Pago').reduce((a, b) => a + b.amount, 0), color: 'text-emerald-500' },
    { label: 'Total Pago (Despesas e Contas)', val: -totals.totalExpenses, color: 'text-rose-500' },
    { label: 'O que sobrou (Lucro)', val: totals.netBalance, color: totals.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400', isBold: true },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight italic">Resumo do Negócio</h1>
        <p className="text-slate-500 font-medium italic">Veja como está a saúde do seu bolso de forma simples.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8">
           <h3 className="text-lg font-black text-white uppercase tracking-widest italic border-b border-white/5 pb-4">Entradas e Saídas</h3>
           <div className="space-y-6">
              {dre.map((item, i) => (
                <div key={i} className={`flex justify-between items-center ${item.isBold ? 'pt-6 border-t border-white/10' : ''}`}>
                   <span className="text-sm font-bold text-slate-400">{item.label}</span>
                   <span className={`text-lg font-black mono ${item.color}`}>R$ {item.val.toLocaleString()}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Margem de Lucro</p>
                <h4 className="text-2xl font-black text-white italic">
                  {state.receivables.filter(r => r.status === 'Pago').length > 0 
                    ? ((totals.netBalance / state.receivables.filter(r => r.status === 'Pago').reduce((a, b) => a + b.amount, 0)) * 100).toFixed(1)
                    : 0}%
                </h4>
             </div>
             <i className="fa-solid fa-chart-line text-4xl text-emerald-500/20"></i>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Perda de Clientes</p>
                <h4 className="text-2xl font-black text-white italic">Baixa</h4>
             </div>
             <i className="fa-solid fa-user-minus text-4xl text-rose-500/20"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
