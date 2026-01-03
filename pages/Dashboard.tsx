
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
      setMarketInsights("Falha na sincronização externa.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-12 py-4 page-enter">
      {/* Header Executive - Sério & Minimalista */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-[-0.04em] leading-none">
            Boa noite<span className="text-emerald-500">.</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Saúde Operacional</span>
            <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${totals.cashHealth}%` }}></div>
            </div>
            <span className="text-[10px] font-black text-white mono">{totals.cashHealth}%</span>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-white text-black rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-emerald-400 active:scale-95 shadow-xl luxury-border-glow"
        >
          Nova Operação
        </button>
      </section>

      {/* KPI Grid - Alta Legibilidade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Liquidez Pendente', val: totals.toReceive, suffix: 'BRL', icon: 'fa-vault' },
          { label: 'Risco Ativo', val: totals.overdue, suffix: 'BRL', icon: 'fa-triangle-exclamation' },
          { label: 'MRR Recorrente', val: totals.monthlyRecurring, suffix: 'MRR', icon: 'fa-rotate' },
          { label: 'Saldo Líquido', val: totals.netBalance, suffix: 'NET', icon: 'fa-chart-simple' },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-8 rounded-2xl luxury-border-glow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{kpi.label}</span>
              <i className={`fa-solid ${kpi.icon} text-zinc-800 text-[10px]`}></i>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white mono tracking-tighter">R$ {kpi.val.toLocaleString()}</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase">{kpi.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section - Analytics & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-10 rounded-2xl">
           <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Rendimento Operacional</h3>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Sincronização: Tempo Real</p>
              </div>
              <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
                 {['6M', '3M', '1M'].map(t => (
                   <button key={t} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${t === '6M' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600 hover:text-white'}`}>{t}</button>
                 ))}
              </div>
           </div>
           
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={getChartData()}>
                 <defs>
                   <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 700}} dy={15}/>
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 700}} dx={-10}/>
                 <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '10px' }} />
                 <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#chartGrad)" animationDuration={2000} dot={false} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           {/* Terminal de Insights Gemini */}
           <div className="glass-card p-10 rounded-2xl flex flex-col h-full bg-gradient-to-br from-zinc-900/40 to-black">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-emerald-500">
                   <i className="fa-solid fa-sparkles text-sm"></i>
                 </div>
                 <div>
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Nexo Brain</h4>
                   <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                      Analysis Ready
                   </span>
                 </div>
              </div>

              <div className="flex-1">
                {!marketInsights ? (
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Sincronize com o motor de busca do Gemini para insights de mercado e indicadores econômicos atuais.</p>
                ) : (
                  <div className="p-4 bg-black rounded-xl border border-white/5">
                    <p className="text-[11px] text-zinc-300 font-semibold leading-relaxed">{marketInsights}</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={fetchMarketTrends}
                disabled={isSearching}
                className="w-full py-4 mt-8 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest transition-all text-white border border-white/5 rounded-xl"
              >
                {isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Sincronizar Dados'}
              </button>
           </div>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
