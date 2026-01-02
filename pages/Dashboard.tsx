
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
      <section className="flex flex-col md:flex-row justify-between items-center gap-8 py-4">
        <div className="text-center md:text-left">
          <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-3">Operational Intelligence</h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">empresário.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-3 flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Seu caixa está <span className="text-white font-bold">{totals.cashHealth}% saudável</span> hoje.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/10 flex items-center gap-3"
          >
            <i className="fa-solid fa-plus-circle text-lg"></i>
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
          <div key={i} className="glass-card p-6 rounded-[2rem] relative group">
            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${kpi.color}-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="flex justify-between items-start mb-6">
              <span className="label-pro opacity-60">{kpi.label}</span>
              <div className={`w-8 h-8 rounded-lg bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-500 text-xs border border-${kpi.color}-500/20`}>
                <i className={`fa-solid ${kpi.icon}`}></i>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white mono">R$ {kpi.val.toLocaleString()}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase mono">{kpi.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 md:p-12 rounded-[3rem] relative overflow-hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight italic">Performance do Fluxo</h3>
                <p className="label-pro mt-2">Data Engine V2.0 // Real-time Tracking</p>
              </div>
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                {['6M', '3M', '1M'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === '6M' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                ))}
              </div>
           </div>
           
           <div className="h-[340px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={getChartData()}>
                 <defs>
                   <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} 
                    dy={20}
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#475569', fontSize: 10, fontWeight: 700}}
                    dx={-10}
                 />
                 <Tooltip 
                   cursor={{ stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 1 }}
                   contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} 
                 />
                 <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fill="url(#chartGradient)" 
                    animationDuration={2000} 
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399' }}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           {/* AI Market Widget */}
           <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/[0.03] to-transparent border-emerald-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400">
                  <i className="fa-solid fa-microchip"></i>
                </div>
                <div>
                   <h3 className="text-xs font-black text-white uppercase tracking-widest">Market Feed</h3>
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Live Sync</span>
                </div>
              </div>

              {!marketInsights ? (
                <div className="space-y-6">
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">Monitore taxas do mercado financeiro e inflação em tempo real via Gemini Brain.</p>
                  <button 
                    onClick={fetchMarketTrends}
                    disabled={isSearching}
                    className="w-full py-4 bg-white/5 hover:bg-emerald-500 hover:text-slate-950 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Sync Market Data'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[11px] text-emerald-400 leading-relaxed font-bold italic">{marketInsights}</p>
                  </div>
                  <button onClick={() => setMarketInsights(null)} className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Clear Stream</button>
                </div>
              )}
           </div>

           {/* Quick Status */}
           <div className="glass-card p-8 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-8">
                 <span className="label-pro">Health Index</span>
                 <span className="text-[10px] font-black text-emerald-500">+12% vs last month</span>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900" />
                       <circle 
                          cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                          strokeDasharray={364}
                          strokeDashoffset={364 - (364 * totals.cashHealth / 100)}
                          className="text-emerald-500 shadow-[0_0_10px_#10b981]" 
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-white mono">{totals.cashHealth}%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
