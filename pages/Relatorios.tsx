import React, { useState } from 'react';
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
            .no-print-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #0B0D10;
              padding: 16px 40px;
              margin: -40px -40px 40px -40px;
              position: sticky;
              top: 0;
              z-index: 1000;
              border-bottom: 1px solid rgba(255,255,255,0.1);
              color: white;
            }
            .btn-back {
              background: #10b981;
              color: #000;
              border: none;
              padding: 12px 24px;
              border-radius: 12px;
              font-weight: 900;
              font-size: 11px;
              text-transform: uppercase;
              cursor: pointer;
              letter-spacing: 1px;
              transition: all 0.2s;
            }
            .btn-back:hover { background: #059669; }
            @media print {
              .no-print-bar { display: none !important; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="no-print-bar">
            <button class="btn-back" onclick="window.close()">← Voltar para o App</button>
            <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #8A8D91;">
              Visualização de Relatório • NEXO Intelligence
            </div>
          </div>
          ${header}
          ${content}
          <div style="margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 9px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px;">
            Documento Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} • Sistema NEXO
          </div>
          <script>
            window.onload = () => { 
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const cardClass = `glass-card p-10 rounded-[3.5rem] flex flex-col justify-between transition-all group min-h-[400px] ${state.theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'border-white/5 bg-[#020608]'}`;
  const btnClass = "w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl";

  return (
    <div className="space-y-12 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Documentação Estratégica</span>
          </div>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Relatórios<br/><span className={`${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-600'}`}>Exportáveis.</span></h1>
        </div>

        <div className={`flex items-center gap-2 p-2 rounded-2xl border shadow-inner ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className={`bg-transparent border-none text-[11px] font-black uppercase outline-none cursor-pointer px-4 ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-slate-500 focus:text-emerald-500'}`}
          >
            {months.map((m, i) => <option key={i} value={i} className={state.theme === 'light' ? '' : 'bg-[#020608]'}>{m}</option>)}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={`bg-transparent border-none text-[11px] font-black uppercase outline-none cursor-pointer px-4 ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-slate-500 focus:text-emerald-500'}`}
          >
            {years.map(y => <option key={y} value={y} className={state.theme === 'light' ? '' : 'bg-[#020608]'}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          { type: 'Simples', icon: 'fa-file-invoice', desc: 'Resumo rápido: Recebidos, Pendentes, Atrasados e Receita Prevista mensal.' },
          { type: 'Executivo', icon: 'fa-briefcase', desc: 'Visão de tomada de decisão: Inadimplência, Renegociações e Resumo Narrativo.' },
          { type: 'Detalhado', icon: 'fa-database', desc: 'Controle contador: Lista completa com documentos, plano de parcelas e status por cliente.' }
        ].map((rep) => (
          <div key={rep.type} className={cardClass}>
            <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all ${state.theme === 'light' ? 'bg-slate-50 border-slate-100 text-[#0F172A]' : 'bg-white/5 text-white border-white/5 group-hover:bg-emerald-500 group-hover:text-black'}`}>
                  <i className={`fa-solid ${rep.icon} text-xl`}></i>
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Relatório {rep.type}</h3>
                <p className={`text-sm font-medium leading-relaxed italic ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>{rep.desc}</p>
            </div>
            <button onClick={() => generatePDF(rep.type as any)} className={`${btnClass} ${state.theme === 'light' ? 'border border-slate-200 bg-slate-50' : ''}`}>
              <i className="fa-solid fa-print"></i> GERAR PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Relatorios;