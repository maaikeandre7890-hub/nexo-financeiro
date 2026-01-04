
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';
import OracleIcon from '../components/OracleIcon';
import BrandLogo from '../components/BrandLogo';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData, formatNumber } = useApp();
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = state.userName ? state.userName.split(' ')[0] : 'Empreendedor';

  return (
    <div className="space-y-16 py-6 page-enter">
      {/* Header Simplificado */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Painel de Controle do Seu Negócio</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.1] italic uppercase">
            {greeting}, <br/><span className="text-emerald-500">{firstName}.</span>
          </h1>
        </div>
        <button 
          onClick={() => navigate('/clientes/novo')}
          className="w-full md:w-auto px-14 py-6 bg-emerald-500 text-slate-950 text-[13px] font-black uppercase rounded-[2rem] hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]"
        >
          Cadastrar Venda
        </button>
      </section>

      {/* KPIs Reais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: 'Entradas do Mês', val: totals.toReceive, color: 'text-emerald-500', sub: 'Previsto para este mês' },
          { label: 'Dinheiro em Atraso', val: totals.overdue, color: 'text-rose-500', sub: 'Clientes que não pagaram' },
          { label: 'Resultado do Mês', val: totals.netBalance, color: 'text-white', sub: 'O que sobrou após as contas' }
        ].map((kpi, idx) => (
          <div key={idx} className={`glass-card p-10 rounded-[3rem] flex flex-col justify-between h-60 group relative transition-all duration-500 hover:-translate-y-1`}>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{kpi.label}</p>
            <div>
              <p className={`text-4xl font-black ${kpi.color} mono tracking-tighter`}>R$ {formatNumber(kpi.val)}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase mt-3 tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Oráculo de Inteligência */}
        <div className="glass-card p-10 rounded-[3.5rem] flex flex-col items-start gap-8 border-emerald-500/10 relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent"></div>
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 relative z-10">
            <OracleIcon className="w-8 h-8" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">NEXO IA: Conselheira Digital</span>
            <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
              "Sua saúde de caixa está em <span className="text-emerald-500 font-black">{totals.cashHealth}%</span>. 
              {totals.overdue > 0 ? ` Se você cobrar os R$ ${formatNumber(totals.overdue)} em atraso, seu lucro sobe na hora.` : " Parabéns, todos os seus clientes estão em dia!"}
            </p>
          </div>
        </div>

        {/* Card de Faturamento Recorrente */}
        <div className="glass-card p-10 rounded-[3.5rem] border-white/5 relative overflow-hidden flex flex-col justify-between group h-full bg-[#030d12]">
           <div className="relative z-10 space-y-6">
              <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em]">Faturamento Recorrente</span>
              <div className="space-y-1">
                 <h2 className="text-4xl font-black text-white mono tracking-tighter">R$ {formatNumber(totals.monthlyRecurring)}</h2>
                 <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Sua base de clientes ativos</p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Este é o valor que você recebe todo mês se ninguém cancelar.
              </p>
           </div>
           <button 
             onClick={() => navigate('/cobranca-automatica')}
             className="relative z-10 mt-6 w-full py-5 bg-emerald-500 text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-400 transition-all shadow-lg">
             Cobrar Inadimplentes
           </button>
        </div>
      </div>

      {/* Gráfico Real */}
      <div className="glass-card p-12 rounded-[4rem] relative overflow-hidden h-[500px]">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Previsão de Dinheiro Entrando (Próximos 6 meses)</h3>
        </div>
        {state.receivables.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 900}} dy={15} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                contentStyle={{ backgroundColor: '#020608', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', padding: '15px' }}
                itemStyle={{ color: '#10b981', fontSize: '14px', fontWeight: '900' }}
                labelStyle={{ color: '#475569', fontSize: '10px', marginBottom: '5px', textTransform: 'uppercase' }}
                formatter={(value: number) => `R$ ${formatNumber(value)}`}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fill="url(#chartGrad)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
            <i className="fa-solid fa-chart-line text-8xl mb-6"></i>
            <p className="text-[12px] font-black uppercase tracking-[0.4em]">Cadastre um cliente para ver a projeção</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
