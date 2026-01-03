
import React from 'react';
import { useApp } from '../contexts/AppContext';

const FaturamentoLiquido: React.FC = () => {
  const { totals, state } = useApp();
  
  const income = state.receivables.filter(r => r.status === 'Pago').reduce((a, b) => a + b.amount, 0);
  const costOfServices = income * 0.3; // Simulando custo de 30%
  const grossProfit = income - costOfServices;
  const netProfit = grossProfit - totals.totalExpenses;

  return (
    <div className="space-y-10 py-2 page-enter">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Faturamento Líquido<span className="text-emerald-500">.</span></h1>
        <p className="text-zinc-500 text-sm mt-2 font-medium">Análise granular de lucratividade e fluxo de caixa real.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-3xl space-y-8">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">Demonstrativo de Resultado (DRE)</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center group">
              <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Vendas do Mês (Entradas)</span>
              <span className="text-lg font-black text-emerald-500 mono">R$ {income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-sm font-bold text-zinc-400">Custo de Produto/Serviço (Simulado)</span>
              <span className="text-lg font-black text-rose-500 mono">- R$ {costOfServices.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-white">Lucro Bruto</span>
              <span className="text-lg font-black text-white mono">R$ {grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-sm font-bold text-zinc-400">Despesas Operacionais (Gastos Fixos)</span>
              <span className="text-lg font-black text-rose-500 mono">- R$ {totals.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex justify-between items-center p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
              <span className="text-sm font-black text-white uppercase tracking-widest">Resultado Final (Líquido)</span>
              <span className={`text-2xl font-black mono ${netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                R$ {netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border-emerald-500/10 bg-emerald-500/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">IA Consultora NEXO</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed italic">
              "Seu ROI está estável, mas o 'Churn' de clientes inativos está impactando seu faturamento recorrente. Sugerimos uma revisão nos custos de infraestrutura para aumentar a margem em 5%."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Margem Líquida</p>
              <p className="text-xl font-black text-white mono">{income > 0 ? ((netProfit / income) * 100).toFixed(1) : 0}%</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Break-Even</p>
              <p className="text-xl font-black text-white mono">Dia 12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaturamentoLiquido;
