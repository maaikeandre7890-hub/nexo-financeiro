
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client, Receivable } from '../types';

const Clientes: React.FC = () => {
  const { state, formatNumber, deleteClient, updateReceivable, markAsPaid } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Estados para modais e lógica funcional
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

  return (
    <div className="space-y-8 py-4 page-enter">
      {/* Header com busca refinada */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Clientes</h1>
          <p className="text-sm text-slate-500 font-medium">Controle total da sua base de contratos ativos.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou CPF/CNPJ..." 
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            Cadastrar Novo
          </button>
        </div>
      </div>

      {/* Tabela de Clientes Estilizada */}
      <div className="glass-card overflow-hidden shadow-sm border-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.03]">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Identificação</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Mensalidade</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100 mb-0.5">{client.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium mono uppercase">{client.document}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-slate-300 mb-0.5">{client.email}</p>
                    <p className="text-[10px] text-slate-500 font-medium mono">{client.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-white mono">R$ {formatNumber(client.monthlyValue)}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{client.installments} parcelas</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setViewingParcelas(client)} 
                        className="w-9 h-9 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white hover:bg-emerald-500/20 border border-white/[0.04] transition-all" 
                        title="Ver Parcelas"
                      >
                        <i className="fa-solid fa-layer-group text-[12px]"></i>
                      </button>
                      <button 
                        onClick={() => handleWhatsAppCharge(client)} 
                        className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950 transition-all border border-emerald-500/10" 
                        title="Cobrar WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-[14px]"></i>
                      </button>
                      <button 
                        onClick={() => { if(confirm('Excluir cliente e todo seu histórico?')) deleteClient(client.id) }} 
                        className="w-9 h-9 rounded-lg bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10" 
                        title="Excluir"
                      >
                        <i className="fa-solid fa-trash-can text-[12px]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <i className="fa-solid fa-users-slash text-4xl text-slate-800 mb-4 block"></i>
                    <p className="text-sm font-medium text-slate-600">Nenhum cliente encontrado na sua base.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER: VER PARCELAS (FUNCIONALIDADE REAL) */}
      {viewingParcelas && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingParcelas(null)}></div>
          <div className="relative w-full max-w-xl h-full bg-[#1c252b] border-l border-white/5 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Parcelas de {viewingParcelas.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">Cronograma financeiro completo deste contrato.</p>
                </div>
                <button onClick={() => setViewingParcelas(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {clientParcelas.map((rec, idx) => (
                  <div key={rec.id} className="glass-card p-5 border-white/[0.04] flex items-center justify-between group hover:border-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <div className="text-[10px] font-bold text-slate-600 mono w-6">#{idx + 1}</div>
                      <div>
                        <p className="text-sm font-bold text-white mono">R$ {formatNumber(rec.amount)}</p>
                        <p className="text-[10px] font-medium text-slate-500 uppercase">Vencimento: {new Date(rec.dueDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                      <button 
                        onClick={() => setEditingReceivable(rec)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                      >
                        <i className="fa-solid fa-pen text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 mt-auto">
                <p className="text-center text-[10px] font-bold text-slate-700 uppercase tracking-widest">NEXO Intelligence • Capital Management</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PARCELA (FUNCIONALIDADE REAL) */}
      {editingReceivable && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingReceivable(null)}></div>
          <div className="relative w-full max-w-md glass-card p-10 bg-[#1c252b] border-white/5 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-6">Editar Parcela</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Data de Vencimento</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/40 focus:outline-none"
                  value={editingReceivable.dueDate}
                  onChange={(e) => setEditingReceivable({...editingReceivable, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Valor da Parcela (R$)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/40 focus:outline-none mono"
                  value={editingReceivable.amount}
                  onChange={(e) => setEditingReceivable({...editingReceivable, amount: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status do Título</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/40 focus:outline-none"
                  value={editingReceivable.status}
                  onChange={(e) => setEditingReceivable({...editingReceivable, status: e.target.value as any})}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setEditingReceivable(null)}
                  className="flex-1 py-3 bg-white/5 text-slate-400 font-bold text-xs uppercase rounded-xl hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    updateReceivable(editingReceivable.id, editingReceivable);
                    setEditingReceivable(null);
                  }}
                  className="flex-[2] py-3 bg-emerald-500 text-slate-950 font-bold text-xs uppercase rounded-xl hover:bg-emerald-400 transition-all shadow-lg"
                >
                  Salvar Alterações
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
