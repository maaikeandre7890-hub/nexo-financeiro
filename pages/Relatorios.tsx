
import React from 'react';
import { useApp } from '../contexts/AppContext';

const Relatorios: React.FC = () => {
  const { totals, state } = useApp();

  const paidIncome = state.receivables.filter(r => r.status === 'Pago').reduce((a, b) => a + b.amount, 0);

  const dre = [
    { label: 'Total Recebido (Entradas Reais)', val: paidIncome, color: 'text-emerald-500' },
    { label: 'Total Gasto (Contas e Despesas)', val: -totals.totalExpenses, color: 'text-rose-500' },
    { label: 'O que sobrou (Lucro Real)', val: totals.netBalance, color: totals.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400', isBold: true },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight italic">Resumo do Negócio</h1>
          <p className="text-slate-500 font-medium italic">Análise detalhada do seu desempenho financeiro.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-white text-slate-950 font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-all"
        >
          <i className="fa-solid fa-print"></i>
          Imprimir Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div id="printable-dre" className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8 bg-white/[0.01]">
           <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-widest italic">Fechamento Mensal</h3>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
           </div>
           
           <div className="space-y-6">
              {dre.map((item, i) => (
                <div key={i} className={`flex justify-between items-center ${item.isBold ? 'pt-8 border-t border-white/10' : ''}`}>
                   <span className={`text-sm ${item.isBold ? 'font-black text-white' : 'font-bold text-slate-400'}`}>{item.label}</span>
                   <span className={`text-xl font-black mono ${item.color}`}>R$ {item.val.toLocaleString()}</span>
                </div>
              ))}
           </div>

           <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-[9px] font-bold text-slate-600 uppercase text-center leading-relaxed">
                Este relatório foi gerado automaticamente pelo NEXO Intelligence.<br/>
                Os valores refletem o status atual da sua base de dados.
              </p>
           </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Margem de Lucro</p>
                <h4 className="text-2xl font-black text-white italic">
                  {paidIncome > 0 
                    ? ((totals.netBalance / paidIncome) * 100).toFixed(1)
                    : 0}%
                </h4>
             </div>
             <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-percent text-xl"></i>
             </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saúde do Caixa</p>
                <h4 className="text-2xl font-black text-white italic">
                  {totals.cashHealth > 80 ? 'Excelente' : totals.cashHealth > 50 ? 'Estável' : 'Atenção'}
                </h4>
             </div>
             <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <i className="fa-solid fa-heart-pulse text-xl"></i>
             </div>
          </div>
          
          <div className="glass-card p-8 rounded-[2rem] border-rose-500/10 bg-rose-500/[0.02] flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Risco de Inadimplência</p>
                <h4 className="text-2xl font-black text-white italic">
                  R$ {totals.overdue.toLocaleString()}
                </h4>
             </div>
             <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-dre, #printable-dre * { visibility: visible; }
          #printable-dre { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            background: white !important;
            color: black !important;
            border: 1px solid #eee;
          }
          #printable-dre * { color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default Relatorios;
