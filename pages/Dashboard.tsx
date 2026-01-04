
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import OracleIcon from '../components/OracleIcon';

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
    <div className="space-y-16 py-6 page-enter">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Terminal de Comando Operacional</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] italic uppercase">
            {greeting}, <br/><span className="text-emerald-500">{firstName}.</span>
          </h1>
        </div>
        <button 
          onClick={() => navigate('/clientes/novo')}
          className="w-full md:w-auto px-12 py-5 bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-2xl"
        >
          Nova Operação
        </button>
      </section>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Entradas Previstas', val: totals.toReceive, color: 'text-emerald-500', sub: 'Projeção para este mês' },
          { label: 'Inadimplência Exposta', val: totals.overdue, color: 'text-rose-500', sub: 'Títulos vencidos e pendentes' },
          { label: 'Fluxo de Caixa Líquido', val: totals.netBalance, color: 'text-white', sub: 'Saldo atual (Pago - Despesas)' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card p-10 rounded-[3rem] flex flex-col justify-between h-56 hover:border-emerald-500/20 transition-all">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{kpi.label}</p>
            <div>
              <p className={`text-4xl font-black ${kpi.color} mono tracking-tighter italic`}>R$ {formatNumber(kpi.val)}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-3 tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Oracle Intelligence */}
        <div className="glass-card p-10 rounded-[3.5rem] flex flex-col items-start gap-10 bg-gradient-to-br from-emerald-500/[0.04] to-transparent relative overflow-hidden">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
            <OracleIcon className="w-8 h-8" />
          </div>
          <div className="space-y-4 relative z-10">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.5em]">NEXO Intelligence Engine</span>
            <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
              "Sua taxa de liquidez está em <span className="text-emerald-500 font-black">{totals.cashHealth}%</span>. 
              {totals.overdue > 0 ? ` Atenção: R$ ${formatNumber(totals.overdue)} estão parados em cobrança. Recomendamos ação imediata na Central de Lembretes.` : " Sua base está saudável. Continue monitorando as entradas previstas."}
            </p>
          </div>
        </div>

        {/* Recurring Base */}
        <div className="glass-card p-10 rounded-[3.5rem] flex flex-col justify-between h-full bg-[#030d12]">
           <div className="space-y-6">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">Faturamento Recorrente Mensal</span>
              <div className="space-y-1">
                 <h2 className="text-5xl font-black text-white mono tracking-tighter italic">R$ {formatNumber(totals.monthlyRecurring)}</h2>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base de Contratos Ativos</p>
              </div>
           </div>
           <button 
             onClick={() => navigate('/relatorios')}
             className="w-full py-5 bg-white/5 border border-white/5 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
             Exportar Relatório Mensal
           </button>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="glass-card p-12 rounded-[4rem] h-[550px] flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Projeção de Fluxo de Capital</h3>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">Estimativa para os próximos 180 dias</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">Previsão</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          {state.receivables.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#020608', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px', padding: '20px' }}
                  itemStyle={{ color: '#10b981', fontSize: '16px', fontWeight: '900' }}
                  labelStyle={{ color: '#475569', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}
                  formatter={(value: number) => `R$ ${formatNumber(value)}`}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={5} fill="url(#chartGrad)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-6">
              <i className="fa-solid fa-chart-line text-8xl opacity-10"></i>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Dados insuficientes para projeção estatística</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
