
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

  const firstName = state.userName ? state.userName.split(' ')[0] : 'Empreendedor';

  return (
    <div className="space-y-8 py-2 page-enter">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">RESUMO DO SEU NEGÓCIO</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
            {greeting}, {firstName}<span className="text-emerald-500">.</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-10 py-4 bg-white text-slate-950 text-[11px] font-black uppercase rounded-2xl active:scale-95 shadow-xl hover:bg-emerald-400 transition-colors"
        >
          Novo Lançamento
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between h-44">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dinheiro para Receber</p>
          <div>
            <p className="text-3xl font-black text-white mono">R$ {totals.toReceive.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase mt-2">Total Pendente</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between h-44 border-rose-500/10">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Contas Atrasadas</p>
          <div>
            <p className="text-3xl font-black text-rose-500 mono">R$ {totals.overdue.toLocaleString()}</p>
            <p className="text-[10px] text-rose-700 font-bold uppercase mt-2">Ação Necessária</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between h-44">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo que sobrou</p>
          <div>
            <p className={`text-3xl font-black mono ${totals.netBalance >= 0 ? 'text-white' : 'text-rose-500'}`}>
              R$ {totals.netBalance.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase mt-2">Saldo Real do Mês</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] border-emerald-500/10 flex flex-col md:flex-row items-center gap-8 group">
        <div className="w-16 h-16 oracle-chip rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
          <OracleIcon className="w-10 h-10 nexus-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Papo do Oráculo</h4>
          {state.receivables.length === 0 ? (
            <p className="text-sm text-slate-400 leading-relaxed italic">
              "Bem-vindo, <span className="text-white font-bold">{firstName}</span>. O painel da <span className="text-white font-bold">{state.companyName}</span> está zerado e pronto. Me conte o que você vendeu hoje para começarmos!"
            </p>
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed italic">
              "Olá {firstName}, sua organização está em <span className="text-white font-bold">{totals.cashHealth}%</span>. 
              Dos <span className="text-white">R$ {totals.paid.toLocaleString()}</span> que já entraram, 
              seu lucro real é o motor que vai fazer a <span className="text-white font-bold">{state.companyName}</span> crescer."
            </p>
          )}
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden h-[400px]">
        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Gráfico de Dinheiro que Entrou</h3>
        {state.receivables.filter(r => r.status === 'Pago').length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={getChartData()}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#07131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
            <i className="fa-solid fa-chart-line text-6xl mb-4"></i>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aguardando seus primeiros recebimentos</p>
          </div>
        )}
      </div>

      <AddReceivableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
