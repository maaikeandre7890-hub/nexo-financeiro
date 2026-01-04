
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
    <div className="space-y-24 py-6 page-enter">
      {/* Header com Espaçamento de Luxo */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Central de Inteligência Operacional</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
            {greeting}, <br/><span className="text-emerald-500">{firstName}.</span>
          </h1>
        </div>
        <button 
          onClick={() => navigate('/recebiveis/novo')}
          className="w-full md:w-auto px-14 py-6 bg-white text-slate-950 text-[13px] font-black uppercase rounded-[2rem] hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
        >
          Novo Registro
        </button>
      </section>

      {/* Grid de KPIs Principal com Hierarquia Superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: 'Expectativa de Receita', val: totals.toReceive, color: 'text-emerald-500', sub: 'Pendentes de liquidação' },
          { label: 'Exposição ao Risco', val: totals.overdue, color: 'text-rose-500', sub: 'Títulos em atraso crítico' },
          { label: 'Disponibilidade Real', val: totals.netBalance, color: 'text-white', sub: 'Lucro líquido projetado' }
        ].map((kpi, idx) => (
          <div key={idx} className={`glass-card p-12 rounded-[3.5rem] flex flex-col justify-between h-64 group overflow-hidden relative transition-all duration-500 hover:-translate-y-2 ${state.theme === 'light' ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] ring-1 ring-emerald-500/10' : ''}`}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] relative z-10">{kpi.label}</p>
            <div className="relative z-10">
              <p className={`text-5xl font-black ${kpi.color} mono tracking-tighter`}>R$ {formatNumber(kpi.val)}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase mt-4 tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Oráculo de Inteligência */}
        <div className="glass-card p-12 rounded-[3.5rem] flex flex-col items-start gap-10 border-emerald-500/10 relative overflow-hidden group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent"></div>
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 relative z-10">
            <OracleIcon className="w-10 h-10" />
          </div>
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">NEXO IA Insight</span>
            </div>
            <p className="text-2xl text-slate-300 leading-relaxed font-medium italic">
              "Saúde do caixa em <span className="text-emerald-500 font-black">{totals.cashHealth}%</span>. 
              Recuperar <span className="text-white font-black">R$ {formatNumber(totals.overdue)}</span> elevaria seu lucro líquido em <span className="text-emerald-400">12%</span> este mês."
            </p>
          </div>
        </div>

        {/* Market Context - Card Premium Refinado */}
        <div className="glass-card p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden flex flex-col justify-between group h-full bg-[#030d12]">
           <div className="absolute top-10 left-12 opacity-30 group-hover:opacity-100 transition-opacity">
              <BrandLogo className="w-7 h-7 grayscale" />
           </div>

           <div className="relative z-10 pt-10 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em]">Market Opportunity</span>
                <div className="flex gap-2">
                   <span className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Selic: 10,75%</span>
                   <span className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">IPCA: 4,42%</span>
                </div>
              </div>

              <div className="space-y-2">
                 <h2 className="text-5xl font-black text-white mono tracking-tighter">R$ {formatNumber(totals.toReceive * 0.08, 0)}</h2>
                 <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Custo oculto do capital parado</p>
              </div>

              <p className="text-base text-slate-400 leading-relaxed font-medium max-w-sm">
                A Taxa Selic e a inflação impactam diretamente a rentabilidade do seu capital.
              </p>
           </div>

           <div className="relative z-10 pt-10 mt-auto">
              <button className="w-full py-6 bg-emerald-500 text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-4 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10">
                Analisar com NEXO IA
                <i className="fa-solid fa-arrow-right text-[11px]"></i>
              </button>
           </div>
           
           <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/5 blur-[120px] rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
        </div>
      </div>

      {/* Gráfico de Performance com Maior Área */}
      <div className="glass-card p-14 rounded-[4.5rem] relative overflow-hidden h-[550px]">
        <div className="flex justify-between items-center mb-16">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Performance de Faturamento (Semestral)</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div><span className="text-[10px] font-black text-slate-600 uppercase">Efetivado</span></div>
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
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 900}} dy={20} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }}
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '28px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#0F172A', fontSize: '15px', fontWeight: '900', fontFamily: 'JetBrains Mono' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => `R$ ${formatNumber(value)}`}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={6} fill="url(#chartGrad)" animationDuration={3000} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-900 opacity-10 italic">
            <i className="fa-solid fa-chart-line text-9xl mb-8"></i>
            <p className="text-[14px] font-black uppercase tracking-[0.5em]">Aguardando Ingestão de Ativos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
