
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData, formatNumber } = useApp();
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = state.userName ? state.userName.split(' ')[0] : 'Gestor';

  return (
    <div className="space-y-10 py-2 page-enter">
      {/* Header Minimalista */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {greeting}, <span className="text-emerald-500">{firstName}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">Análise consolidada do fluxo de capital.</p>
        </div>
        <button 
          onClick={() => navigate('/clientes/novo')}
          className="w-full md:w-auto px-10 py-3.5 bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
        >
          Nova Operação
        </button>
      </section>

      {/* KPIs com Elevação Sutil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: 'Receitas Previstas', val: totals.toReceive, color: 'text-emerald-500', sub: 'Próximos 30 dias' },
          { label: 'Inadimplência Exposta', val: totals.overdue, color: 'text-rose-500', sub: 'Títulos em atraso' },
          { label: 'Saldo Atualizado', val: totals.netBalance, color: 'text-white', sub: 'Líquido operacional' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card p-8 flex flex-col justify-between h-44 shadow-sm border-white/[0.04] bg-white/[0.01]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</p>
            <div>
              <p className={`text-3xl font-bold ${kpi.color} mono tracking-tight`}>R$ {formatNumber(kpi.val)}</p>
              <p className="text-[10px] text-slate-600 font-medium mt-2">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recorrência */}
        <div className="lg:col-span-1 glass-card p-8 flex flex-col justify-between min-h-[280px] bg-white/[0.01]">
           <div className="space-y-5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Base de Recorrência (MRR)</span>
              <div className="space-y-1">
                 <h2 className="text-4xl font-bold text-white mono">R$ {formatNumber(totals.monthlyRecurring)}</h2>
                 <p className="text-[11px] font-medium text-slate-600">Contratos ativos registrados</p>
              </div>
           </div>
           <div className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Saúde Financeira</span>
                <span className="text-xs font-bold text-emerald-500 mono">{totals.cashHealth}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>

        {/* Gráfico de Projeção */}
        <div className="lg:col-span-2 glass-card p-8 h-[450px] flex flex-col relative overflow-hidden bg-white/[0.01]">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Projeção de Entradas</h3>
              <p className="text-[10px] font-medium text-slate-600 italic">Estimativa baseada em contratos atuais</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[9px] font-bold text-emerald-500 uppercase">Monitoramento Ativo</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 relative z-10">
            {state.receivables.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5e6a', fontSize: 10, fontWeight: 600}} dy={15} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                    contentStyle={{ backgroundColor: '#1c252b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#8e9ba5', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    formatter={(value: number) => `R$ ${formatNumber(value)}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#chartGrad)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                <i className="fa-solid fa-chart-line text-5xl opacity-10"></i>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-30">Aguardando volume de dados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
