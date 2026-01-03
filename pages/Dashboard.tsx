
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';

const Dashboard: React.FC = () => {
  const { totals, state, markAsPaid, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const currentFormattedDate = useMemo(() => {
    const date = new Intl.DateTimeFormat('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(new Date());
    return date.charAt(0).toUpperCase() + date.slice(1);
  }, []);

  const cashStatus = useMemo(() => {
    const balance = totals.netBalance;
    if (balance > 10000) return { label: 'ATIVO', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (balance >= 0) return { label: 'ALERTA', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'CRÍTICO', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  }, [totals.netBalance]);

  const maxOverdueDays = useMemo(() => {
    const overdueItems = state.receivables.filter(r => r.status === 'Atrasado');
    if (overdueItems.length === 0) return 0;
    const now = new Date();
    const delays = overdueItems.map(item => {
      const dueDate = new Date(item.dueDate);
      return Math.ceil(Math.abs(now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    });
    return Math.max(...delays);
  }, [state.receivables]);

  return (
    <div className="space-y-6 md:space-y-10 py-2 page-enter">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <span className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] block mb-1 md:mb-2">
            {currentFormattedDate}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            {greeting}<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className={`px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 w-full md:w-auto ${cashStatus.bg}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${cashStatus.color.replace('text', 'bg')}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cashStatus.color}`}>
                Status: {cashStatus.label}
              </span>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 md:p-6 rounded-2xl luxury-border-glow">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 md:mb-3">Total a Receber</p>
          <p className="text-xl md:text-2xl font-black text-white mono">R$ {totals.toReceive.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 md:p-6 rounded-2xl border-rose-500/10">
          <p className="text-[9px] font-bold text-rose-500/60 uppercase tracking-widest mb-2 md:mb-3">Parcelas em Atraso</p>
          <p className="text-xl md:text-2xl font-black text-rose-500 mono">R$ {totals.overdue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 md:p-6 rounded-2xl border-amber-500/10">
          <p className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest mb-2 md:mb-3">Maior Atraso</p>
          <p className="text-xl md:text-2xl font-black text-amber-500 mono">{maxOverdueDays} <span className="text-[10px] uppercase">Dias</span></p>
        </div>
        <div className="glass-card p-5 md:p-6 rounded-2xl border-emerald-500/10">
          <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest mb-2 md:mb-3">Disponível em Caixa</p>
          <p className="text-xl md:text-2xl font-black text-emerald-500 mono">R$ {totals.netBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-2xl">
          <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-6 md:mb-8">Faturamento Mensal</h3>
          <div className="h-[200px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080808', border: '1px solid #111', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-2xl border-emerald-500/10 flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 md:mb-6">
              <i className="fa-solid fa-sparkles text-lg md:text-xl"></i>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-2">Insights NEXO AI</h3>
            <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed mb-4 md:mb-6">
              Sua inadimplência está 12% acima da média do setor B2B este mês. Recomendamos antecipar a régua de cobrança em 2 dias.
            </p>
          </div>
          <button className="w-full py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl active:scale-95 transition-all">
            Gerar Insights
          </button>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
