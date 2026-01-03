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

  const quoteOfTheDay = useMemo(() => {
    const quotes = [
      "Estratégia sem tática é o caminho mais lento para a vitória.",
      "A melhor forma de prever o futuro é criá-lo.",
      "No meio da dificuldade encontra-se a oportunidade.",
      "Gestão é fazer as coisas bem; liderança é fazer as coisas certas.",
      "Inovação distingue um líder de um seguidor.",
      "O que não pode ser medido, não pode ser gerenciado.",
      "A disciplina é a alma de um exército; torna grandes as pequenas forças."
    ];
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return quotes[dayOfYear % quotes.length];
  }, []);

  const criticalOverdue = useMemo(() => {
    return state.receivables.filter(r => r.status === 'Atrasado').slice(0, 3);
  }, [state.receivables]);

  return (
    <div className="space-y-10 py-2 page-enter">

      {/* 🔴 MARCADOR DE BUILD – TESTE */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          background: '#dc2626',
          color: '#fff',
          padding: '6px 10px',
          fontSize: '10px',
          fontWeight: 900,
          borderRadius: 6,
          zIndex: 99999
        }}
      >
        DASHBOARD ATUALIZADO
      </div>

      {/* Hero: Liquidez Atual */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            {greeting}<span className="text-emerald-500">.</span>
          </h1>

          <p className="text-[12px] md:text-[13px] text-zinc-500 font-medium mt-4 italic max-w-md border-l border-emerald-500/30 pl-4">
            "{quoteOfTheDay}"
          </p>

          <p className="text-zinc-600 font-bold mt-6 text-[10px] uppercase tracking-widest flex items-center gap-2">
            Status do caixa:
            <span className={`font-black ${totals.netBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {totals.netBalance >= 0 ? 'SUPERAVITÁRIO' : 'DÉFICIT ATIVO'}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">
            Disponibilidade Líquida
          </span>
          <div className="text-4xl font-black text-white mono tracking-tighter">
            R$ {totals.netBalance.toLocaleString()}
          </div>
        </div>
      </section>

      {/* RESTANTE DO SEU CÓDIGO CONTINUA IGUAL */}
      {/* KPIs, Gráfico, Ações, Modal */}

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
