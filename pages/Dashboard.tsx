
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

  const currentFormattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', 
      month: 'long'
    }).format(new Date());
  }, []);

  return (
    <div className="space-y-8 py-2 page-enter">
      {/* Header Contextual */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {currentFormattedDate} • BRASIL
            </span>
            <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
              LIVE ANALYTICS
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
            {greeting}, Alexandre<span className="text-emerald-500">.</span>
          </h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-10 py-4 bg-white text-slate-950 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-xl"
        >
          Novo Registro
        </button>
      </section>

      {/* KPIs — Mobile Column, Desktop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
             <i className="fa-solid fa-receipt text-emerald-500 text-xl"></i>
             <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded">Recebíveis</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">A Receber</p>
            <p className="text-3xl font-black text-white mono">R$ {totals.toReceive.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between h-40 border-rose-500/10">
          <div className="flex justify-between items-start">
             <i className="fa-solid fa-triangle-exclamation text-rose-500 text-xl"></i>
             <span className="text-[9px] font-black text-rose-500 uppercase bg-rose-500/10 px-2 py-1 rounded">Vencidos</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-400/60 uppercase tracking-widest mb-1">Total em Atraso</p>
            <p className="text-3xl font-black text-rose-500 mono">R$ {totals.overdue.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
             <i className="fa-solid fa-scale-balanced text-blue-500 text-xl"></i>
             <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-1 rounded">EBITDA</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resultado Líquido</p>
            <p className="text-3xl font-black text-white mono">R$ {totals.netBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Oracle Insight - Premium Card */}
      <div className="glass-card p-8 rounded-[2.5rem] border-emerald-500/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="shrink-0">
          <div className="w-16 h-16 oracle-chip rounded-2xl flex items-center justify-center text-emerald-500">
            <OracleIcon className="w-10 h-10" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Insight Estratégico Oracle</h4>
          <p className="text-sm text-slate-400 leading-relaxed italic">
            "Detectamos uma redução de <span className="text-white font-bold">12%</span> no tempo de liquidação de faturas após o ajuste na régua de cobrança automática. Recomendamos expandir a estratégia para novos clientes."
          </p>
        </div>
        <button className="px-6 py-3 bg-white/5 hover:bg-emerald-500 hover:text-slate-950 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-white/10 shrink-0">
          Ver Análise Full
        </button>
      </div>

      {/* Gráfico Principal */}
      <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Fluxo de Caixa Projetado</h3>
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase">Realizado</span>
          </div>
        </div>
        <div className="h-[250px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#07131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operações Recentes */}
      <div className="glass-card p-8 rounded-[2.5rem]">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Logs de Transação</h3>
           <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Auditoria Full</button>
        </div>
        <div className="space-y-4">
          {state.logs.slice(0, 3).map(log => (
            <div key={log.id} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/[0.04] rounded-2xl">
               <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                    log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                  }`}>
                     <i className={`fa-solid ${log.type === 'success' ? 'fa-bolt' : 'fa-info'}`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{log.action}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{log.details}</p>
                  </div>
               </div>
               <span className="text-[10px] font-black text-slate-700 mono">{new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
