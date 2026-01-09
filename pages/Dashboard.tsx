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

  const labelClass = `text-[8px] font-black uppercase tracking-[0.4em] mb-4 block ${
    state.theme === 'light' ? 'text-slate-400' : 'text-zinc-600'
  }`;

  const insights = [
    { icon: 'fa-calendar-day', title: 'CALENDÁRIO', text: `Hoje é ${currentDateTime}` },
    { icon: 'fa-sparkles', title: 'NEXO IA', text: 'Analista estratégico ativo no protocolo Alpha.' },
    { icon: 'fa-shield-check', title: 'SECURITY', text: 'Conexão segura via criptografia de ponta a ponta.' }
  ];

  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [insights.length]);

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto page-enter pb-24">
      {/* HEADER DINÂMICO REFINADO */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
             <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-emerald-500/80">Monitoramento Ativo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none italic uppercase">
            <span className={state.theme === 'light' ? 'text-slate-900' : 'text-white'}>CONTROLE</span>
            <span className="text-gradient-emerald">.GERAL</span>
          </h1>
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
            {greeting}, {firstName} • {state.companyName}
          </p>
        </div>
        
        {/* INSIGHT TICKER */}
        <div className="w-full md:w-auto overflow-hidden">
           <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl border transition-all duration-500 ${state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/[0.03] shadow-inner'} min-w-[320px]`}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 shrink-0">
                 <i className={`fa-solid ${insights[activeInsight].icon} text-[10px]`}></i>
              </div>
              <div className="flex-1">
                 <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">{insights[activeInsight].title}</p>
                 <p className="text-[10px] font-medium text-zinc-400 truncate">{insights[activeInsight].text}</p>
              </div>
           </div>
        </div>
      </header>

      {/* GRID BENTO PRINCIPAL REFINADO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CARD PRINCIPAL */}
        <div className={`lg:col-span-8 glass-card p-10 md:p-14 rounded-[3rem] relative overflow-hidden flex flex-col justify-between min-h-[380px] ${
          state.theme === 'light' ? 'bg-gradient-to-br from-white to-emerald-50/10' : 'bg-[#030708]'
        }`}>
          <div className="relative z-10">
            <span className={labelClass}>Capital Líquido Consolidado</span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mt-6">
              <h2 className={`text-6xl md:text-7xl font-bold tracking-tighter leading-none italic ${
                state.theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                R$ {formatNumber(totals.paid - totals.totalExpenses)}
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <i className="fa-solid fa-arrow-trend-up text-emerald-500 text-[8px]"></i>
                <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-widest">{totals.cashHealth}%</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-10 border-t border-white/[0.02] flex flex-wrap gap-10">
             <div>
                <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Entradas Confirmadas</p>
                <p className={`text-xl font-bold italic ${state.theme === 'light' ? 'text-slate-800' : 'text-emerald-500'}`}>R$ {formatNumber(totals.paid)}</p>
             </div>
             <div>
                <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Despesas Operacionais</p>
                <p className={`text-xl font-bold italic ${state.theme === 'light' ? 'text-slate-800' : 'text-rose-500'}`}>R$ {formatNumber(totals.totalExpenses)}</p>
             </div>
          </div>
        </div>

        {/* CARD SECUNDÁRIO */}
        <div className={`lg:col-span-4 glass-card p-10 rounded-[3rem] flex flex-col justify-between ${
          state.theme === 'light' ? 'bg-white' : 'bg-[#030708]'
        }`}>
           <div>
             <span className={labelClass}>Receita Recorrente</span>
             <h3 className={`text-3xl md:text-4xl font-bold italic tracking-tighter mt-4 ${
               state.theme === 'light' ? 'text-slate-900' : 'text-white'
             }`}>R$ {formatNumber(totals.monthlyRecurring)}</h3>
             <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-4">Projeção contratual</p>
           </div>
           
           <div className={`rounded-2xl p-6 mt-6 border ${
             state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/[0.03]'
           }`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Saúde de Caixa</span>
                <span className="text-[10px] font-bold text-emerald-500">{totals.cashHealth}%</span>
              </div>
              <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>

        {/* GRÁFICO REFINADO */}
        <div className={`lg:col-span-12 glass-card p-10 md:p-14 rounded-[3rem] min-h-[450px] flex flex-col ${
          state.theme === 'light' ? 'bg-white' : 'bg-[#030708]'
        }`}>
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className={labelClass}>Projeção de Fluxo</span>
              <p className={`text-sm font-medium italic ${state.theme === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>Baseado em contratos ativos e renegociações correntes.</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke={state.theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#4b5563', fontSize: 10, fontWeight: 700}} 
                  dy={15}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: state.theme === 'light' ? '#FFFFFF' : '#020608', 
                    border: '1px solid rgba(255, 255, 255, 0.05)', 
                    borderRadius: '16px', 
                    padding: '16px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)' 
                  }}
                  itemStyle={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748b', fontSize: '8px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.2em' }}
                  formatter={(value: number) => `R$ ${formatNumber(value)}`}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#chartGrad)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;