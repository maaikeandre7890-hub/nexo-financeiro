
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Relatorios: React.FC = () => {
  const { state, totals, formatNumber } = useApp();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = [2024, 2025, 2026];
  const currentMonthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  const generatePDF = (type: 'Simples' | 'Executivo' | 'Detalhado') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const header = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="font-family: 'Inter', sans-serif;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #020608;">NEXO<span style="color: #10b981;">.</span></h1>
          <p style="margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: #64748b;">Intelligence & Capital Management</p>
        </div>
        <div style="text-align: right; font-family: 'Inter', sans-serif;">
          <h2 style="margin: 0; font-size: 14px; font-weight: 900; text-transform: uppercase; color: #020608;">Relatório ${type}</h2>
          <p style="margin: 0; font-size: 11px; font-weight: 600; color: #64748b;">Período: ${months[selectedMonth]} / ${selectedYear}</p>
        </div>
      </div>
    `;

    let content = '';

    if (type === 'Simples') {
      const paid = state.receivables.filter(r => r.status === 'Pago' && r.dueDate.startsWith(currentMonthPrefix)).reduce((a, b) => a + b.amount, 0);
      const pending = state.receivables.filter(r => r.status === 'Pendente' && r.dueDate.startsWith(currentMonthPrefix)).reduce((a, b) => a + b.amount, 0);
      const overdue = state.receivables.filter(r => (r.status === 'Atrasado' || (r.status === 'Pendente' && r.dueDate < new Date().toISOString())) && r.dueDate.startsWith(currentMonthPrefix)).reduce((a, b) => a + b.amount, 0);
      const monthlyValue = state.clients.reduce((a, b) => a + b.monthlyValue, 0);

      content = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Total Recebido</p>
            <h3 style="font-size: 24px; font-weight: 900; margin: 0; color: #10b981;">R$ ${formatNumber(paid)}</h3>
          </div>
          <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Total em Aberto</p>
            <h3 style="font-size: 24px; font-weight: 900; margin: 0; color: #020608;">R$ ${formatNumber(pending)}</h3>
          </div>
          <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Total em Atraso</p>
            <h3 style="font-size: 24px; font-weight: 900; margin: 0; color: #ef4444;">R$ ${formatNumber(overdue)}</h3>
          </div>
          <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Dinheiro a Entrar (Mensal)</p>
            <h3 style="font-size: 24px; font-weight: 900; margin: 0; color: #3b82f6;">R$ ${formatNumber(monthlyValue)}</h3>
          </div>
          <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Clientes Ativos</p>
            <h3 style="font-size: 24px; font-weight: 900; margin: 0; color: #020608;">${state.clients.length} Unidades</h3>
          </div>
        </div>
      `;
    } else if (type === 'Executivo') {
      const recurring = state.clients.reduce((a, b) => a + b.monthlyValue, 0);
      const renegRecs = state.receivables.filter(r => r.category === 'Renegociação' && r.status !== 'Pago');
      const renegValue = renegRecs.reduce((a, b) => a + b.amount, 0);
      const overdueCount = state.receivables.filter(r => r.status === 'Atrasado').length;
      const inadimplencia = state.receivables.length > 0 ? (overdueCount / state.receivables.length) * 100 : 0;

      content = `
        <div style="background: #f8fafc; padding: 30px; border-radius: 15px; margin-bottom: 30px;">
          <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #10b981;">Resumo Executivo</h4>
          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; font-style: italic;">
            "A operação encerra o período com uma receita recorrente de R$ ${formatNumber(recurring)}. 
            Identificamos ${renegRecs.length} renegociações ativas totalizando R$ ${formatNumber(renegValue)} em fase de recuperação. 
            O índice de inadimplência estratégica está fixado em ${inadimplencia.toFixed(1)}%."
          </p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
           <div style="border: 1px solid #f1f5f9; padding: 15px; border-radius: 10px;">
             <span style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Receita Mensal Atual</span>
             <div style="font-size: 18px; font-weight: 900;">R$ ${formatNumber(recurring)}</div>
           </div>
           <div style="border: 1px solid #f1f5f9; padding: 15px; border-radius: 10px;">
             <span style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Inadimplentes</span>
             <div style="font-size: 18px; font-weight: 900; color: #ef4444;">${overdueCount} Clientes</div>
           </div>
           <div style="border: 1px solid #f1f5f9; padding: 15px; border-radius: 10px;">
             <span style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Acordos Ativos</span>
             <div style="font-size: 18px; font-weight: 900; color: #f59e0b;">${renegRecs.length} Renegociações</div>
           </div>
           <div style="border: 1px solid #f1f5f9; padding: 15px; border-radius: 10px;">
             <span style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Taxa Inadimplência</span>
             <div style="font-size: 18px; font-weight: 900;">${inadimplencia.toFixed(2)}%</div>
           </div>
        </div>
      `;
    } else {
      content = `
        <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
          <thead>
            <tr style="background: #f8fafc; text-align: left; border-bottom: 2px solid #e2e8f0;">
              <th style="padding: 12px; font-size: 9px; text-transform: uppercase; color: #64748b;">Cliente / CPF-CNPJ</th>
              <th style="padding: 12px; font-size: 9px; text-transform: uppercase; color: #64748b;">Valor Mensal</th>
              <th style="padding: 12px; font-size: 9px; text-transform: uppercase; color: #64748b;">Parcelas (P / T)</th>
              <th style="padding: 12px; font-size: 9px; text-transform: uppercase; color: #64748b;">Situação</th>
            </tr>
          </thead>
          <tbody>
            ${state.clients.map(c => {
              const recs = state.receivables.filter(r => r.clientId === c.id);
              const paid = recs.filter(r => r.status === 'Pago').length;
              return `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px;">
                    <div style="font-size: 11px; font-weight: 700; color: #020608;">${c.name}</div>
                    <div style="font-size: 9px; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">${c.document}</div>
                  </td>
                  <td style="padding: 12px; font-size: 11px; font-weight: 700;">R$ ${formatNumber(c.monthlyValue)}</td>
                  <td style="padding: 12px; font-size: 11px;">${paid} / ${c.installments}</td>
                  <td style="padding: 12px;">
                    <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; background: ${c.status === 'Ativo' ? '#ecfdf5' : '#fef2f2'}; color: ${c.status === 'Ativo' ? '#10b981' : '#ef4444'};">
                      ${c.status}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    const html = `
      <html>
        <head>
          <title>NEXO - Relatório ${type}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; color: #020608; padding: 40px; margin: 0; background: #fff; line-height: 1.4; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          ${header}
          ${content}
          <div style="margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 9px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px;">
            Documento Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} • Sistema NEXO
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const cardClass = "glass-card p-10 rounded-[3.5rem] border-white/5 flex flex-col justify-between hover:border-emerald-500/20 transition-all bg-[#020608] group min-h-[400px]";
  const btnClass = "w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl";

  return (
    <div className="space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Documentação Estratégica</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Relatórios<br/><span className="text-slate-600">Exportáveis.</span></h1>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5 shadow-inner">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-transparent border-none text-[11px] font-black uppercase text-slate-400 focus:text-white outline-none cursor-pointer px-4"
          >
            {months.map((m, i) => <option key={i} value={i} className="bg-[#020608]">{m}</option>)}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent border-none text-[11px] font-black uppercase text-slate-400 focus:text-white outline-none cursor-pointer px-4"
          >
            {years.map(y => <option key={y} value={y} className="bg-[#020608]">{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cardClass}>
           <div className="space-y-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-file-invoice text-xl"></i>
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Relatório Simples</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                Resumo rápido: Recebidos, Pendentes, Atrasados e Receita Prevista mensal.
              </p>
           </div>
           <button onClick={() => generatePDF('Simples')} className={btnClass}>
             <i className="fa-solid fa-print"></i> GERAR PDF
           </button>
        </div>

        <div className={cardClass}>
           <div className="space-y-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/5 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-briefcase text-xl"></i>
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Relatório Executivo</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                Visão de tomada de decisão: Inadimplência, Renegociações e Resumo Narrativo.
              </p>
           </div>
           <button onClick={() => generatePDF('Executivo')} className={btnClass}>
             <i className="fa-solid fa-print"></i> GERAR PDF
           </button>
        </div>

        <div className={cardClass}>
           <div className="space-y-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/5 group-hover:bg-blue-500 group-hover:text-black transition-all">
                <i className="fa-solid fa-database text-xl"></i>
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Relatório Detalhado</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                Controle contador: Lista completa com documentos, plano de parcelas e status por cliente.
              </p>
           </div>
           <button onClick={() => generatePDF('Detalhado')} className={btnClass}>
             <i className="fa-solid fa-print"></i> GERAR PDF
           </button>
        </div>
      </div>

      <div className="p-10 glass-card rounded-[3rem] border-white/5 bg-[#030d12] flex items-center gap-8">
         <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center text-slate-600 text-xl border border-white/5">
            <i className="fa-solid fa-circle-info"></i>
         </div>
         <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
           <strong className="text-white uppercase tracking-widest text-[10px]">Auditado:</strong> Os relatórios gerados nesta seção são consolidados em tempo real a partir da sua base de dados segura. Os arquivos PDF são abertos em uma nova aba prontos para salvamento ou impressão direta.
         </p>
      </div>
    </div>
  );
};

export default Relatorios;
