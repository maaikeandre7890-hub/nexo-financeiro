
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const { totals, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marketInsights, setMarketInsights] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMarketTrends = async () => {
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Qual o valor do CDI e IPCA acumulado hoje no Brasil? Responda de forma curta.",
        config: { tools: [{ googleSearch: {} }] },
      });
      setMarketInsights(response.text);
    } catch (e) {
      setMarketInsights("Sync offline.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-1000">
      {/* Header Executive Simplified */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl heading-pro text-white leading-none tracking-tighter">
            Boa noite<span className="text-emerald-500">.</span>
          </h1>
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Fluxo Saudável</span>
            </div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Health Index: <span className="text-white">{totals.cashHealth}%</span></p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          Nova Operação
        </button>
      </section>

      {/* Bento Grid High-End */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Liquidez Pendente', val: totals.toReceive, suffix: 'BRL', color: 'emerald', icon: 'fa-vault' },
          { label: 'Risco Ativo', val: totals.overdue, suffix: 'BRL', color: 'rose', icon: 'fa-shield-exclamation' },
          { label: 'MRR / Recorrência', val: totals.monthlyRecurring, suffix: 'MRR', color: 'blue', icon: 'fa-arrows-spin' },
          { label: 'Net Liquidity', val: totals.netBalance, suffix: 'LÍQ', color: 'slate', icon: 'fa-chart-network' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-10">
              <span className="label-pro opacity-40">{kpi.label}</span>
              <i className={`fa-solid ${kpi.icon} text-slate-700 text-[10px] group-hover:text-emerald-500 transition-colors`}></i>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white mono tracking-tighter">R$ {kpi.val.toLocaleString()}</span>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{kpi.suffix}</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/20 w-0 group-hover:w-full transition-all duration-700"></div>
          </div>
        ))}
      </div>

      {/* Main Analysis Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 md:p-14 rounded-[3rem]">
           <div className="flex justify-between items-center mb-16">
              <div>
                <h3 className="text-2xl font-black text-white heading-pro italic">Operational Yield</h3>
                <p className="label-pro mt-3 text-slate-600">Period: Last 6 Months // Data: Real-time</p>
              </div>
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                 {['6M', '3M', '1M'].map(t => (
                   <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === '6M' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                 ))}
              </div>
           </div>
           
           <div className="h-[380px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={getChartData()}>
                 <defs>
                   <linearGradient id="proGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.02)" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} dy={20}/>
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} dx={-15}/>
                 <Tooltip contentStyle={{ backgroundColor: '#02040a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '15px' }} />
                 <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#proGradient)" animationDuration={3000} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-8">
           {/* Market Terminal */}
           <div className="glass-card p-10 rounded-[2.5rem] border-emerald-500/10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-blue-400">
                     <i className="fa-solid fa-satellite-dish text-xl"></i>
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Market Node</h4>
                     <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></span>
                        Deep Search Active
                     </span>
                   </div>
                </div>

                {!marketInsights ? (
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">Sincronize com o cérebro central para insights macroeconômicos em tempo real via Gemini Brain.</p>
                ) : (
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-[11px] text-slate-300 font-bold leading-relaxed">{marketInsights}</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={fetchMarketTrends}
                disabled={isSearching}
                className="w-full py-5 mt-8 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Sync External Data'}
              </button>
           </div>

           {/* Precision Health Index */}
           <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
              <div className="relative w-40 h-40 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                    <circle 
                       cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" 
                       strokeDasharray={452}
                       strokeDashoffset={452 - (452 * totals.cashHealth / 100)}
                       strokeLinecap="round"
                       className="text-emerald-500 drop-shadow-[0_0_10px_#10b981]" 
                    />
                 </svg>
                 <span className="absolute text-4xl font-black text-white mono">{totals.cashHealth}%</span>
              </div>
              <p className="label-pro mt-8 opacity-50">Operational Capacity</p>
           </div>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
