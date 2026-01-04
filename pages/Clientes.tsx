
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

  const tableHeaderClass = "px-6 py-4 text-[10px] font-bold text-[var(--text-deep)] uppercase tracking-widest";

  return (
    <div className="space-y-8 py-6 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Gestão de Clientes</h1>
          <p className="text-sm font-medium text-[var(--text-muted)]">Base consolidada de contratos e ativos.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-deep)]"></i>
            <input 
              type="text" 
              placeholder="Buscar por Nome ou Documento..." 
              className="w-full bg-white/[0.03] border border-[var(--border-subtle)] rounded py-3 pl-11 pr-4 text-sm font-bold text-[var(--text-main)] focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-[var(--text-deep)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-500 text-[#0B0D10] rounded font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
          >
            Novo Cadastro
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
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
                      <div className="w-8 h-8 rounded bg-white/[0.05] text-[var(--text-muted)] flex items-center justify-center font-bold text-xs border border-[var(--border-subtle)]">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">{client.name}</p>
                        <p className="text-[10px] text-[var(--text-deep)] font-bold mono uppercase">{client.document}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-[var(--text-muted)] mb-0.5">{client.email}</p>
                    <p className="text-[10px] text-[var(--text-deep)] font-bold mono">{client.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-[var(--text-main)] mono">R$ {formatNumber(client.monthlyValue)}</p>
                    <p className="text-[10px] text-[var(--text-deep)] font-bold uppercase tracking-tighter">{client.installments} parcelas</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewingParcelas(client)} 
                        className="w-8 h-8 rounded bg-white/[0.02] text-[var(--text-deep)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-all"
                      >
                        <i className="fa-solid fa-list-ul text-[11px]"></i>
                      </button>
                      <button 
                        onClick={() => handleWhatsAppCharge(client)} 
                        className="w-8 h-8 rounded bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-[#0B0D10] transition-all border border-emerald-500/10"
                      >
                        <i className="fa-brands fa-whatsapp text-[13px]"></i>
                      </button>
                      <button 
                        onClick={() => { if(confirm('Excluir cliente?')) deleteClient(client.id) }} 
                        className="w-8 h-8 rounded bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10"
                      >
                        <i className="fa-solid fa-trash-can text-[11px]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingParcelas && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setViewingParcelas(null)}></div>
          <div className="relative w-full max-w-xl h-full bg-[var(--bg-card)] border-l border-[var(--border-subtle)] shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-6">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">{viewingParcelas.name}</h2>
                  <p className="text-[10px] text-[var(--text-deep)] font-bold uppercase tracking-widest">Cronograma de Pagamentos</p>
                </div>
                <button onClick={() => setViewingParcelas(null)} className="w-8 h-8 rounded border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-deep)]">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {clientParcelas.map((rec, idx) => (
                  <div key={rec.id} className="p-4 rounded border border-[var(--border-subtle)] flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="text-[10px] font-bold text-[var(--text-deep)] mono w-6">#{idx + 1}</div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-main)] mono">R$ {formatNumber(rec.amount)}</p>
                        <p className="text-[10px] font-bold text-[var(--text-deep)]">Venc: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                      <button 
                        onClick={() => setEditingReceivable(rec)}
                        className="w-7 h-7 rounded bg-white/[0.03] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-deep)] hover:text-white"
                      >
                        <i className="fa-solid fa-pen text-[9px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingReceivable && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90" onClick={() => setEditingReceivable(null)}></div>
          <div className="relative w-full max-w-md glass-card p-10 bg-[var(--bg-card)] border-[var(--border-subtle)] animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-6 border-b border-[var(--border-subtle)] pb-4">Ajustar Título</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label>Data de Vencimento</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-[var(--border-subtle)] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  value={editingReceivable.dueDate}
                  onChange={(e) => setEditingReceivable({...editingReceivable, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label>Valor da Parcela (R$)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-[var(--border-subtle)] rounded px-4 py-3 text-sm text-white focus:outline-none mono"
                  value={editingReceivable.amount}
                  onChange={(e) => setEditingReceivable({...editingReceivable, amount: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label>Status Operacional</label>
                <select 
                  className="w-full bg-white/5 border border-[var(--border-subtle)] rounded px-4 py-3 text-sm text-white focus:outline-none"
                  value={editingReceivable.status}
                  onChange={(e) => setEditingReceivable({...editingReceivable, status: e.target.value as any})}
                >
                  <option value="Pendente" className="bg-[#15181D]">Pendente</option>
                  <option value="Pago" className="bg-[#15181D]">Pago</option>
                  <option value="Atrasado" className="bg-[#15181D]">Atrasado</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setEditingReceivable(null)}
                  className="flex-1 py-3 bg-white/5 border border-[var(--border-subtle)] text-[var(--text-deep)] font-bold text-[10px] uppercase rounded"
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
                  className="flex-[2] py-3 bg-emerald-500 text-[#0B0D10] font-bold text-[10px] uppercase rounded hover:bg-emerald-400"
                >
                  Confirmar Ajuste
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
