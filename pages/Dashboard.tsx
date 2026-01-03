
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';

const Dashboard: React.FC = () => {
  const { totals, state, markAsPaid, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Top Executivo: Saudação e Data
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

  // 2. Status Financeiro
  const isSuperavit = totals.netBalance >= 0;

  // 3. KPIs Estratégicos: Cálculo do maior atraso
  const maxOverdueDays = useMemo(() => {
    const overdueItems = state.receivables.filter(r => r.status === 'Atrasado');
    if (overdueItems.length === 0) return 0;
    
    const now = new Date();
    const delays = overdueItems.map(item => {
      const dueDate = new Date(item.dueDate);
      const diffTime = Math.abs(now.getTime() - dueDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });
    return Math.max(...delays);
  }, [state.receivables]);

  // 5. Ações Prioritárias (Max 3)
  const priorityActions = useMemo(() => {
    return state.receivables
      .filter(r => r.status === 'Atrasado')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  }, [state.receivables]);

  return (
    <div className="space-y-10 py-2 page-enter">
      {/* 1 & 2. Topo Executivo e Status */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] block mb-2">
            {currentFormattedDate}
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            {greeting}<span className="text-emerald-500">.</span>
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isSuperavit ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${isSuperavit ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isSuperavit ? 'SUPERAVITÁRIO' : 'DÉFICIT ATIVO'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Disponibilidade Líquida</span>
          <div className="text-5xl font-black text-white mono tracking-tighter">
            R$ {totals.netBalance.toLocaleString()}
          </div>
        </div>
      </section>

      {/* 3. Cards Executivos (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl luxury-border-glow">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Total a Receber</p>
          <p className="text-xl font-black text-white mono">R$ {totals.toReceive.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-rose-500/10">
          <p className="text-[9px] font-bold text-rose-500/60 uppercase tracking-widest mb-3">Parcelas em Atraso</p>
          <p className="text-xl font-black text-rose-500 mono">R$ {totals.overdue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-amber-500/10">
          <p className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest mb-3">Maior Atraso</p>
          <p className="text-xl font-black text-amber-500 mono">{maxOverdueDays} <span className="text-[10px] uppercase">Dias</span></p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-emerald-500/10">
          <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest mb-3">Recorrência (MRR)</p>
          <p className="text-xl font-black text-emerald-500 mono">R$ {totals.monthlyRecurring.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. Gráfico de Fluxo de Caixa */}
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tendência de Fluxo de Caixa</h3>
            <span className="text-[9px] font-bold text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full uppercase">Últimos 6 meses</span>
          </div>
          <div className="h-[280px] w-full">
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
                  contentStyle={{ backgroundColor: '#080808', border: '1px solid #111', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Ações Prioritárias */}
        <div className="glass-card p-8 rounded-2xl border-white/5 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Ações Prioritárias</h3>
          <div className="space-y-3 flex-1">
            {priorityActions.length > 0 ? (
              priorityActions.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl bg-zinc-950/50 border border-rose-500/10 group flex justify-between items-center hover:bg-zinc-900/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">{rec.clientName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-rose-500 font-bold mono">R$ {rec.amount.toLocaleString()}</p>
                      <span className="text-[8px] text-zinc-600 font-black uppercase">• {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => markAsPaid(rec.id)}
                    className="w-8 h-8 rounded-lg bg-emerald-500/5 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"
                    title="Marcar como Pago"
                  >
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-30 py-10">
                <i className="fa-solid fa-circle-check text-2xl mb-3 text-emerald-500"></i>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Fluxo em conformidade</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 mt-6 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
          >
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* 6. Bloco de IA (Consultor) */}
      <div className="glass-card p-1 rounded-2xl luxury-border-glow">
        <div className="bg-zinc-950/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">NEXO AI INSIGHT</p>
              <p className="text-[12px] text-zinc-400 font-medium">Análise estratégica baseada no seu MRR e inadimplência atual.</p>
            </div>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2">
            Gerar Insight Estratégico
            <i className="fa-solid fa-arrow-right-long text-[8px]"></i>
          </button>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
