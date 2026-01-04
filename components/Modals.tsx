
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * COMPONENTE SIDE DRAWER (PAINEL LATERAL)
 * Padrão ouro para SaaS B2B. Ocupa 100% da altura para evitar erros de centralização.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Bloqueia o scroll do body sem causar saltos de layout (combinado com scrollbar-gutter: stable no CSS)
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[500] flex justify-end overflow-hidden"
    >
      {/* Backdrop: Fundo escuro e desfoque para focar no formulário */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer" 
        onClick={onClose} 
      />
      
      {/* 
        ESTRUTURA DRAWER:
        - h-full: Ocupa toda a altura da viewport.
        - bg-[#050a0e]: Tom de cinza profundo para melhor contraste com o dashboard.
        - shadow-[-40px_0_80px_rgba(0,0,0,0.9)]: Sombra pesada para indicar sobreposição.
      */}
      <div className="relative h-full w-full max-w-lg bg-[#050a0e] border-l border-white/10 shadow-[-40px_0_80px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col will-change-transform transform-gpu">
        
        {/* Header: Hierarquia de informação limpa */}
        <div className="px-10 py-10 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01] shrink-0">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Nexo Intelligence Terminal</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-full text-slate-500 transition-all active:scale-90"
            aria-label="Fechar painel"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Body: Densidade otimizada e scroll independente */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 overscroll-contain bg-gradient-to-b from-transparent to-emerald-500/[0.01]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AddClientModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addClient } = useApp();
  
  const [formData, setFormData] = useState({
    name: '', type: 'PF' as 'PF' | 'PJ', document: '', responsible: '', razaoSocial: '', email: '', phone: '', monthlyValue: '', dueDay: '5', paymentMethod: 'Pix' as any, status: 'Ativo' as any
  });

  const maskDocument = (val: string, type: 'PF' | 'PJ') => {
    val = val.replace(/\D/g, "");
    if (type === 'PF') return val.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return val.substring(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
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
    addClient({ ...formData, monthlyValue: rawValue, dueDay: Number(formData.dueDay) });
    onClose();
  };

  // UI REFACTOR: Labels sem itálico, mais legíveis. Inputs com maior affordance.
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 block ml-1";
  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 px-5 text-sm font-semibold text-white placeholder:text-slate-800 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-10 pb-6">
        
        {/* Seção A: Identidade */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] rounded-xl border border-white/5">
            <button type="button" onClick={() => setFormData({...formData, type: 'PF', document: ''})} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-600 hover:text-white'}`}>Pessoa Física</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'PJ', document: ''})} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-600 hover:text-white'}`}>Pessoa Jurídica</button>
          </div>

          <div>
            <label className={labelClass}>Nome Completo / Fantasia</label>
            <input required className={inputClass} placeholder="Identificação da conta..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</label>
              <input required className={inputClass} placeholder="000.000.000-00" value={formData.document} onChange={e => setFormData({...formData, document: maskDocument(e.target.value, formData.type)})} />
            </div>
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'Profissão' : 'Razão Social'}</label>
              <input className={inputClass} placeholder="..." value={formData.type === 'PJ' ? formData.razaoSocial : formData.responsible} onChange={e => setFormData({...formData, [formData.type === 'PJ' ? 'razaoSocial' : 'responsible']: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Seção B: Financeiro */}
        <div className="pt-8 border-t border-white/5 space-y-8">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic ml-1 opacity-60">B. Configuração Financeira</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Valor Recorrente</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-[10px]">R$</span>
                <input required className={`${inputClass} pl-12`} placeholder="0,00" value={formData.monthlyValue} onChange={e => setFormData({...formData, monthlyValue: maskCurrency(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Vencimento</label>
              <select className={`${inputClass} appearance-none cursor-pointer pr-10`} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                {[...Array(28)].map((_, i) => <option key={i+1} value={i+1} className="bg-slate-950 text-white font-bold italic">Dia {i+1}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-6 border border-white/10">
          EFETIVAR REGISTRO NO TERMINAL
        </button>
      </form>
    </Modal>
  );
};

export const AddReceivableModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, addReceivable } = useApp();
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

  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 block ml-1";
  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 px-5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500/50 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Lançamento">
      <form onSubmit={handleSubmit} className="space-y-8 pb-6">
        <div>
          <label className={labelClass}>Vincular ao Cliente</label>
          <select required className={inputClass} value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
            <option value="" className="bg-slate-950">Selecione na base de dados...</option>
            {state.clients.map(c => <option key={c.id} value={c.id} className="bg-slate-950 font-bold">{c.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Montante</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-[10px]">R$</span>
              <input required className={`${inputClass} pl-12`} placeholder="0,00" value={formData.amount} onChange={e => setFormData({...formData, amount: maskCurrency(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Data de Emissão</label>
            <input required type="date" className={inputClass} value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
        </div>

        <div className="pt-20">
          <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] border border-white/10">
            CONSOLIDAR TÍTULO FINANCEIRO
          </button>
        </div>
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
    addExpense({ ...formData, amount: rawAmount });
    onClose();
  };

  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 block ml-1";
  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 px-5 text-sm font-semibold text-white focus:outline-none focus:border-rose-500/50 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Despesa">
      <form onSubmit={handleSubmit} className="space-y-8 pb-6">
        <div>
          <label className={labelClass}>Descrição do Gasto</label>
          <input required type="text" className={inputClass} placeholder="Ex: Servidores Cloud, Aluguel..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Valor Efetivo</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-[10px]">R$</span>
              <input required className={`${inputClass} pl-12`} placeholder="0,00" value={formData.amount} onChange={e => setFormData({...formData, amount: maskCurrency(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Data do Gasto</label>
            <input required type="date" className={inputClass} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
        </div>

        <div className="pt-20">
          <button type="submit" className="w-full bg-rose-500 text-white font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-rose-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] border border-white/10">
            CONSOLIDAR DESPESA NO FLUXO
          </button>
        </div>
      </form>
    </Modal>
  );
};
