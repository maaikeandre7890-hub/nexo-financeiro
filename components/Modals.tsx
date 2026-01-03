
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
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#071821] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500">
        
        {/* Barra de arraste mobile */}
        <div className="md:hidden flex justify-center py-4" onClick={onClose}>
          <div className="w-12 h-1.5 bg-white/10 rounded-full"></div>
        </div>

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-xl font-black text-white tracking-tight italic uppercase">{title}</h3>
          <button onClick={onClose} className="hidden md:block text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
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
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Razão Social</label>
          <input 
            autoFocus
            required
            type="text" 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all h-14"
            placeholder="Ex: Nexus Corp LTDA"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail Financeiro</label>
          <input 
            required
            type="email" 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all h-14"
            placeholder="financeiro@empresa.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contrato Mensal</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
            <input 
              type="number" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all h-14"
              placeholder="0,00"
              value={formData.monthlyValue}
              onChange={e => setFormData({...formData, monthlyValue: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black h-16 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 uppercase tracking-widest text-xs">
          Salvar Entidade
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
    <Modal isOpen={isOpen} onClose={onClose} title="Lançar Receita">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente Destino</label>
          <select 
            required
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all appearance-none h-14"
            value={formData.clientId}
            onChange={e => setFormData({...formData, clientId: e.target.value})}
          >
            <option value="" className="bg-slate-900">Selecionar...</option>
            {state.clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor do Título</label>
            <input 
              required
              type="number" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none h-14"
              placeholder="0,00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</label>
            <input 
              required
              type="date" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white h-14"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black h-16 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 uppercase tracking-widest text-xs">
          Confirmar Lançamento
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
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Despesa">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição</label>
          <input 
            required
            type="text" 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none h-14"
            placeholder="Ex: Aluguel, AWS..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor</label>
            <input 
              required
              type="number" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white h-14"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</label>
            <input 
              required
              type="date" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white h-14"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-rose-500 text-white font-black h-16 rounded-2xl transition-all shadow-xl shadow-rose-500/20 uppercase tracking-widest text-xs">
          Lançar Saída
        </button>
      </form>
    </Modal>
  );
};
