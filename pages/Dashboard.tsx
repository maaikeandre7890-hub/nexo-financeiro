
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const { totals, state, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marketInsights, setMarketInsights] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMarketTrends = async () => {
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Qual a taxa Selic hoje e a tendência de inadimplência para PMEs no Brasil no último trimestre?",
        config: { tools: [{ googleSearch: {} }] },
      });
      setMarketInsights(response.text);
    } catch (e) {
      setMarketInsights("Falha ao sincronizar dados de mercado. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter italic group-hover:text-emerald-400 transition-colors">Centro de Comando</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Live Operations</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium italic text-sm">Monitorando <span className="text-white font-bold">{state.clients.length} entidades</span> sob gestão direta.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center md:items-start group hover:border-blue-500/30 transition-all cursor-default">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Taxa de Liquidez</span>
            <span className="text-xl font-bold text-white mono">{totals.cashHealth}%</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3 rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-bolt"></i>
            Nova Operação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Fluxo Pendente', val: `R$ ${(totals.toReceive / 1000).toFixed(1)}k`, trend: 'Ativo', icon: 'fa-money-bill-trend-up', color: 'text-emerald-500' },
          { label: 'Exposição a Risco', val: `R$ ${(totals.overdue / 1000).toFixed(1)}k`, trend: 'Crítico', icon: 'fa-triangle-exclamation', color: 'text-rose-500' },
          { label: 'Recorrência (MRR)', val: `R$ ${(totals.monthlyRecurring / 1000).toFixed(1)}k`, trend: 'Saudável', icon: 'fa-repeat', color: 'text-blue-500' },
          { label: 'Saldo de Caixa', val: `R$ ${(totals.netBalance / 1000).toFixed(1)}k`, trend: 'Real', icon: 'fa-piggy-bank', color: 'text-amber-500' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 group hover:border-emerald-500/20 transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center ${kpi.color} text-xl shadow-inner border border-white/5`}>
                <i className={`fa-solid ${kpi.icon}`}></i>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${i === 1 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-2xl font-extrabold text-white mono tracking-tighter">{kpi.val}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 md:p-10 rounded-[2.5rem] relative group">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight italic underline decoration-emerald-500/30 decoration-4">Fluxo Dinâmico</h3>
                <p className="text-slate-500 text-sm italic font-medium">Histórico real de faturamento consolidado.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-500 hover:text-white transition-all"><i className="fa-solid fa-download"></i></button>
              </div>
           </div>
           <div className="h-[250px] md:h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={getChartData()}>
                 <defs>
                   <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} />
                 <Tooltip 
                   cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }} 
                   labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fill="url(#glow)" animationDuration={2000} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900/50 to-black relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <i className="fa-solid fa-earth-americas text-6xl text-blue-500"></i>
              </div>
              <h3 className="text-sm font-black text-white mb-4 uppercase tracking-[0.2em]">Mercado & Tendências</h3>
              
              {!marketInsights ? (
                <button 
                  onClick={fetchMarketTrends}
                  disabled={isSearching}
                  className="w-full py-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-2xl text-blue-400 text-xs font-black uppercase tracking-widest transition-all"
                >
                  {isSearching ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Sincronizar Tendências'}
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">{marketInsights.slice(0, 200)}...</p>
                  <button onClick={() => setMarketInsights(null)} className="text-[10px] font-black text-blue-500 uppercase">Atualizar</button>
                </div>
              )}
           </div>

           <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Eficiência Operacional</p>
              <div className="flex items-end gap-3">
                 <h4 className="text-4xl font-black text-white mono">{totals.cashHealth}%</h4>
                 <span className="text-emerald-500 text-xs font-bold mb-1"><i className="fa-solid fa-caret-up"></i> Ótimo</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full mt-4 overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
