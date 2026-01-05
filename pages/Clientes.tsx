
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client, Receivable } from '../types';

const Clientes: React.FC = () => {
  const { state, formatNumber, deleteClient, updateReceivable } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [viewingParcelas, setViewingParcelas] = useState<Client | null>(null);
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null);

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
    const message = `Olá ${client.name}! Gostaríamos de lembrar do seu pagamento recorrente de R$ ${formatNumber(client.monthlyValue)} com o NEXO. Como podemos ajudar?`;
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

  const tableHeaderClass = "px-6 py-4 text-[10px] font-black text-[var(--text-deep)] uppercase tracking-widest";

  return (
    <div className="space-y-6 md:space-y-8 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)] uppercase italic">Clientes</h1>
          <p className="text-xs sm:text-sm font-medium text-[var(--text-muted)]">Base consolidada de ativos.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-deep)]"></i>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-white/[0.03] border border-[var(--border-subtle)] rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-[var(--text-main)] focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-[var(--text-deep)]"
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

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] border-b border-[var(--border-subtle)]">
                <th className={tableHeaderClass}>Identificação</th>
                <th className={tableHeaderClass}>Contato</th>
                <th className={`${tableHeaderClass} text-right`}>Mensalidade</th>
                <th className={`${tableHeaderClass} text-center`}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.01] transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] text-[var(--text-muted)] flex items-center justify-center font-bold text-xs border border-[var(--border-subtle)]">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">{client.name}</p>
                        <p className="text-[10px] text-[var(--text-deep)] font-black mono uppercase">{client.document}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-[var(--text-muted)] mb-0.5">{client.email}</p>
                    <p className="text-[10px] text-[var(--text-deep)] font-black mono">{client.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-[var(--text-main)] mono">R$ {formatNumber(client.monthlyValue)}</p>
                    <p className="text-[10px] text-[var(--text-deep)] font-black uppercase tracking-tighter">{client.installments} parcelas</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setViewingParcelas(client)} className="w-8 h-8 rounded-lg bg-white/[0.02] text-[var(--text-deep)] hover:text-white border border-[var(--border-subtle)]"><i className="fa-solid fa-list-ul"></i></button>
                      <button onClick={() => handleWhatsAppCharge(client)} className="w-8 h-8 rounded-lg bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-black border border-emerald-500/10"><i className="fa-brands fa-whatsapp"></i></button>
                      <button onClick={() => { if(confirm('Excluir?')) deleteClient(client.id) }} className="w-8 h-8 rounded-lg bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/10"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-card p-5 space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-sm">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{client.name}</h4>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{client.document}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white mono">R$ {formatNumber(client.monthlyValue)}</p>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{client.installments}x</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setViewingParcelas(client)}
                className="flex flex-col items-center justify-center py-3 bg-white/[0.03] border border-white/5 rounded-xl text-zinc-400 hover:text-white"
              >
                <i className="fa-solid fa-list-check mb-1"></i>
                <span className="text-[8px] font-black uppercase tracking-widest">Parcelas</span>
              </button>
              <button 
                onClick={() => handleWhatsAppCharge(client)}
                className="flex flex-col items-center justify-center py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500"
              >
                <i className="fa-brands fa-whatsapp mb-1"></i>
                <span className="text-[8px] font-black uppercase tracking-widest">Cobrar</span>
              </button>
              <button 
                onClick={() => { if(confirm('Excluir?')) deleteClient(client.id) }}
                className="flex flex-col items-center justify-center py-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-500"
              >
                <i className="fa-solid fa-trash-can mb-1"></i>
                <span className="text-[8px] font-black uppercase tracking-widest">Remover</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer for Parcelas */}
      {viewingParcelas && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingParcelas(null)}></div>
          <div className="relative w-full max-w-xl h-full bg-[#0B0D10] border-l border-white/[0.08] shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="p-6 sm:p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white mb-1">{viewingParcelas.name}</h2>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Cronograma de Pagamentos</p>
                </div>
                <button onClick={() => setViewingParcelas(null)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {clientParcelas.map((rec, idx) => (
                  <div key={rec.id} className="p-4 rounded-2xl border border-white/5 flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="text-[9px] font-black text-zinc-700 mono w-6">#{idx + 1}</div>
                      <div>
                        <p className="text-sm font-black text-white mono">R$ {formatNumber(rec.amount)}</p>
                        <p className="text-[9px] font-bold text-zinc-600">Venc: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                      <button 
                        onClick={() => setEditingReceivable(rec)}
                        className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white"
                      >
                        <i className="fa-solid fa-pen text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Universal) */}
      {editingReceivable && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setEditingReceivable(null)}></div>
          <div className="relative w-full max-w-md glass-card p-8 sm:p-10 bg-[#0B0D10] border-white/10 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-black text-white mb-8 border-b border-white/5 pb-4 uppercase italic">Ajustar Título</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Data de Vencimento</label>
                <input 
                  type="date" 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  value={editingReceivable.dueDate}
                  onChange={(e) => setEditingReceivable({...editingReceivable, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Valor da Parcela (R$)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none mono"
                  value={editingReceivable.amount}
                  onChange={(e) => setEditingReceivable({...editingReceivable, amount: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status Operacional</label>
                <select 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none appearance-none"
                  value={editingReceivable.status}
                  onChange={(e) => setEditingReceivable({...editingReceivable, status: e.target.value as any})}
                >
                  <option value="Pendente" className="bg-[#0B0D10]">Pendente</option>
                  <option value="Pago" className="bg-[#0B0D10]">Pago</option>
                  <option value="Atrasado" className="bg-[#0B0D10]">Atrasado</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setEditingReceivable(null)}
                  className="flex-1 py-4 bg-white/5 border border-white/5 text-zinc-500 font-black text-[10px] uppercase rounded-xl tracking-widest hover:text-white transition-all"
                >
                  Sair
                </button>
                <button 
                  onClick={() => {
                    updateReceivable(editingReceivable.id, editingReceivable);
                    setEditingReceivable(null);
                    setViewingParcelas(null);
                    navigate('/dashboard');
                  }}
                  className="flex-[2] py-4 bg-emerald-500 text-black font-black text-[10px] uppercase rounded-xl tracking-widest hover:bg-emerald-400 shadow-xl transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
