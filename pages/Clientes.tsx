
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client, Receivable } from '../types';
import * as XLSX from 'xlsx';

const Clientes: React.FC = () => {
  const { state, formatNumber, deleteClient, updateReceivable, updateClient, maskCurrency, parseCurrency, markAsPaid, logAction } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [viewingParcelas, setViewingParcelas] = useState<Client | null>(null);
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null);
  const [payingRec, setPayingRec] = useState<Receivable | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredClients = useMemo(() => {
    return state.clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.document.includes(searchTerm)
    );
  }, [state.clients, searchTerm]);

  const clientParcelas = useMemo(() => {
    if (!viewingParcelas) return [];
    return state.receivables
      .filter(r => r.clientId === viewingParcelas.id)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [state.receivables, viewingParcelas]);

  const handleExport = (format: 'csv' | 'xlsx') => {
    if (filteredClients.length === 0) {
      alert('Não há clientes na lista atual para exportar.');
      return;
    }

    setIsExporting(true);
    setShowExportModal(false);

    setTimeout(() => {
      try {
        const data = filteredClients.map(c => ({
          'Nome do Cliente': c.name,
          'Documento': c.document,
          'Telefone': c.phone,
          'Email': c.email,
          'Status': c.status,
          'Valor Mensal': formatNumber(c.monthlyValue),
          'Parcelas': c.installments,
          'Dia Vencimento': c.dueDay,
          'Data Cadastro': new Date(c.createdAt).toLocaleDateString('pt-BR'),
          'Cidade': c.address?.city || 'N/A',
          'Estado': c.address?.state || 'N/A'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

        const date = new Date().toISOString().split('T')[0];
        const filename = `clientes_exportados_${date}.${format}`;

        if (format === 'csv') {
          XLSX.writeFile(wb, filename, { bookType: 'csv' });
        } else {
          XLSX.writeFile(wb, filename, { bookType: 'xlsx' });
        }

        logAction('Exportação', `Base de ${filteredClients.length} clientes exportada em ${format.toUpperCase()}.`, 'success');
      } catch (error) {
        console.error('Erro na exportação:', error);
        alert('Ocorreu um erro ao gerar o arquivo de exportação.');
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  const handleWhatsAppCharge = (client: Client) => {
    const clientRecs = state.receivables
      .filter(r => r.clientId === client.id)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    if (clientRecs.length === 0) return;

    const firstPending = clientRecs.find(r => r.status !== 'Pago') || clientRecs[clientRecs.length - 1];
    const installmentNumber = clientRecs.indexOf(firstPending) + 1;
    const totalInstallments = client.installments;
    const statusLabel = firstPending.status === 'Atrasado' ? 'em atraso' : firstPending.status.toLowerCase();

    const message = `Olá, ${client.name}!\n\nIdentificamos que sua parcela ${installmentNumber} de ${totalInstallments},\nno valor de R$ ${formatNumber(firstPending.amount)},\nencontra-se ${statusLabel}.\n\nCaso já tenha realizado o pagamento, desconsidere esta mensagem.\nSe precisar, é só falar com a gente para regularizar.\n\n${state.companyName}`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pago': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Atrasado': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getMethodBadgeColor = (method: string) => {
    switch(method) {
      case 'PIX': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Crédito': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Débito': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Dinheiro': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      default: return 'bg-white/5 text-zinc-600 border-white/10';
    }
  };

  const handlePayment = (method: Receivable['paymentMethod']) => {
    if (payingRec) {
      markAsPaid(payingRec.id, method);
      setPayingRec(null);
    }
  };

  const tableHeaderClass = `px-6 py-4 text-[10px] font-black uppercase tracking-widest ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-deep)]'}`;
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold focus:outline-none transition-all ${state.theme === 'light' ? 'text-[#0F172A] border-slate-200 bg-white' : 'text-white border-white/10 bg-white/[0.04]'}`;

  return (
    <div className="space-y-6 md:space-y-8 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight uppercase italic ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-[var(--text-main)]'}`}>Clientes</h1>
          <p className={`text-xs sm:text-sm font-medium ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-deep)]'}`}>Base consolidada de ativos.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-72">
            <i className={`fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-deep)]'}`}></i>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className={`w-full border rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none focus:border-emerald-500/30 transition-all ${state.theme === 'light' ? 'bg-white border-slate-200 text-[#0F172A] placeholder:text-[#6B7280]' : 'bg-white/[0.03] border-[var(--border-subtle)] text-[var(--text-muted)] placeholder:text-[var(--text-deep)]'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowExportModal(true)}
              className="px-6 py-3.5 bg-white/5 border border-white/10 text-zinc-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all active:scale-95 flex items-center gap-2"
              title="Exportar Clientes"
            >
              <i className="fa-solid fa-file-export"></i>
              Exportar
            </button>
            <button 
              onClick={() => navigate('/clientes/novo')}
              className="flex-1 px-8 py-3.5 bg-emerald-500 text-[#0B0D10] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
            >
              Novo Cadastro
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className={`${state.theme === 'light' ? 'bg-slate-50 border-b border-slate-100' : 'bg-white/[0.01] border-b border-[var(--border-subtle)]'}`}>
                <th className={tableHeaderClass}>Identificação</th>
                <th className={tableHeaderClass}>Contato</th>
                <th className={`${tableHeaderClass} text-right`}>Mensalidade</th>
                <th className={`${tableHeaderClass} text-center`}>Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${state.theme === 'light' ? 'divide-slate-100' : 'divide-[var(--border-subtle)]'}`}>
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.01] transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${state.theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white/[0.05] text-[var(--text-deep)] border-[var(--border-subtle)]'}`}>
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold mb-0.5 ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-[var(--text-main)]'}`}>{client.name}</p>
                        <p className={`text-[10px] font-black mono uppercase ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-deep)]'}`}>{client.document}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`text-xs font-medium mb-0.5 ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-muted)]'}`}>{client.email}</p>
                    <p className={`text-[10px] font-black mono ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-deep)]'}`}>{client.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className={`text-sm font-bold mono ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-[var(--text-main)]'}`}>R$ {formatNumber(client.monthlyValue)}</p>
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-[var(--text-deep)]'}`}>{client.installments} parcelas</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => navigate(`/clientes/editar/${client.id}`)} className={`w-8 h-8 rounded-lg border transition-colors ${state.theme === 'light' ? 'border-slate-200 text-[#6B7280] hover:text-[#2563EB]' : 'bg-white/[0.02] text-[var(--text-deep)] hover:text-emerald-500 border-[var(--border-subtle)]'}`} title="Editar"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => setViewingParcelas(client)} className={`w-8 h-8 rounded-lg border transition-colors ${state.theme === 'light' ? 'border-slate-200 text-[#6B7280] hover:text-[#2563EB]' : 'bg-white/[0.02] text-[var(--text-deep)] hover:text-emerald-500 border-[var(--border-subtle)]'}`} title="Parcelas"><i className="fa-solid fa-list-ul"></i></button>
                      <button onClick={() => handleWhatsAppCharge(client)} className="w-8 h-8 rounded-lg bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-black border border-emerald-500/10 transition-colors" title="Cobrar"><i className="fa-brands fa-whatsapp"></i></button>
                      <button onClick={() => { if(confirm('Excluir?')) deleteClient(client.id) }} className="w-8 h-8 rounded-lg bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/10 transition-colors" title="Excluir"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className={`glass-card p-5 space-y-5 animate-in fade-in slide-in-from-bottom-2 ${state.theme === 'light' ? 'bg-white border-slate-100 shadow-sm' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${state.theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h4 className={`text-sm font-black ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>{client.name}</h4>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-600'}`}>{client.document}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black mono ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>R$ {formatNumber(client.monthlyValue)}</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-600'}`}>{client.installments}x</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => navigate(`/clientes/editar/${client.id}`)} className={`flex flex-col items-center justify-center py-3 border rounded-xl transition-colors ${state.theme === 'light' ? 'bg-slate-50 border-slate-100 text-[#6B7280]' : 'bg-white/[0.03] border-white/5 text-zinc-400'}`}><i className="fa-solid fa-pen-to-square mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Editar</span></button>
              <button onClick={() => setViewingParcelas(client)} className={`flex flex-col items-center justify-center py-3 border rounded-xl transition-colors ${state.theme === 'light' ? 'bg-slate-50 border-slate-100 text-[#6B7280]' : 'bg-white/[0.03] border-white/5 text-zinc-400'}`}><i className="fa-solid fa-list-check mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Parcelas</span></button>
              <button onClick={() => handleWhatsAppCharge(client)} className="flex flex-col items-center justify-center py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500"><i className="fa-brands fa-whatsapp mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Cobrar</span></button>
              <button onClick={() => { if(confirm('Excluir?')) deleteClient(client.id) }} className="flex flex-col items-center justify-center py-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-500"><i className="fa-solid fa-trash-can mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Sair</span></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Exportação */}
      {showExportModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowExportModal(false)}></div>
          <div className={`relative w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-300 ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0B0D10] border-white/10'}`}>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
                <i className="fa-solid fa-file-export text-2xl"></i>
              </div>
              <div>
                <h3 className={`text-xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Exportar Carteira</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-slate-500'}`}>Escolha o formato de saída</p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button onClick={() => handleExport('xlsx')} className="w-full py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-xl">Excel (.xlsx)</button>
                <button onClick={() => handleExport('csv')} className={`w-full py-5 border font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 ${state.theme === 'light' ? 'bg-slate-50 border-slate-200 text-[#0F172A]' : 'bg-white/[0.03] border-white/5 text-white'}`}>Arquivo CSV</button>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-[10px] font-black uppercase tracking-widest transition-colors text-slate-400">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Parcelas */}
      {viewingParcelas && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingParcelas(null)}></div>
          <div className={`relative w-full max-w-xl max-h-[85vh] border shadow-2xl rounded-3xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0B0D10] border-white/[0.08]'}`}>
            <div className={`p-6 sm:p-8 border-b flex items-center justify-between shrink-0 ${state.theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                <div>
                  <h2 className={`text-lg sm:text-xl font-black mb-1 ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>{viewingParcelas.name}</h2>
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-600'}`}>Cronograma de Pagamentos</p>
                </div>
                <button onClick={() => setViewingParcelas(null)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-all"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {clientParcelas.map((rec, idx) => (
                <div key={rec.id} className={`p-5 mb-3 rounded-2xl border flex items-center justify-between transition-all group ${state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-[9px] font-black mono w-6 ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-700'}`}>#{idx + 1}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-black mono ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>R$ {formatNumber(rec.amount)}</p>
                        {rec.paymentMethod && <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase border tracking-widest ${getMethodBadgeColor(rec.paymentMethod)}`}>{rec.paymentMethod}</span>}
                      </div>
                      <p className={`text-[9px] font-bold uppercase ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-600'}`}>Venc: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${getStatusColor(rec.status)}`}>{rec.status}</span>
                    <div className="flex gap-1.5">
                      {rec.status !== 'Pago' && <button onClick={() => setPayingRec(rec)} className="w-9 h-9 rounded-lg bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 shadow-lg"><i className="fa-solid fa-check text-[10px]"></i></button>}
                      <button onClick={() => setEditingReceivable(rec)} className={`w-9 h-9 rounded-lg border flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}><i className="fa-solid fa-pen text-[10px]"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagamento Parcela Modal */}
      {payingRec && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPayingRec(null)}></div>
          <div className={`relative w-full max-w-sm p-10 rounded-[2.5rem] border space-y-8 text-center shadow-2xl animate-in zoom-in-95 duration-300 ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0a151b] border-white/10'}`}>
             <div className="space-y-3">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Liquidando Parcela</p>
                <h3 className="text-3xl font-black text-[var(--text-main)] mono">R$ {formatNumber(payingRec.amount)}</h3>
                <p className="text-xs text-[var(--text-deep)] font-bold uppercase tracking-widest">{payingRec.clientName}</p>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {['PIX', 'Débito', 'Crédito', 'Dinheiro'].map(m => (
                  <button key={m} onClick={() => handlePayment(m as any)} className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${state.theme === 'light' ? 'bg-slate-50 border-slate-200 text-[#0F172A] hover:bg-emerald-500 hover:text-white' : 'bg-white/[0.03] border-white/10 text-white hover:bg-emerald-500 hover:text-black'}`}>{m}</button>
                ))}
             </div>
             <button onClick={() => setPayingRec(null)} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-emerald-500 transition-colors block w-full">Cancelar</button>
          </div>
        </div>
      )}

      {/* Edit Receivable Modal */}
      {editingReceivable && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setEditingReceivable(null)}></div>
          <div className={`relative w-full max-w-md p-10 border animate-in zoom-in-95 duration-300 rounded-3xl ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0B0D10] border-white/10'}`}>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-8 border-b border-white/5 pb-4 uppercase italic">Ajustar Título</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[var(--text-deep)] uppercase tracking-widest">Data de Vencimento</label>
                <input type="date" className={inputClass} value={editingReceivable.dueDate} onChange={(e) => setEditingReceivable({...editingReceivable, dueDate: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[var(--text-deep)] uppercase tracking-widest">Valor da Parcela (R$)</label>
                <input type="text" className={`${inputClass} mono`} value={formatNumber(editingReceivable.amount)} onInput={(e) => e.currentTarget.value = maskCurrency(e.currentTarget.value)} onChange={(e) => setEditingReceivable({...editingReceivable, amount: parseCurrency(e.target.value)})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[var(--text-deep)] uppercase tracking-widest">Status Operacional</label>
                <select className={`${inputClass} appearance-none`} value={editingReceivable.status} onChange={(e) => setEditingReceivable({...editingReceivable, status: e.target.value as any})}>
                  <option value="Pendente" className={state.theme === 'light' ? '' : 'bg-[#0B0D10]'}>Pendente</option>
                  <option value="Pago" className={state.theme === 'light' ? '' : 'bg-[#0B0D10]'}>Pago</option>
                  <option value="Atrasado" className={state.theme === 'light' ? '' : 'bg-[#0B0D10]'}>Atrasado</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button onClick={() => setEditingReceivable(null)} className="flex-1 py-4 bg-slate-100 border border-slate-200 text-slate-500 font-black text-[10px] uppercase rounded-xl tracking-widest hover:text-emerald-500 transition-all">Sair</button>
                <button onClick={() => { updateReceivable(editingReceivable.id, editingReceivable); setEditingReceivable(null); setViewingParcelas(null); }} className="flex-[2] py-4 bg-emerald-500 text-black font-black text-[10px] uppercase rounded-xl tracking-widest hover:bg-emerald-400 shadow-xl transition-all">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
