
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
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#020608] border-t md:border border-white/[0.05] rounded-t-[4rem] md:rounded-[4rem] shadow-[0_100px_150px_-30px_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-bottom-20 md:zoom-in-95 duration-700">
        
        <div className="md:hidden flex justify-center py-6" onClick={onClose}>
          <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
        </div>

        <div className="p-10 md:p-14 border-b border-white/[0.03] flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">{title}</h3>
          <button onClick={onClose} className="hidden md:flex w-10 h-10 items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-slate-500 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="p-10 md:p-14 max-h-[75vh] overflow-y-auto custom-scrollbar">
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

  const inputClass = "w-full bg-white/[0.02] border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-18 placeholder:text-slate-700";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Identidade</label>
          <input 
            autoFocus
            required
            type="text" 
            className={inputClass}
            placeholder="Nome da Entidade"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Comunicação</label>
          <input 
            required
            type="email" 
            className={inputClass}
            placeholder="E-mail Corporativo"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Valor Recorrente /mês</label>
          <div className="relative">
            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 font-black mono text-sm">R$</span>
            <input 
              type="number" 
              className={`${inputClass} pl-16`}
              placeholder="0.000,00"
              value={formData.monthlyValue}
              onChange={e => setFormData({...formData, monthlyValue: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-white text-black font-black py-7 rounded-[2rem] transition-all shadow-2xl uppercase tracking-[0.3em] text-[11px] active:scale-[0.98] hover:bg-emerald-400">
          CONSOLIDAR CLIENTE
        </button>
      </form>
    </Modal>
  );
};

export const AddReceivableModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, addReceivable } = useApp();
  const [formData, setFormData] = useState({ clientId: '', amount: '', dueDate: '', category: 'Venda' });

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

  const inputClass = "w-full bg-white/[0.02] border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-18 select-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Recebível">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Vincular Parceiro</label>
          <select 
            required
            className={inputClass}
            value={formData.clientId}
            onChange={e => setFormData({...formData, clientId: e.target.value})}
          >
            <option value="" className="bg-slate-900">Selecionar na Base...</option>
            {state.clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Montante</label>
            <input 
              required
              type="number" 
              className={inputClass}
              placeholder="R$ 0,00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Vencimento</label>
            <input 
              required
              type="date" 
              className={inputClass}
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-white text-black font-black py-7 rounded-[2rem] transition-all shadow-2xl uppercase tracking-[0.3em] text-[11px] active:scale-[0.98] hover:bg-emerald-400">
          EFETIVAR LANÇAMENTO
        </button>
      </form>
    </Modal>
  );
};

export const AddExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addExpense } = useApp();
  const [formData, setFormData] = useState({ description: '', amount: '', date: '', category: 'Outros' });

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

  const inputClass = "w-full bg-white/[0.02] border border-white/10 rounded-[2rem] py-6 px-8 text-sm font-bold text-white focus:outline-none focus:border-rose-500/40 transition-all h-18 placeholder:text-slate-700";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Saída">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Descrição da Despesa</label>
          <input 
            required
            type="text" 
            className={inputClass}
            placeholder="Ex: Aluguel Office, Cloud Services..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Montante</label>
            <input 
              required
              type="number" 
              className={inputClass}
              placeholder="R$ 0,00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Data Efetiva</label>
            <input 
              required
              type="date" 
              className={inputClass}
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-rose-500 text-white font-black py-7 rounded-[2rem] transition-all shadow-2xl uppercase tracking-[0.3em] text-[11px] active:scale-[0.98] hover:bg-rose-400">
          CONSOLIDAR DESPESA
        </button>
      </form>
    </Modal>
  );
};
