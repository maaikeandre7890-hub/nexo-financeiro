
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

  // Lógica de Frase Motivacional Estratégica
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
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  const criticalOverdue = useMemo(() => {
    return state.receivables.filter(r => r.status === 'Atrasado').slice(0, 3);
  }, [state.receivables]);

  return (
    <div className="space-y-10 py-2 page-enter">
      {/* Hero: Liquidez Atual */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            {greeting}<span className="text-emerald-500">.</span>
          </h1>
          {/* Frase Motivacional Minimalista */}
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
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Disponibilidade Líquida</span>
          <div className="text-4xl font-black text-white mono tracking-tighter">
            R$ {totals.netBalance.toLocaleString()}
          </div>
        </div>
      </section>

      {/* KPIs de Operação Real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-8 rounded-2xl luxury-border-glow">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">A Receber (30 dias)</p>
          <p className="text-2xl font-black text-white mono">R$ {totals.toReceive.toLocaleString()}</p>
        </div>
        <div className="glass-card p-8 rounded-2xl border-rose-500/20">
          <p className="text-[9px] font-bold text-rose-500/60 uppercase tracking-widest mb-4">Inadimplência Atual</p>
          <p className="text-2xl font-black text-rose-500 mono">R$ {totals.overdue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-8 rounded-2xl">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Receita Recorrente (MRR)</p>
          <p className="text-2xl font-black text-emerald-500 mono">R$ {totals.monthlyRecurring.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Performance */}
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fluxo de Caixa Mensal</h3>
            <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full uppercase">Real vs Projetado</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #111', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Items: Pendências Críticas */}
        <div className="glass-card p-8 rounded-2xl border-white/5 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Ações Prioritárias</h3>
          <div className="space-y-4 flex-1">
            {criticalOverdue.length > 0 ? (
              criticalOverdue.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl bg-zinc-900/50 border border-rose-500/10 flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-bold text-white truncate w-32">{rec.clientName}</p>
                    <p className="text-[9px] text-rose-500 font-bold mt-1">Vencido em {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <button 
                    onClick={() => markAsPaid(rec.id)}
                    className="p-2 hover:text-emerald-500 transition-colors"
                  >
                    <i className="fa-solid fa-circle-check"></i>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <i className="fa-solid fa-shield-check text-2xl mb-3"></i>
                <p className="text-[10px] font-bold uppercase tracking-widest">Sem pendências críticas</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 mt-6 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all"
          >
            Lançar Receita
          </button>
        </div>
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
