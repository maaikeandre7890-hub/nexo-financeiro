import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client, Receivable } from '../types';

const Clientes: React.FC = () => {
  const { state, formatNumber, deleteClient, updateReceivable, updateClient, maskCurrency, parseCurrency, markAsPaid } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [viewingParcelas, setViewingParcelas] = useState<Client | null>(null);
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [payingRec, setPayingRec] = useState<Receivable | null>(null);

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
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] transition-all ${state.theme === 'light' ? 'text-[#0F172A] border-slate-200 bg-white' : 'text-white border-white/10 bg-white/[0.04]'}`;

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
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 text-[#0B0D10] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
          >
            Novo Cadastro
          </button>
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
                      <button onClick={() => setEditingClient(client)} className={`w-8 h-8 rounded-lg border transition-colors ${state.theme === 'light' ? 'border-slate-200 text-[#6B7280] hover:text-[#2563EB]' : 'bg-white/[0.02] text-[var(--text-deep)] hover:text-emerald-500 border-[var(--border-subtle)]'}`} title="Editar"><i className="fa-solid fa-pen-to-square"></i></button>
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
              <button onClick={() => setEditingClient(client)} className={`flex flex-col items-center justify-center py-3 border rounded-xl transition-colors ${state.theme === 'light' ? 'bg-slate-50 border-slate-100 text-[#6B7280]' : 'bg-white/[0.03] border-white/5 text-zinc-400'}`}><i className="fa-solid fa-pen-to-square mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Editar</span></button>
              <button onClick={() => setViewingParcelas(client)} className={`flex flex-col items-center justify-center py-3 border rounded-xl transition-colors ${state.theme === 'light' ? 'bg-slate-50 border-slate-100 text-[#6B7280]' : 'bg-white/[0.03] border-white/5 text-zinc-400'}`}><i className="fa-solid fa-list-check mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Parcelas</span></button>
              <button onClick={() => handleWhatsAppCharge(client)} className="flex flex-col items-center justify-center py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500"><i className="fa-brands fa-whatsapp mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Cobrar</span></button>
              <button onClick={() => { if(confirm('Excluir?')) deleteClient(client.id) }} className="flex flex-col items-center justify-center py-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-500"><i className="fa-solid fa-trash-can mb-1 text-xs"></i><span className="text-[7px] font-black uppercase tracking-widest">Sair</span></button>
            </div>
          </div>
        ))}
      </div>

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
                <button onClick={() => setViewingParcelas(null)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-all">
                  <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {clientParcelas.map((rec, idx) => (
                <div key={rec.id} className={`p-5 mb-3 rounded-2xl border flex items-center justify-between transition-all group ${state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-[9px] font-black mono w-6 ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-700'}`}>#{idx + 1}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-black mono ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>R$ {formatNumber(rec.amount)}</p>
                        {rec.paymentMethod && (
                          <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase border tracking-widest ${getMethodBadgeColor(rec.paymentMethod)}`}>
                            {rec.paymentMethod}
                          </span>
                        )}
                      </div>
                      <p className={`text-[9px] font-bold uppercase ${state.theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-600'}`}>Venc: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                    <div className="flex gap-1.5">
                      {rec.status !== 'Pago' && (
                        <button 
                          onClick={() => setPayingRec(rec)}
                          className="w-9 h-9 rounded-lg bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 shadow-lg shadow-emerald-500/10"
                        >
                          <i className="fa-solid fa-check text-[10px]"></i>
                        </button>
                      )}
                      <button 
                        onClick={() => setEditingReceivable(rec)}
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center text-zinc-500 hover:text-emerald-500 transition-colors ${state.theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}
                      >
                        <i className="fa-solid fa-pen text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;