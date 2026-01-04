
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      const main = document.querySelector('main');
      if (main) main.style.overflowY = 'hidden';
      return () => { if (main) main.style.overflowY = 'auto'; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 overflow-hidden animate-in fade-in duration-300"
    >
      {/* Overlay: Backdrop focado em profundidade */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity cursor-pointer" 
        onClick={onClose} 
      />
      
      {/* 
        ESTRUTURA NEXO PRECISE:
        - translate-y-[-4%]: Ajuste óptico sutil para centro focal.
        - rounded-[2.5rem]: Curvatura premium sem distorção.
      */}
      <div className="relative w-full max-w-2xl bg-[#020608] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col max-h-[90vh] md:translate-y-[-4%] will-change-transform transform-gpu">
        
        {/* Header: Direto e Elegante */}
        <div className="px-8 md:px-12 py-8 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02] shrink-0">
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase leading-none">{title}</h3>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-2">Nexo Financial Suite</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-rose-500 hover:text-white rounded-xl text-slate-500 transition-all active:scale-90"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        
        {/* Body: Scroll otimizado */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AddClientModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addClient } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'PF' as 'PF' | 'PJ',
    document: '',
    responsible: '',
    razaoSocial: '',
    email: '',
    phone: '',
    monthlyValue: '',
    dueDay: '5',
    paymentMethod: 'Pix' as any,
    status: 'Ativo' as any
  });

  const maskDocument = (val: string, type: 'PF' | 'PJ') => {
    val = val.replace(/\D/g, "");
    if (type === 'PF') {
      val = val.substring(0, 11);
      return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      val = val.substring(0, 14);
      return val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const maskCurrency = (val: string) => {
    val = val.replace(/\D/g, "");
    const v = (Number(val) / 100).toFixed(2).replace(".", ",");
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.document) return;
    const rawValue = Number(formData.monthlyValue.replace(/\./g, "").replace(",", "."));
    addClient({
      name: formData.name,
      type: formData.type,
      document: formData.document,
      responsible: formData.responsible,
      razaoSocial: formData.razaoSocial,
      email: formData.email,
      phone: formData.phone,
      monthlyValue: rawValue,
      dueDay: Number(formData.dueDay),
      paymentMethod: formData.paymentMethod,
      status: formData.status
    });
    onClose();
  };

  const labelClass = "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-3";
  const inputClass = "w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] transition-all placeholder:text-slate-800";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Switch de Tipo */}
        <div className="space-y-4">
          <label className={labelClass}>Tipo de Entidade</label>
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5">
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'PF', document: ''})}
              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >Pessoa Física</button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'PJ', document: ''})}
              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >Pessoa Jurídica</button>
          </div>
        </div>

        {/* Dados Básicos */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className={labelClass}>{formData.type === 'PF' ? 'Nome Completo' : 'Nome Fantasia'}</label>
            <input required className={inputClass} placeholder="Digite aqui..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</label>
              <input required className={inputClass} placeholder={formData.type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'} value={formData.document} onChange={e => setFormData({...formData, document: maskDocument(e.target.value, formData.type)})} />
            </div>
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'Profissão' : 'Razão Social'}</label>
              <input className={inputClass} placeholder="Informação adicional" value={formData.type === 'PJ' ? formData.razaoSocial : formData.responsible} onChange={e => setFormData({...formData, [formData.type === 'PJ' ? 'razaoSocial' : 'responsible']: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Financeiro */}
        <div className="pt-4 border-t border-white/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Valor da Recorrência</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">R$</span>
                <input required className={`${inputClass} pl-14`} placeholder="0,00" value={formData.monthlyValue} onChange={e => setFormData({...formData, monthlyValue: maskCurrency(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Dia de Vencimento</label>
              <select className={inputClass} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                {[...Array(28)].map((_, i) => <option key={i+1} value={i+1} className="bg-slate-900">Dia {i+1}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-[11px] active:scale-[0.98] hover:bg-emerald-400 mt-4">
          FINALIZAR CADASTRO
        </button>
      </form>
    </Modal>
  );
};

export const AddReceivableModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, addReceivable, formatNumber } = useApp();
  const [formData, setFormData] = useState({ clientId: '', amount: '', dueDate: '', category: 'Venda' });

  const maskCurrency = (val: string) => {
    val = val.replace(/\D/g, "");
    const v = (Number(val) / 100).toFixed(2).replace(".", ",");
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find(c => c.id === formData.clientId);
    if (!client || !formData.amount || !formData.dueDate) return;
    const rawAmount = Number(formData.amount.replace(/\./g, "").replace(",", "."));
    addReceivable({ clientId: client.id, clientName: client.name, amount: rawAmount, dueDate: formData.dueDate, status: 'Pendente', category: formData.category });
    onClose();
  };

  const labelClass = "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-3";
  const inputClass = "w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500/40 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Recebível">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className={labelClass}>Parceiro</label>
          <select required className={inputClass} value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
            <option value="" className="bg-slate-900">Selecione um cliente...</option>
            {state.clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Valor</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">R$</span>
              <input required className={`${inputClass} pl-14`} placeholder="0,00" value={formData.amount} onChange={e => setFormData({...formData, amount: maskCurrency(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Vencimento</label>
            <input required type="date" className={inputClass} value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[11px] active:scale-[0.98] hover:bg-emerald-400 mt-4">
          REGISTRAR TÍTULO
        </button>
      </form>
    </Modal>
  );
};

export const AddExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addExpense } = useApp();
  const [formData, setFormData] = useState({ description: '', amount: '', date: '', category: 'Outros' });

  const maskCurrency = (val: string) => {
    val = val.replace(/\D/g, "");
    const v = (Number(val) / 100).toFixed(2).replace(".", ",");
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    const rawAmount = Number(formData.amount.replace(/\./g, "").replace(",", "."));
    addExpense({ description: formData.description, amount: rawAmount, date: formData.date, category: formData.category });
    onClose();
  };

  const labelClass = "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-3";
  const inputClass = "w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-semibold text-white focus:outline-none focus:border-rose-500/40 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Despesa">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className={labelClass}>Descrição</label>
          <input required type="text" className={inputClass} placeholder="Ex: Servidores Cloud" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Valor</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs">R$</span>
              <input required className={`${inputClass} pl-14`} placeholder="0,00" value={formData.amount} onChange={e => setFormData({...formData, amount: maskCurrency(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Data</label>
            <input required type="date" className={inputClass} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="w-full bg-rose-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[11px] active:scale-[0.98] hover:bg-rose-400 mt-4">
          REGISTRAR SAÍDA
        </button>
      </form>
    </Modal>
  );
};
