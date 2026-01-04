
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import OracleIcon from '../components/OracleIcon';
import BrandLogo from '../components/BrandLogo';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData, formatNumber } = useApp();
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = state.userName ? state.userName.split(' ')[0] : 'Empreendedor';

  return (
    <div className="space-y-10 py-6 page-enter">
      {/* Header com Espaçamento de Luxo */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Central de Inteligência Operacional</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
            {greeting}, <br/><span className="text-emerald-500">{firstName}.</span>
          </h1>
        </div>
        <button 
          onClick={() => navigate('/recebiveis/novo')}
          className="w-full md:w-auto px-12 py-5 bg-white text-slate-950 text-[12px] font-black uppercase rounded-[2rem] hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
        >
          Novo Registro
        </button>
      </section>

      {/* Grid de KPIs Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Expectativa de Receita', val: totals.toReceive, color: 'text-emerald-500', sub: 'Pendentes de liquidação' },
          { label: 'Exposição ao Risco', val: totals.overdue, color: 'text-rose-500', sub: 'Títulos em atraso crítico' },
          { label: 'Disponibilidade Real', val: totals.netBalance, color: 'text-white', sub: 'Lucro líquido projetado' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card p-10 rounded-[3rem] flex flex-col justify-between h-56 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] relative z-10">{kpi.label}</p>
            <div className="relative z-10">
              <p className={`text-4xl font-black ${kpi.color} mono tracking-tighter`}>R$ {formatNumber(kpi.val)}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-3 tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Oráculo de Inteligência */}
        <div className="glass-card p-10 rounded-[3rem] flex flex-col items-start gap-8 border-emerald-500/10 relative overflow-hidden group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent"></div>
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 relative z-10">
            <OracleIcon className="w-10 h-10" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Internal Insight</span>
            </div>
            <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
              "Saúde do caixa em <span className="text-emerald-500 font-black">{totals.cashHealth}%</span>. 
              Recuperar <span className="text-white font-black">R$ {formatNumber(totals.overdue)}</span> elevaria seu lucro líquido em <span className="text-emerald-400">12%</span> este mês."
            </p>
          </div>
        </div>

        {/* Market Context - Card Premium Refinado */}
        <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden flex flex-col justify-between group h-full bg-[#030d12]">
           <div className="absolute top-8 left-10 opacity-30 group-hover:opacity-100 transition-opacity">
              <BrandLogo className="w-6 h-6 grayscale" />
           </div>

           <div className="relative z-10 pt-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em]">Market Opportunity</span>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Selic: 10,75%</span>
                   <span className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">IPCA: 4,42%</span>
                </div>
              </div>

              <div className="space-y-1">
                 <h2 className="text-4xl font-black text-white mono tracking-tighter">R$ {formatNumber(totals.toReceive * 0.08, 0)}</h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Custo oculto do capital parado</p>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-sm">
                A Taxa Selic e a inflação impactam diretamente a rentabilidade do seu capital.
              </p>
           </div>

           <div className="relative z-10 pt-8 mt-auto">
              <button className="w-full py-5 bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10">
                Analisar com Oracle NEXO
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
           </div>
           
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
        </div>
      </div>

      {/* Gráfico de Performance */}
      <div className="glass-card p-12 rounded-[4rem] relative overflow-hidden h-[500px]">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Performance de Faturamento (Semestral)</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div><span className="text-[9px] font-black text-slate-600 uppercase">Efetivado</span></div>
          </div>
        </div>
        {state.receivables.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
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
                cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }}
                contentStyle={{ backgroundColor: '#020C10', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '20px' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '900', fontFamily: 'JetBrains Mono' }}
                formatter={(value: number) => `R$ ${formatNumber(value)}`}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={5} fill="url(#chartGrad)" animationDuration={2500} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-900 opacity-20 italic">
            <i className="fa-solid fa-chart-line text-8xl mb-6"></i>
            <p className="text-[12px] font-black uppercase tracking-[0.5em]">Aguardando Ingestão de Ativos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
