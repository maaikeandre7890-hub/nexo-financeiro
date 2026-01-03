import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { AddReceivableModal } from '../components/Modals';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const { totals, getChartData } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marketInsights, setMarketInsights] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Saudação Dinâmica
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const fetchMarketTrends = async () => {
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY
      });

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: "Qual o valor do CDI e IPCA acumulado hoje no Brasil? Responda de forma curta.",
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

      {/* 🔴 MARCADOR DE DEPLOY – NÃO REMOVER */}
      <div style={{
        position: 'fixed',
        top: 12,
        right: 12,
        background: 'red',
        color: 'white',
        padding: '8px 12px',
        fontSize: '10px',
        fontWeight: 900,
        zIndex: 99999,
        borderRadius: 6
      }}>
        DASHBOARD ATUALIZADO ✔
      </div>

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-[-0.04em] leading-none">
            {greeting}<span className="text-emerald-500">.</span>
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Saúde Operacional
            </span>
            <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${totals.cashHealth}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-white mono">
              {totals.cashHealth}%
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-white text-black rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-400 active:scale-95 shadow-xl"
        >
          Nova Operação
        </button>
      </section>

      {/* RESTANTE DO SEU CÓDIGO CONTINUA IGUAL */}
      {/* KPI, Chart, Gemini Brain, etc… */}

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
