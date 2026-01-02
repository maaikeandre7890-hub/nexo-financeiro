
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-xl font-black text-white tracking-tight italic uppercase">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AddClientModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addClient } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', monthlyValue: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addClient({
      name: formData.name,
      email: formData.email,
      status: 'Ativo',
      monthlyValue: Number(formData.monthlyValue) || 0,
    });
    setFormData({ name: '', email: '', monthlyValue: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome da Empresa / Razão Social</label>
          <input 
            autoFocus
            required
            type="text" 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            placeholder="Ex: Nexus Corp LTDA"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail de Cobrança</label>
          <input 
            required
            type="email" 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            placeholder="financeiro@empresa.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor do Contrato (Mensal)</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
            <input 
              type="number" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              placeholder="0,00"
              value={formData.monthlyValue}
              onChange={e => setFormData({...formData, monthlyValue: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs mt-4">
          Finalizar Cadastro
        </button>
      </form>
    </Modal>
  );
};

export const AddReceivableModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, addReceivable } = useApp();
  const [formData, setFormData] = useState({ clientId: '', amount: '', dueDate: '', category: 'Serviços' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find(c => c.id === formData.clientId);
    if (!client || !formData.amount || !formData.dueDate) return;

    addReceivable({
      clientId: client.id,
      clientName: client.name,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      status: 'Pendente',
      category: formData.category
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lançar Nova Receita">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selecionar Cliente</label>
          <select 
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none"
            value={formData.clientId}
            onChange={e => setFormData({...formData, clientId: e.target.value})}
          >
            <option value="">Escolha um cliente...</option>
            {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor da Fatura</label>
            <input 
              required
              type="number" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              placeholder="0,00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data de Vencimento</label>
            <input 
              required
              type="date" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs mt-4">
          Gerar Título de Recebível
        </button>
      </form>
    </Modal>
  );
};

export const AddExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addExpense } = useApp();
  const [formData, setFormData] = useState({ description: '', amount: '', date: '', category: 'Fixo' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    addExpense({
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      category: formData.category
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nova Despesa">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição da Despesa</label>
          <input 
            autoFocus
            required
            type="text" 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-rose-500/30 transition-all"
            placeholder="Ex: Aluguel, AWS, Salários..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor</label>
            <input 
              required
              type="number" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</label>
            <input 
              required
              type="date" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-white"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-rose-500 hover:bg-rose-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-rose-500/20 uppercase tracking-widest text-xs">
          Lançar Despesa no Caixa
        </button>
      </form>
    </Modal>
  );
};
