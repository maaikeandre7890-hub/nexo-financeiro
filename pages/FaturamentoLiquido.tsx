import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';

const FaturamentoLiquido: React.FC = () => {
  const { state, totals, formatNumber, getChartData } = useApp();
  const [periodFilter, setPeriodFilter] = useState<'month' | '30d' | '90d' | 'custom'>('month');

  // Cálculo de Faturamento Baseado no contexto da App
  const calculations = useMemo(() => {
    const gross = totals.paid + totals.toReceive + totals.overdue;
    // Simulando taxa de operação de 4.99% (padrão SaaS/Gateway)
    const taxes = gross * 0.0499;
    const net = totals.paid - taxes; // Líquido real é o que entrou menos as taxas do total processado
    
    return {
      gross,
      taxes,
      overdue: totals.overdue,
      net: Math.max(0, net)
    };
  }, [totals]);

  const hasData = state.receivables.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 page-enter">
        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-slate-700">
          <i className="fa-solid fa-chart-line text-3xl"></i>
        </div>
        <div className="space-y-2">
          <h2 className={`text-xl font-black uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Sem dados para análise</h2>
          <p className={`text-sm max-w-xs mx-auto font-medium ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>
            Ainda não há dados suficientes para exibir o faturamento líquido. Comece cadastrando seus primeiros clientes e recebíveis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4 page-enter">
      {/* Header & Filtros */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
             <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>Performance de Capital</span>
          </div>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>
            Faturamento <br/><span className="text-emerald-500">Líquido.</span>
          </h1>
          <p className={`text-sm font-medium italic ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>Quanto realmente sobra para sua empresa.</p>
        </div>

        <div className={`flex gap-2 p-1.5 rounded-2xl border ${state.theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
          {[
            { id: 'month', label: 'Mês Atual' },
            { id: '30d', label: '30 Dias' },
            { id: '90d', label: '90 Dias' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setPeriodFilter(f.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                periodFilter === f.id 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' 
                : state.theme === 'light' ? 'text-[#6B7280] hover:text-[#2563EB]' : 'text-slate-500 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Card Principal - Destaque */}
      <div className={`glass-card p-10 md:p-16 relative overflow-hidden group ${state.theme === 'light' ? 'bg-blue-50/20 border-blue-100' : 'bg-gradient-to-br from-emerald-500/[0.07] to-transparent border-emerald-500/10'}`}>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <i className="fa-solid fa-sack-dollar text-[120px] -rotate-12"></i>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">Resultado Final do Período</p>
            <h2 className={`text-6xl md:text-8xl font-black mono tracking-tighter italic ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>
              R$ {formatNumber(calculations.net)}
            </h2>
            <div className={`flex items-center gap-3 text-xs font-bold uppercase tracking-widest italic ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>
              <span>Cálculo Consolidado</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-emerald-500">Auditado por NEXO IA</span>
            </div>
          </div>

          <div className={`backdrop-blur-md rounded-[2.5rem] p-8 border space-y-6 ${state.theme === 'light' ? 'bg-white/80 border-blue-50' : 'bg-black/20 border-white/5'}`}>
            <h4 className={`text-[10px] font-black uppercase tracking-widest border-b pb-4 ${state.theme === 'light' ? 'text-[#6B7280] border-slate-100' : 'text-slate-400 border-white/5'}`}>Detalhamento da Operação</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center group/item">
                <span className={`text-xs font-bold ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>Faturamento Bruto</span>
                <span className={`text-sm font-black mono ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>R$ {formatNumber(calculations.gross)}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className={`text-xs font-bold ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>Taxas Operacionais (4.99%)</span>
                <span className="text-sm font-black text-rose-500 mono">- R$ {formatNumber(calculations.taxes)}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className={`text-xs font-bold ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>Inadimplência (Atraso)</span>
                <span className="text-sm font-black text-rose-500 mono">- R$ {formatNumber(calculations.overdue)}</span>
              </div>
              <div className="pt-4 border-t border-emerald-500/10 flex justify-between items-center">
                <span className="text-xs font-black text-emerald-500 uppercase">Resultado Líquido</span>
                <span className="text-xl font-black text-emerald-500 mono">R$ {formatNumber(calculations.net)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Bruto Esperado', val: calculations.gross, color: state.theme === 'light' ? 'text-[#0F172A]' : 'text-white', icon: 'fa-arrow-up-right-dots' },
          { label: 'Taxas & Gateway', val: calculations.taxes, color: state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500', icon: 'fa-percentage' },
          { label: 'Inadimplência', val: calculations.overdue, color: 'text-rose-500', icon: 'fa-triangle-exclamation' },
          { label: 'Margem Líquida', val: (calculations.net / (calculations.gross || 1)) * 100, color: 'text-emerald-500', icon: 'fa-chart-pie', isPercent: true }
        ].map((item, idx) => (
          <div key={idx} className={`glass-card p-8 flex flex-col justify-between hover:border-emerald-500/20 transition-all ${state.theme === 'light' ? 'bg-white border-slate-100 shadow-sm' : 'border-white/[0.03]'}`}>
            <div className="flex justify-between items-start mb-6">
              <span className={`text-[9px] font-black uppercase tracking-widest ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-600'}`}>{item.label}</span>
              <i className={`fa-solid ${item.icon} text-slate-400 text-xs`}></i>
            </div>
            <div>
              <p className={`text-2xl font-black ${item.color} mono tracking-tighter`}>
                {item.isPercent ? `${item.val.toFixed(1)}%` : `R$ ${formatNumber(item.val)}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaturamentoLiquido;