
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const { totals, state, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marketInsights, setMarketInsights] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const fetchMarketTrends = async () => {
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Qual o valor do CDI e IPCA acumulado hoje no Brasil? Responda de forma curta para um empresário.",
        config: { tools: [{ googleSearch: {} }] },
      });
      setMarketInsights(response.text);
    } catch (e) {
      setMarketInsights("Falha ao sincronizar dados.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Seção de Saudação Premium */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-8 py-6">
        <div className="text-center md:text-left">
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Command Center Operational Intelligence</h2>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">empresário.</span>
          </h1>
          <p className="text-slate-500 font-medium text-base mt-4 flex items-center gap-3 justify-center md:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]"></span>
            Seu caixa está <span className="text-white font-bold">{totals.cashHealth}% saudável</span> no ciclo atual.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-4 group"
          >
            <i className="fa-solid fa-plus-circle text-lg group-hover:rotate-90 transition-transform"></i>
            Launch Operation
          </button>
        </div>
      </section>

      {/* Grid KPI - Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Liquidez Pendente', val: totals.toReceive, suffix: 'BRL', icon: 'fa-wallet', color: 'emerald' },
          { label: 'Risco de Inadimplência', val: totals.overdue, suffix: 'BRL', icon: 'fa-triangle-exclamation', color: 'rose' },
          { label: 'Receita Recorrente', val: totals.monthlyRecurring, suffix: 'MRR', icon: 'fa-arrows-spin', color: 'blue' },
          { label: 'Net Profit Real', val: totals.netBalance, suffix: 'LÍQ', icon: 'fa-chart-pie', color: 'amber' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] relative group overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${kpi.color}-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            <div className="flex justify-between items-start mb-8">
              <span className="label-pro text-slate-500">{kpi.label}</span>
              <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-${kpi.color}-500 text-xs border border-white/[0.03]`}>
                <i className={`fa-solid ${kpi.icon}`}></i>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white mono tracking-tighter">R$ {kpi.val.toLocaleString()}</span>
              <span className="text-[9px] font-black text-slate-600 uppercase mono">{kpi.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 glass-card p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-14">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter italic">Capital Flow Performance</h3>
                <p className="label-pro mt-3 text-emerald-500/50">Data Engine V2.0 // Active Tracking System</p>
              </div>
              <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/[0.03]">
                {['6M', '3M', '1M'].map(t => (
                  <button key={t} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${t === '6M' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                ))}
              </div>
           </div>
           
           <div className="h-[380px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={getChartData()}>
                 <defs>
                   <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(255,255,255,0.02)" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em'}} 
                    dy={25}
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: 800}}
                    dx={-15}
                 />
                 <Tooltip 
                   cursor={{ stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 1 }}
                   contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '16px' }} 
                 />
                 <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={5} 
                    fill="url(#chartGradient)" 
                    animationDuration={2500} 
                    dot={{ r: 5, fill: '#10b981', strokeWidth: 3, stroke: '#020617' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#34d399', shadow: '0 0 20px rgba(52, 211, 153, 0.5)' }}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-8">
           {/* AI Market Widget */}
           <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/[0.04] to-transparent border-emerald-500/10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-blue-400 shadow-inner">
                    <i className="fa-solid fa-microchip text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">External Feed</h3>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse flex items-center gap-1.5 mt-1">
                      <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                      Deep Search Syncing
                    </span>
                  </div>
                </div>

                {!marketInsights ? (
                  <div className="space-y-8">
                    <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">Monitore taxas do mercado financeiro e inflação em tempo real para tomada de decisão estratégica via Gemini Brain.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/[0.05] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <p className="text-xs text-slate-300 leading-relaxed font-bold italic line-clamp-[10]">{marketInsights}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                {!marketInsights ? (
                  <button 
                    onClick={fetchMarketTrends}
                    disabled={isSearching}
                    className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                  >
                    {isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-satellite"></i> Sincronizar Agora</>}
                  </button>
                ) : (
                  <button onClick={() => setMarketInsights(null)} className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-rotate-left"></i> Refresh Insights
                  </button>
                )}
              </div>
           </div>

           {/* Health Index - Circular */}
           <div className="glass-card p-10 rounded-[3rem] flex flex-col items-center justify-center">
              <div className="flex justify-between items-center w-full mb-10">
                 <span className="label-pro">Health Index</span>
                 <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase">Estável</div>
              </div>
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                   <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900" />
                   <circle 
                      cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={465}
                      strokeDashoffset={465 - (465 * totals.cashHealth / 100)}
                      strokeLinecap="round"
                      className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                   />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-black text-white mono tracking-tighter">{totals.cashHealth}%</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-8 text-center uppercase tracking-widest">Capacidade de Operação</p>
           </div>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
