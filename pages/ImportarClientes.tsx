import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.tsx';

interface ImportRecord {
  name: string;
  document: string;
  phone: string;
  monthlyValue: number;
  installments: number;
  dueDay: number;
  email: string;
  isValid: boolean;
  errors: string[];
}

const ImportarClientes: React.FC = () => {
  const { bulkAddClients, formatNumber } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [importData, setImportData] = useState<ImportRecord[]>([]);
  const [progress, setProgress] = useState(0);

  // Helper para baixar modelo
  const downloadTemplate = () => {
    const headers = "Nome Completo,CPF ou CNPJ,Telefone,Valor Mensal,Parcelas,Dia de Cobranca,Email,Observacoes\n";
    const example = "Cliente Exemplo,123.456.789-00,(11) 98888-7777,1500.00,12,10,exemplo@nexo.com,Migracao de sistema";
    const blob = new Blob([headers + example], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "modelo_importacao_nexo.csv";
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').slice(1); // Ignora header
      
      const parsed: ImportRecord[] = rows.filter(row => row.trim()).map(row => {
        const columns = row.split(',');
        const errors: string[] = [];

        const name = columns[0]?.trim() || '';
        const document = columns[1]?.trim() || '';
        const phone = columns[2]?.trim() || '';
        const monthlyValue = parseFloat(columns[3]?.trim()) || 0;
        const installments = parseInt(columns[4]?.trim()) || 0;
        const dueDay = parseInt(columns[5]?.trim()) || 0;
        const email = columns[6]?.trim() || '';

        if (!name) errors.push("Nome é obrigatório");
        if (!document) errors.push("CPF/CNPJ é obrigatório");
        if (!phone) errors.push("Telefone é obrigatório");
        if (monthlyValue <= 0) errors.push("Valor deve ser maior que zero");
        if (installments <= 0) errors.push("Parcelas devem ser maiores que zero");
        if (dueDay < 1 || dueDay > 31) errors.push("Dia de cobrança inválido (1-31)");

        return {
          name, document, phone, monthlyValue, installments, dueDay, email,
          isValid: errors.length === 0,
          errors
        };
      });

      setImportData(parsed);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    setStep(3);
    const validOnes = importData.filter(d => d.isValid);
    
    // Simula progresso para efeito visual premium
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 80));
    }

    bulkAddClients(validOnes.map(v => ({
      name: v.name,
      type: v.document.length > 14 ? 'PJ' : 'PF',
      document: v.document,
      phone: v.phone,
      monthlyValue: v.monthlyValue,
      installments: v.installments,
      dueDay: v.dueDay,
      email: v.email,
      status: 'Ativo'
    })));

    setStep(4);
  };

  const validCount = importData.filter(d => d.isValid).length;
  const errorCount = importData.filter(d => !d.isValid).length;

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Importação em Lote</h1>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Migração Segura de Carteira</p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className="px-6 py-3 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
        >
          <i className="fa-solid fa-xmark mr-2"></i> Cancelar
        </button>
      </div>

      {/* STEP 1: DOWNLOAD & UPLOAD */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-12 rounded-[3.5rem] border-white/5 flex flex-col justify-between space-y-8 bg-[#020608] group hover:border-emerald-500/20 transition-all">
             <div className="space-y-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-white/5 shadow-inner">
                   <i className="fa-solid fa-file-csv text-2xl"></i>
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">1. Modelo Padrão</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                  Use nosso template para garantir que o motor de inteligência do NEXO processe todos os campos financeiros corretamente.
                </p>
             </div>
             <button 
               onClick={downloadTemplate}
               className="w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
             >
               <i className="fa-solid fa-download"></i> Baixar Modelo NEXO
             </button>
          </div>

          <div className="glass-card p-12 rounded-[3.5rem] border-white/5 flex flex-col justify-between space-y-8 bg-[#020608] border-dashed border-2 group hover:border-emerald-500/40 transition-all">
             <div className="space-y-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-white/5 shadow-inner">
                   <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">2. Upload de Arquivo</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                  Arraste seu CSV preenchido ou clique para selecionar. Validaremos os dados antes de qualquer alteração no seu caixa.
                </p>
             </div>
             <label className="w-full py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 cursor-pointer">
               <i className="fa-solid fa-file-circle-plus"></i> Selecionar Arquivo
               <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
             </label>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW & VALIDAÇÃO */}
      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-3 gap-6">
             <div className="glass-card p-8 rounded-3xl border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Detectado</p>
                <h4 className="text-3xl font-black text-white mono">{importData.length}</h4>
             </div>
             <div className="glass-card p-8 rounded-3xl border-emerald-500/10 bg-emerald-500/[0.02] text-center">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Válidos para Importação</p>
                <h4 className="text-3xl font-black text-white mono">{validCount}</h4>
             </div>
             <div className="glass-card p-8 rounded-3xl border-rose-500/10 bg-rose-500/[0.02] text-center">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Erros Encontrados</p>
                <h4 className="text-3xl font-black text-white mono">{errorCount}</h4>
             </div>
          </div>

          <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 bg-[#020608]">
             <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-zinc-950 border-b border-white/5">
                    <tr>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-600 uppercase">Cliente</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-600 uppercase">Documento</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-600 uppercase">Mensalidade</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-600 uppercase text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {importData.map((row, i) => (
                      <tr key={i} className={`hover:bg-white/[0.01] transition-all ${!row.isValid ? 'bg-rose-500/[0.02]' : ''}`}>
                        <td className="px-8 py-4">
                           <p className="text-xs font-bold text-white truncate max-w-[200px]">{row.name || '---'}</p>
                        </td>
                        <td className="px-8 py-4">
                           <p className="text-[10px] text-slate-500 font-black mono">{row.document || '---'}</p>
                        </td>
                        <td className="px-8 py-4">
                           <p className="text-[10px] text-white font-black mono">R$ {formatNumber(row.monthlyValue)}</p>
                        </td>
                        <td className="px-8 py-4 text-right">
                           {row.isValid ? (
                             <span className="text-[8px] font-black text-emerald-500 uppercase px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10">Pronto</span>
                           ) : (
                             <span className="text-[8px] font-black text-rose-500 uppercase px-3 py-1 bg-rose-500/5 rounded-full border border-rose-500/10" title={row.errors.join(', ')}>Erro Crítico</span>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          <div className="flex gap-4">
             <button 
                onClick={() => setStep(1)}
                className="flex-1 py-6 bg-white/5 border border-white/10 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:text-white hover:bg-white/10 transition-all"
             >
               Trocar Arquivo
             </button>
             <button 
                disabled={validCount === 0}
                onClick={processImport}
                className="flex-[2] py-6 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl disabled:opacity-30"
             >
               Confirmar Importação de {validCount} Clientes
             </button>
          </div>
        </div>
      )}

      {/* STEP 3: PROGRESSO */}
      {step === 3 && (
        <div className="py-24 space-y-12 text-center animate-in zoom-in-95">
           <div className="space-y-4">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Processando Carteira...</h3>
              <p className="text-sm text-slate-500 font-medium italic">Estamos criando os perfis e gerando os cronogramas de parcelas com segurança.</p>
           </div>
           
           <div className="max-w-md mx-auto space-y-4">
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                 <div className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_#10b981]" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-[10px] font-black text-emerald-500 mono uppercase tracking-widest">{progress}% COMPLETO</p>
           </div>
        </div>
      )}

      {/* STEP 4: RESULTADO */}
      {step === 4 && (
        <div className="py-20 space-y-12 text-center animate-in fade-in slide-in-from-top-4">
           <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mx-auto shadow-2xl animate-pulse">
              <i className="fa-solid fa-check-double text-4xl"></i>
           </div>
           
           <div className="space-y-4">
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Operação Concluída.</h3>
              <p className="text-sm text-slate-500 font-medium italic max-w-sm mx-auto">
                Todos os clientes válidos foram integrados à sua base de dados e os recebíveis foram projetados na dashboard.
              </p>
           </div>

           <div className="flex justify-center gap-6">
              <button 
                 onClick={() => navigate('/clientes')}
                 className="px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 shadow-xl"
              >
                Ir para Meus Clientes
              </button>
              <button 
                 onClick={() => navigate('/dashboard')}
                 className="px-12 py-5 bg-white/5 border border-white/10 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:text-white transition-all active:scale-95"
              >
                Ver Dashboard
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ImportarClientes;