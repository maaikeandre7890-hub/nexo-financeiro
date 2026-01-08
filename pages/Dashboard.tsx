
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext.tsx';

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

  const labelClass = `text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block ${
    state.theme === 'light' ? 'text-slate-400' : 'text-zinc-600'
  }`;

  const cardBorderClass = state.theme === 'light' 
    ? 'border-emerald-500/[0.08] hover:border-emerald-500/30' 
    : 'border-white/[0.03] hover:border-emerald-500/20';

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto page-enter pb-24">
      {/* HEADER DE IMPACTO AFINADO */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/[0.03] pb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-emerald-500/80">Terminal Alpha</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none italic uppercase">
            <span className={state.theme === 'light' ? 'text-slate-900' : 'text-gradient-white'}>CONTROLE.</span>
            <span className="text-gradient-emerald">GERAL</span>
          </h1>
          <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
            {greeting}, {firstName} • {state.companyName}
          </p>
        </div>
        <button 
          onClick={() => navigate('/recebiveis/novo')}
          className={`px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] ${
            state.theme === 'light' ? 'bg-[#0F172A] text-white hover:bg-emerald-600' : 'bg-white text-black hover:bg-emerald-500'
          }`}
        >
          Novo Registro
        </button>
      </header>

      {/* GRID BENTO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KPI: SALDO LÍQUIDO */}
        <div className={`lg:col-span-8 glass-card p-12 md:p-16 rounded-[4rem] relative overflow-hidden flex flex-col justify-between min-h-[450px] group border ${cardBorderClass} ${
          state.theme === 'light' ? 'bg-gradient-to-br from-white to-emerald-50/20' : 'bg-gradient-to-br from-white/[0.02] to-transparent'
        }`}>
          <div className="relative z-10">
            <span className={labelClass}>Capital Líquido Consolidado</span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-6 mt-8">
              <h2 className={`text-7xl md:text-9xl font-bold tracking-tighter leading-none italic text-glow-emerald ${
                state.theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                R$ {formatNumber(totals.paid - totals.totalExpenses)}
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.08] border border-emerald-500/10 rounded-full">
                <i className="fa-solid fa-arrow-trend-up text-emerald-500 text-[10px]"></i>
                <span className="text-emerald-500 font-bold text-[11px] uppercase tracking-widest">{totals.cashHealth}%</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-12 border-t border-white/[0.03] flex flex-wrap gap-12">
             <div className="group/item">
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2">Confirmados</p>
                <p className="text-3xl font-bold text-emerald-500 italic">R$ {formatNumber(totals.paid)}</p>
             </div>
             <div className="group/item">
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2">Custos Totais</p>
                <p className="text-3xl font-bold text-rose-500 italic">R$ {formatNumber(totals.totalExpenses)}</p>
             </div>
          </div>

          <div className="absolute -right-20 -bottom-20 opacity-[0.02] text-[400px] text-emerald-500 pointer-events-none group-hover:opacity-[0.04] transition-opacity">
            <i className="fa-solid fa-crown"></i>
          </div>
        </div>

        {/* RECURRÊNCIA */}
        <div className={`lg:col-span-4 glass-card p-12 rounded-[4rem] flex flex-col justify-between border ${cardBorderClass} ${
          state.theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-white/[0.01] to-transparent'
        }`}>
           <div>
             <span className={labelClass}>Receita de Assinatura</span>
             <h3 className={`text-5xl font-bold italic tracking-tighter mt-8 ${
               state.theme === 'light' ? 'text-slate-900' : 'text-white'
             }`}>R$ {formatNumber(totals.monthlyRecurring)}</h3>
             <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mt-6">Projeção por Contrato</p>
           </div>
           
           <div className={`rounded-3xl p-8 mt-10 border ${
             state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/[0.04]'
           }`}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Saúde Operacional</span>
                <span className="text-sm font-bold text-emerald-500">{totals.cashHealth}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>

        {/* GRÁFICO ESTRATÉGICO */}
        <div className={`lg:col-span-12 glass-card p-12 md:p-16 rounded-[4rem] border min-h-[550px] flex flex-col ${cardBorderClass} ${
          state.theme === 'light' ? 'bg-white' : 'bg-transparent'
        }`}>
          <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <span className={labelClass}>Progressão de Capital</span>
              <p className={`text-lg font-medium italic ${state.theme === 'light' ? 'text-slate-600' : 'text-zinc-500'}`}>Análise de recebimentos projetados por trimestre.</p>
            </div>
            <div className="flex gap-4">
               <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${
                 state.theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.04]'
               }`}>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    state.theme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>Fluxo Consolidado</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={state.theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: state.theme === 'light' ? '#94a3b8' : '#4b5563', fontSize: 11, fontWeight: 700}} 
                  tickFormatter={(val) => val.toUpperCase()}
                  dy={20}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: state.theme === 'light' ? '#FFFFFF' : '#020608', 
                    border: state.theme === 'light' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.1)', 
                    borderRadius: '24px', 
                    padding: '24px', 
                    boxShadow: '0 40px 80px rgba(0,0,0,0.1)' 
                  }}
                  itemStyle={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.3em' }}
                  formatter={(value: number) => `R$ ${formatNumber(value)}`}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#chartGrad)" animationDuration={2500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
