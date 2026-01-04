
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
    <div className="space-y-8 py-2 page-enter">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className={`text-3xl font-bold tracking-tight ${state.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {greeting}, <span className="text-emerald-500">{firstName}</span>
          </h1>
          <p className="text-sm text-slate-500">Resumo operacional e projeções estratégicas.</p>
        </div>
        <button 
          onClick={() => navigate('/clientes/novo')}
          className="w-full md:w-auto px-7 py-3 bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
        >
          Nova Operação
        </button>
      </section>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { label: 'Receitas Previstas', val: totals.toReceive, color: 'text-emerald-500', sub: 'Próximos 30 dias' },
          { label: 'Exposição em Atraso', val: totals.overdue, color: 'text-rose-500', sub: 'Títulos pendentes' },
          { label: 'Saldo de Caixa', val: totals.netBalance, color: state.theme === 'light' ? 'text-slate-900' : 'text-white', sub: 'Disponibilidade atual' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card p-7 flex flex-col justify-between h-40">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
            <div>
              <p className={`text-3xl font-bold ${kpi.color} mono`}>R$ {formatNumber(kpi.val)}</p>
              <span className="text-[10px] text-slate-500 font-medium mt-2 block opacity-70">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Card */}
        <div className="lg:col-span-1 glass-card p-7 flex flex-col justify-between min-h-[260px]">
           <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recorrência Mensal (MRR)</span>
              <div className="space-y-1">
                 <h2 className={`text-4xl font-bold ${state.theme === 'light' ? 'text-slate-900' : 'text-white'} mono`}>R$ {formatNumber(totals.monthlyRecurring)}</h2>
                 <p className="text-[10px] font-medium text-slate-500">Valor fixo contratual</p>
              </div>
           </div>
           <div className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Saúde Financeira</span>
                <span className="text-xs font-bold text-emerald-500 mono">{totals.cashHealth}%</span>
              </div>
              <div className={`h-1.5 ${state.theme === 'light' ? 'bg-slate-200' : 'bg-white/5'} rounded-full overflow-hidden`}>
                 <div className="h-full bg-emerald-500" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>

        {/* Analytics Card */}
        <div className="lg:col-span-2 glass-card p-7 md:p-8 h-[450px] flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <h3 className={`text-sm font-bold ${state.theme === 'light' ? 'text-slate-800' : 'text-white'} uppercase tracking-wider`}>Fluxo de Capital</h3>
              <p className="text-[10px] font-medium text-slate-500 italic">Previsão semestral de recebimentos</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 ${state.theme === 'light' ? 'bg-slate-100' : 'bg-white/5'} rounded-lg`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Tempo Real</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            {state.receivables.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={state.theme === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.02)'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} 
                    dy={15} 
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                    contentStyle={{ 
                      backgroundColor: state.theme === 'light' ? '#fff' : '#161f24', 
                      border: state.theme === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    formatter={(value: number) => `R$ ${formatNumber(value)}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#chartGrad)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
                <i className="fa-solid fa-chart-line text-5xl mb-4"></i>
                <p className="text-[10px] font-bold uppercase tracking-widest">Aguardando dados...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
