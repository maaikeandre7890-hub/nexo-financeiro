
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';
import OracleIcon from '../components/OracleIcon';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-12 py-5 bg-white text-slate-950 text-[12px] font-black uppercase rounded-[2rem] hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
        >
          Novo Registro
        </button>
      </section>

      {/* Grid de KPIs Refinado */}
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
              <p className={`text-4xl font-black ${kpi.color} mono tracking-tighter`}>R$ {kpi.val.toLocaleString()}</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase mt-3 tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Oráculo de Inteligência - Visual Ultra Moderno */}
      <div className="glass-card p-10 md:p-14 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 border-emerald-500/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.02] to-transparent"></div>
        <div className="w-24 h-24 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shrink-0 relative z-10">
          <OracleIcon className="w-14 h-14 nexus-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Oracle Insights</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 rounded text-[8px] font-bold text-emerald-400">ATIVO</span>
          </div>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium italic">
            "Sua saúde financeira está em <span className="text-emerald-500 font-black">{totals.cashHealth}%</span>. 
            Identifiquei que <span className="text-white font-bold">R$ {totals.overdue.toLocaleString()}</span> estão retidos em atraso. 
            Uma ação de cobrança hoje pode acelerar seu crescimento."
          </p>
        </div>
      </div>

      {/* Gráfico de Performance - Escala de Cinema */}
      <div className="glass-card p-12 rounded-[4rem] relative overflow-hidden h-[500px]">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Fluxo de Caixa Reais (6 Meses)</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-500 uppercase">Receita</span></div>
          </div>
        </div>
        {state.receivables.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={15} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }}
                contentStyle={{ backgroundColor: '#020C10', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px', padding: '15px' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '900', fontFamily: 'JetBrains Mono' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fill="url(#chartGrad)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-20 italic">
            <i className="fa-solid fa-chart-line text-8xl mb-6"></i>
            <p className="text-[12px] font-black uppercase tracking-[0.5em]">Aguardando Fluxo de Dados</p>
          </div>
        )}
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
