import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext.tsx';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData, formatNumber } = useApp();
  const navigate = useNavigate();

  const currentDateTime = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = state.userName ? state.userName.split(' ')[0] : 'Gestor';

  const labelClass = `text-[9px] font-black uppercase tracking-[0.5em] mb-4 block ${
    state.theme === 'light' ? 'text-slate-400' : 'text-zinc-600'
  }`;

  const cardBorderClass = state.theme === 'light' 
    ? 'border-slate-100 hover:border-emerald-500/20' 
    : 'border-white/[0.015] hover:border-emerald-500/10';

  const insights = [
    { icon: 'fa-calendar-day', title: 'CALENDÁRIO', text: `Hoje é ${currentDateTime}` },
    { icon: 'fa-sparkles', title: 'NEXO IA', text: 'Analista estratégico ativo no protocolo Alpha.' },
    { icon: 'fa-keyboard', title: 'ATALHO', text: 'Pressione Cmd+K para busca global instantânea.' },
    { icon: 'fa-shield-check', title: 'SECURITY', text: 'Conexão segura via criptografia de ponta a ponta.' }
  ];

  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [insights.length]);

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto page-enter pb-24">
      {/* HEADER DINÂMICO */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/[0.015] pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
             <span className="text-[9px] font-black uppercase tracking-[0.6em] text-emerald-500/60">Operação em Tempo Real</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none italic uppercase">
            <span className={state.theme === 'light' ? 'text-slate-900' : 'text-gradient-white'}>CONTROLE.</span>
            <span className="text-gradient-emerald">GERAL</span>
          </h1>
          <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-[0.2em]">
            {greeting}, {firstName} • {state.companyName}
          </p>
        </div>
        
        {/* INSIGHT TICKER (SLIDER) */}
        <div className="w-full md:w-auto overflow-hidden">
           <div className={`flex items-center gap-6 px-6 py-4 rounded-2xl border ${state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/[0.015]'} min-w-[340px] shadow-2xl shadow-black/20`}>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                 <i className={`fa-solid ${insights[activeInsight].icon} text-xs transition-all duration-500`}></i>
              </div>
              <div className="flex-1 animate-in slide-in-from-right-2 fade-in duration-500">
                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1.5">{insights[activeInsight].title}</p>
                 <p className="text-[11px] font-medium text-zinc-500 truncate">{insights[activeInsight].text}</p>
              </div>
              <div className="flex gap-1.5">
                 {insights.map((_, i) => (
                   <div key={i} className={`h-1 rounded-full transition-all duration-500 ${activeInsight === i ? 'w-4 bg-emerald-500' : 'w-1 bg-white/5'}`} />
                 ))}
              </div>
           </div>
        </div>
      </header>

      {/* GRID BENTO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className={`lg:col-span-8 glass-card p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-between min-h-[420px] group border ${cardBorderClass} ${
          state.theme === 'light' ? 'bg-gradient-to-br from-white to-emerald-50/20' : 'bg-gradient-to-br from-white/[0.02] to-transparent'
        }`}>
          <div className="relative z-10">
            <span className={labelClass}>Capital Líquido Consolidado</span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-6 mt-8">
              <h2 className={`text-6xl md:text-8xl font-bold tracking-tighter leading-none italic text-glow-emerald ${
                state.theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                R$ {formatNumber(totals.paid - totals.totalExpenses)}
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/[0.05] border border-emerald-500/10 rounded-full">
                <i className="fa-solid fa-arrow-trend-up text-emerald-500 text-[9px]"></i>
                <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">{totals.cashHealth}%</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-10 border-t border-white/[0.01] flex flex-wrap gap-12">
             <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Entradas Confirmadas</p>
                <p className={`text-2xl font-bold italic ${state.theme === 'light' ? 'text-slate-800' : 'text-emerald-500'}`}>R$ {formatNumber(totals.paid)}</p>
             </div>
             <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Despesas Operacionais</p>
                <p className={`text-2xl font-bold italic ${state.theme === 'light' ? 'text-slate-800' : 'text-rose-500'}`}>R$ {formatNumber(totals.totalExpenses)}</p>
             </div>
          </div>
        </div>

        <div className={`lg:col-span-4 glass-card p-10 rounded-[3.5rem] flex flex-col justify-between border ${cardBorderClass} ${
          state.theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-white/[0.01] to-transparent'
        }`}>
           <div>
             <span className={labelClass}>Receita de Assinatura</span>
             <h3 className={`text-4xl font-bold italic tracking-tighter mt-8 ${
               state.theme === 'light' ? 'text-slate-900' : 'text-white'
             }`}>R$ {formatNumber(totals.monthlyRecurring)}</h3>
             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-6">Projeção por Contrato</p>
           </div>
           
           <div className={`rounded-2xl p-6 mt-8 border ${
             state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/[0.015]'
           }`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Saúde de Caixa</span>
                <span className="text-xs font-bold text-emerald-500">{totals.cashHealth}%</span>
              </div>
              <div className="h-0.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>

        <div className={`lg:col-span-12 glass-card p-10 md:p-14 rounded-[3.5rem] border min-h-[500px] flex flex-col ${cardBorderClass} ${
          state.theme === 'light' ? 'bg-white' : 'bg-transparent'
        }`}>
          <div className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1">
              <span className={labelClass}>Fluxo de Capital Futuro</span>
              <p className={`text-base font-medium italic ${state.theme === 'light' ? 'text-slate-600' : 'text-zinc-500'}`}>Previsibilidade baseada em contratos ativos e renegociações.</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={state.theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.01)'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#4b5563', fontSize: 10, fontWeight: 700}} 
                  tickFormatter={(val) => val.toUpperCase()}
                  dy={20}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: state.theme === 'light' ? '#FFFFFF' : '#020608', 
                    border: '1px solid rgba(16, 185, 129, 0.1)', 
                    borderRadius: '20px', 
                    padding: '20px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
                  }}
                  itemStyle={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748b', fontSize: '9px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.3em' }}
                  formatter={(value: number) => `R$ ${formatNumber(value)}`}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#chartGrad)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;