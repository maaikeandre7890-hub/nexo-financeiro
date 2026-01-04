
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client, Receivable } from '../types';

const Clientes: React.FC = () => {
  const { state, formatNumber, deleteClient, updateClient, renegotiateClient, markAsPaid, updateReceivable } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingParcelas, setViewingParcelas] = useState<Client | null>(null);
  const [payingClient, setPayingClient] = useState<{client: Client, rec: Receivable} | null>(null);
  const [renegotiatingClient, setRenegotiatingClient] = useState<Client | null>(null);

  const filteredClients = state.clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.includes(searchTerm)
  );

  const handleWhatsAppCharge = (client: Client) => {
    const nextRec = state.receivables.find(r => r.clientId === client.id && r.status !== 'Pago');
    const message = `Olá ${client.name}! Gostaríamos de lembrar do seu pagamento de R$ ${formatNumber(client.monthlyValue)} com o NEXO. Como podemos ajudar?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  const getNextReceivable = (clientId: string) => {
    return state.receivables
      .filter(r => r.clientId === clientId && r.status !== 'Pago')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  };

  return (
    <div className="space-y-10 py-4 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white tracking-tight">Meus Clientes</h1>
          <p className="text-sm text-slate-500">Gestão centralizada de contratos e parcerias.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white focus:outline-none focus:border-white/[0.1] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all active:scale-95 shadow-lg"
          >
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Tabela Clean Finance */}
      <div className="hidden md:block glass-card overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.01] border-b border-white/[0.03]">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cliente / Doc</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contato</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ações Rápidas</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Mensalidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredClients.map((client) => {
              const nextRec = getNextReceivable(client.id);
              const isAtrasado = nextRec && nextRec.dueDate < new Date().toISOString().split('T')[0];

              return (
                <tr key={client.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${isAtrasado ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none mb-1">{client.name}</p>
                        <p className="text-[10px] text-slate-500 mono">{client.document}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-medium text-slate-300 mb-0.5">{client.email}</p>
                    <p className="text-[10px] text-slate-500 mono">{client.phone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewingParcelas(client)} className="w-8 h-8 rounded-lg bg-white/[0.03] text-slate-500 hover:text-white transition-all border border-white/[0.05]" title="Ver Parcelas"><i className="fa-solid fa-layer-group text-[11px]"></i></button>
                      <button onClick={() => setEditingClient(client)} className="w-8 h-8 rounded-lg bg-white/[0.03] text-slate-500 hover:text-white transition-all border border-white/[0.05]" title="Editar"><i className="fa-solid fa-pen text-[11px]"></i></button>
                      <button onClick={() => handleWhatsAppCharge(client)} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all" title="WhatsApp"><i className="fa-brands fa-whatsapp text-[12px]"></i></button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-bold text-white mono">R$ {formatNumber(client.monthlyValue)}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isAtrasado ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {isAtrasado ? 'Atraso' : 'Ativo'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile Clean */}
      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">{client.name.charAt(0)}</div>
                <div>
                   <p className="text-sm font-bold text-white">{client.name}</p>
                   <p className="text-[10px] text-slate-500">{client.phone}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-sm font-bold text-white mono">R$ {formatNumber(client.monthlyValue)}</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setViewingParcelas(client)} className="flex-1 py-2 bg-white/[0.03] rounded-lg text-[10px] font-bold uppercase text-slate-400 border border-white/[0.05]">Gerenciar</button>
               <button onClick={() => handleWhatsAppCharge(client)} className="flex-1 py-2 bg-emerald-500/10 rounded-lg text-[10px] font-bold uppercase text-emerald-500 border border-emerald-500/20">Cobrar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Reutilizando modais existentes com ajustes visuais mínimos no CSS global */}
    </div>
  );
};

export default Clientes;
