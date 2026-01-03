
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
    const date = new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(new Date());
    return date;
  }, []);

  return (
    <div className="space-y-10 py-6 page-enter">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">
            SÃO PAULO, BR • {currentFormattedDate}
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            {greeting}, Alexandre<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 rounded-2xl bg-[#112532] border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Capital Health: Stable
              </span>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-8 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Total a Receber</p>
          <p className="text-2xl font-black text-white mono">R$ {totals.toReceive.toLocaleString()}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">Em Atraso</p>
          <p className="text-2xl font-black text-rose-500 mono">R$ {totals.overdue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">MRR Recorrente</p>
          <p className="text-2xl font-black text-white mono">R$ {totals.monthlyRecurring.toLocaleString()}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl luxury-border-glow">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">Fluxo Líquido</p>
          <p className="text-2xl font-black text-emerald-500 mono">R$ {totals.netBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2rem]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Revenue Flow Analytics</h3>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last 6 Months</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#07131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#112532] border border-white/5 p-10 rounded-[2rem] flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20">
              <i className="fa-solid fa-sparkles text-2xl"></i>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 italic">NEXO AI INSIGHT</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Sua margem líquida cresceu <span className="text-emerald-500 font-bold">4.2%</span> em relação ao mês anterior. Recomendamos investir 10% do excedente em expansão de infraestrutura AWS para suportar novos clientes.
            </p>
          </div>
          <button className="w-full py-4 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 mt-10">
            Acessar Intelligence
          </button>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
