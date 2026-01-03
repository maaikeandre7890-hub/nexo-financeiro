
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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
      month: 'short'
    }).format(new Date());
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 py-2 md:py-6 page-enter">
      {/* Header Mobile Otimizado */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {currentFormattedDate} • BRASIL
            </span>
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
              LIVE DATA
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {greeting}, Alexandre<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <div className="w-full md:w-auto">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="w-full md:w-auto px-6 py-4 md:py-3 bg-white text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-lg"
           >
             Novo Recebível
           </button>
        </div>
      </section>

      {/* Grid Bento Otimizado para Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card Grande Mobile-Ready */}
        <div className="md:col-span-2 md:row-span-2 glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden shimmer">
          <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
            <div>
              <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest mb-1">Fluxo Líquido</h3>
              <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase">Projeção 30 dias</p>
            </div>
            <div className="px-2 py-0.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[8px] font-black text-emerald-500">
              ESTÁVEL
            </div>
          </div>
          
          <div className="h-[200px] md:h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9, fontWeight: 700}} dy={8} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#07131A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px' }}
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Cards Mobile Bento */}
        <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-1 gap-4">
          <div className="glass-card p-5 rounded-[1.75rem] flex flex-col justify-between h-32 md:h-auto">
            <i className="fa-solid fa-receipt text-emerald-500 text-sm mb-2"></i>
            <div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">A Receber</p>
              <p className="text-lg md:text-xl font-black text-white mono">R${totals.toReceive.toLocaleString()}</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-[1.75rem] flex flex-col justify-between h-32 md:h-auto border-rose-500/10">
            <i className="fa-solid fa-circle-exclamation text-rose-500 text-sm mb-2"></i>
            <div>
              <p className="text-[8px] md:text-[9px] font-bold text-rose-400/60 uppercase tracking-widest mb-1">Atrasos</p>
              <p className="text-lg md:text-xl font-black text-rose-500 mono">R${totals.overdue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Oracle Insight - Mobile Condensed */}
        <div className="md:col-span-1 glass-card p-6 rounded-[2rem] border-emerald-500/20 flex flex-col justify-between group shimmer">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 oracle-chip rounded-xl flex items-center justify-center text-emerald-500 relative shrink-0">
                <i className="fa-solid fa-robot text-lg"></i>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Oracle Insight</h4>
                <p className="text-[8px] text-emerald-500/60 font-black uppercase">Alpha V3</p>
             </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
            Otimização detectada: <span className="text-emerald-500 font-bold">R$4.2k</span> em despesas de nuvem. Realoque para marketing.
          </p>
          <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-slate-950 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
             Analisar Agora
          </button>
        </div>

      </div>

      {/* Recentes Otimizado */}
      <div className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem]">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">Operações Críticas</h3>
            <button className="text-[9px] font-black text-emerald-500 uppercase">Histórico</button>
         </div>
         <div className="space-y-3">
            {state.logs.slice(0, 2).map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/[0.04]">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xs">
                       <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-white">{log.action}</p>
                       <p className="text-[9px] text-slate-500 truncate max-w-[150px]">{log.details}</p>
                    </div>
                 </div>
                 <span className="text-[9px] font-black text-slate-700 mono">{new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
         </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
