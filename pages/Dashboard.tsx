
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const currentFormattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', 
      month: 'long'
    }).format(new Date());
  }, []);

  return (
    <div className="space-y-8 py-6 page-enter">
      {/* Header com Status do Sistema */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {currentFormattedDate} • BRASIL
            </span>
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
              Operacional
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            {greeting}, Alexandre<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-6 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-white/5"
           >
             Novo Lançamento
           </button>
        </div>
      </section>

      {/* Grid Bento Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full">
        
        {/* Card Grande: Fluxo Principal */}
        <div className="md:col-span-2 md:row-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden shimmer">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Fluxo de Caixa Líquido</h3>
              <p className="text-[10px] text-slate-500 font-bold">Projeção Baseada em Recebíveis</p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase">
              +4.2% Estável
            </div>
          </div>
          
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2}}
                  contentStyle={{ backgroundColor: '#07131A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card KPI: Total a Receber */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-receipt"></i>
             </div>
             <i className="fa-solid fa-arrow-trend-up text-emerald-500 text-xs"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total a Receber</p>
            <p className="text-2xl font-black text-white mono tracking-tighter">R$ {totals.toReceive.toLocaleString()}</p>
          </div>
        </div>

        {/* Card KPI: Em Atraso */}
        <div className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border-rose-500/10">
          <div className="flex justify-between items-start">
             <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <i className="fa-solid fa-triangle-exclamation"></i>
             </div>
             <span className="text-[8px] font-black text-rose-500 uppercase bg-rose-500/10 px-2 py-0.5 rounded">Atenção</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-400/60 uppercase tracking-widest mb-1">Inadimplência</p>
            <p className="text-2xl font-black text-rose-500 mono tracking-tighter">R$ {totals.overdue.toLocaleString()}</p>
          </div>
        </div>

        {/* Card Oracle Insight (Bento Style) */}
        <div className="md:col-span-2 glass-card p-8 rounded-[2rem] border-emerald-500/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shimmer">
          <div className="shrink-0">
             <div className="w-20 h-20 oracle-chip rounded-3xl flex items-center justify-center text-emerald-500 relative">
                <i className="fa-solid fa-robot text-3xl"></i>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 text-xs font-black border-4 border-[#112532]">
                  N
                </div>
             </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-sm font-black text-white uppercase tracking-widest italic mb-2">Insight Estratégico</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Detectamos uma otimização de <span className="text-emerald-500 font-bold">R$ 4.200</span> em despesas de infraestrutura. Recomendamos realocar para aquisição de novos clientes (LTV: 4.5x).
            </p>
          </div>
          <button className="shrink-0 p-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-2xl transition-all border border-emerald-500/20">
             <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

      </div>

      {/* Seção Secundária: Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem]">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Logs de Operação Recentes</h3>
              <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Ver Auditoria</button>
           </div>
           <div className="space-y-4">
              {state.logs.slice(0, 3).map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/20 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                        log.type === 'success' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'
                      }`}>
                         <i className={`fa-solid ${log.type === 'success' ? 'fa-check' : 'fa-info'}`}></i>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{log.action}</p>
                         <p className="text-[10px] text-slate-500">{log.details}</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-700 mono">{new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-6">
           <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                 <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * totals.cashHealth / 100)} className="text-emerald-500" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-xl font-black text-white mono">{totals.cashHealth}%</span>
              </div>
           </div>
           <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Saúde da Liquidez</h4>
              <p className="text-[10px] text-slate-500 font-medium px-4">Sua eficiência de recebimento está acima da média do setor (72%).</p>
           </div>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
