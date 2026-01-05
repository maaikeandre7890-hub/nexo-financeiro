
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { totals, state, getChartData, formatNumber } = useApp();
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = state.userName ? state.userName.split(' ')[0] : 'Gestor';

  return (
    <div className="space-y-6 md:space-y-10 py-4 page-enter">
      <section className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
            {greeting}, <span className="text-emerald-500">{firstName}</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[var(--text-muted)]">Performance financeira atualizada.</p>
        </div>
        <button 
          onClick={() => navigate('/clientes/novo')}
          className="w-full md:w-auto px-8 py-3.5 bg-emerald-500 text-[#0B0D10] text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
        >
          Nova Operação
        </button>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: 'Receitas no Mês', val: totals.paid, color: 'text-emerald-500', sub: 'Consolidado' },
          { label: 'A Receber', val: totals.toReceive, color: 'text-[var(--text-main)]', sub: 'Pendente' },
          { label: 'Atraso Exposto', val: totals.overdue, color: 'text-rose-500', sub: 'Inadimplência' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card p-5 sm:p-6 flex flex-col justify-between h-32 sm:h-36">
            <p className="text-[9px] sm:text-[10px] font-black text-[var(--text-deep)] uppercase tracking-widest">{kpi.label}</p>
            <div>
              <p className={`text-xl sm:text-2xl font-bold ${kpi.color} mono tracking-tighter`}>R$ {formatNumber(kpi.val)}</p>
              <p className="text-[8px] sm:text-[9px] text-[var(--text-deep)] font-bold mt-1 uppercase tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card p-6 sm:p-8 flex flex-col justify-between min-h-[250px] sm:min-h-[300px]">
           <div className="space-y-4 sm:space-y-6">
              <span className="text-[10px] sm:text-[11px] font-black text-[var(--text-deep)] uppercase tracking-widest">Base Mensal (MRR)</span>
              <div className="space-y-1">
                 <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] mono">R$ {formatNumber(totals.monthlyRecurring)}</h2>
                 <p className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)]">Potencial Bruto Mensal</p>
              </div>
           </div>
           <div className="pt-6 sm:pt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] sm:text-[10px] font-black text-[var(--text-deep)] uppercase">Saúde Financeira</span>
                <span className="text-xs font-bold text-emerald-500 mono">{totals.cashHealth}%</span>
              </div>
              <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${totals.cashHealth}%` }}></div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card p-6 sm:p-8 h-[350px] sm:h-[450px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 sm:mb-10 relative z-10">
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Forecast Semestral</h3>
              <p className="text-[8px] sm:text-[10px] font-bold text-[var(--text-deep)] uppercase leading-relaxed max-w-[280px]">
                Estimativa de fluxo de caixa projetada para os próximos 6 meses.
              </p>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8A8D91', fontSize: 9, fontWeight: 700}} dy={15} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#15181D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#8A8D91', fontSize: '9px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'black' }}
                  formatter={(value: number) => `R$ ${formatNumber(value)}`}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
