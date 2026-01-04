
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Relatorios: React.FC = () => {
  const { state, formatNumber } = useApp();
  
  // Estado para controle de período
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = [2023, 2024, 2025];

  // Lógica de filtragem baseada no período selecionado
  const filteredData = useMemo(() => {
    const isWithinPeriod = (dateStr: string) => {
      const d = new Date(dateStr);
      // d.getMonth() é 0-indexed, d.getUTCMonth() pode ser mais seguro dependendo do formato
      // mas como as datas vêm de forms YYYY-MM-DD, vamos normalizar:
      const dateParts = dateStr.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // 0-indexed
        return year === selectedYear && month === selectedMonth;
      }
      return false;
    };

    const paidIncome = state.receivables
      .filter(r => r.status === 'Pago' && isWithinPeriod(r.dueDate))
      .reduce((a, b) => a + b.amount, 0);

    const periodExpenses = state.expenses
      .filter(e => isWithinPeriod(e.date))
      .reduce((a, b) => a + b.amount, 0);

    const netBalance = paidIncome - periodExpenses;

    const totalPeriodReceivables = state.receivables.filter(r => isWithinPeriod(r.dueDate)).length;
    const paidPeriodReceivables = state.receivables.filter(r => r.status === 'Pago' && isWithinPeriod(r.dueDate)).length;
    
    const cashHealth = totalPeriodReceivables > 0 
      ? Math.floor((paidPeriodReceivables / totalPeriodReceivables) * 100) 
      : 0;

    const overdueAmount = state.receivables
      .filter(r => r.status === 'Atrasado' && isWithinPeriod(r.dueDate))
      .reduce((a, b) => a + b.amount, 0);

    return { 
      paidIncome, 
      periodExpenses, 
      netBalance, 
      cashHealth, 
      overdueAmount 
    };
  }, [state.receivables, state.expenses, selectedMonth, selectedYear]);

  const dre = [
    { label: 'Total Recebido (Entradas Reais)', val: filteredData.paidIncome, color: 'text-emerald-500' },
    { label: 'Total Gasto (Contas e Despesas)', val: -filteredData.periodExpenses, color: 'text-rose-500' },
    { label: 'Resultado Líquido (Lucro Real)', val: filteredData.netBalance, color: filteredData.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400', isBold: true },
  ];

  const handlePrint = () => {
    window.print();
  };

  const selectClass = "bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:border-emerald-500/50 outline-none transition-all cursor-pointer hover:bg-white/5";

  return (
    <div className="space-y-12 py-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Consolidação Financeira</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Resumo do <br/><span className="text-slate-600">Negócio.</span></h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Seletor de Período */}
          <div className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5 shadow-inner w-full sm:w-auto">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={selectClass}
            >
              {months.map((m, i) => (
                <option key={i} value={i} className="bg-[#07131A] text-white">{m}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={selectClass}
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-[#07131A] text-white">{y}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto bg-white text-slate-950 font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl active:scale-95"
          >
            <i className="fa-solid fa-print"></i>
            Gerar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Card de DRE Principal */}
        <div id="printable-dre" className="glass-card p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors"></div>
           
           <div className="flex justify-between items-center border-b border-white/5 pb-8 relative z-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Demonstrativo Financeiro</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nexo Intelligence Platform</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block">{months[selectedMonth]}</span>
                <span className="text-sm font-black text-white mono">{selectedYear}</span>
              </div>
           </div>
           
           <div className="space-y-8 relative z-10">
              {dre.map((item, i) => (
                <div key={i} className={`flex justify-between items-center ${item.isBold ? 'pt-10 border-t border-white/10' : ''}`}>
                   <span className={`text-xs ${item.isBold ? 'font-black text-white uppercase tracking-widest' : 'font-bold text-slate-400'}`}>{item.label}</span>
                   <span className={`text-2xl font-black mono ${item.color}`}>R$ {formatNumber(item.val)}</span>
                </div>
              ))}
           </div>

           <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
              <p className="text-[9px] font-bold text-slate-600 uppercase text-center leading-relaxed tracking-widest">
                Documento de Auditoria Interna • Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </p>
           </div>
        </div>

        {/* Dash de Indicadores Secundários */}
        <div className="grid grid-cols-1 gap-6 h-full">
          <div className="glass-card p-10 rounded-[3rem] border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Margem de Lucro Real</p>
                <h4 className="text-4xl font-black text-white tracking-tighter italic">
                  {filteredData.paidIncome > 0 
                    ? formatNumber((filteredData.netBalance / filteredData.paidIncome) * 100, 1)
                    : 0}%
                </h4>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">Baseado em entradas efetivadas</p>
             </div>
             <div className="w-16 h-16 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chart-line text-2xl"></i>
             </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Índice de Pontualidade</p>
                <h4 className="text-4xl font-black text-white tracking-tighter italic">
                  {filteredData.cashHealth > 80 ? 'Superior' : filteredData.cashHealth > 50 ? 'Médio' : 'Crítico'}
                </h4>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2">{filteredData.cashHealth}% de eficiência</p>
             </div>
             <div className="w-16 h-16 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-shield-check text-2xl"></i>
             </div>
          </div>
          
          <div className="glass-card p-10 rounded-[3rem] border-rose-500/10 bg-rose-500/[0.01] flex items-center justify-between group hover:border-rose-500/30 transition-all">
             <div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Inadimplência no Período</p>
                <h4 className="text-4xl font-black text-white tracking-tighter italic">
                  R$ {formatNumber(filteredData.overdueAmount)}
                </h4>
                <p className="text-[8px] font-black text-rose-500/40 uppercase tracking-widest mt-2">Capital aguardando recuperação</p>
             </div>
             <div className="w-16 h-16 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-hand-holding-dollar text-2xl"></i>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-dre, #printable-dre * { visibility: visible !important; }
          #printable-dre { 
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            background: white !important;
            color: black !important;
            border: 2px solid #000 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 40px !important;
          }
          #printable-dre * { color: black !important; text-shadow: none !important; }
          .light-theme #printable-dre { background: white !important; }
          #printable-dre .text-emerald-500, #printable-dre .text-rose-500, #printable-dre .text-emerald-400 { color: black !important; font-weight: 900 !important; }
          #printable-dre .border-white\/5, #printable-dre .border-white\/10 { border-color: #eee !important; }
        }
      `}</style>
    </div>
  );
};

export default Relatorios;
