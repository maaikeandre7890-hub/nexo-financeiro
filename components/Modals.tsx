
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Bloqueio de scroll do body quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden animate-in fade-in duration-300">
      {/* Overlay Estático */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Container do Modal */}
      <div className="relative w-full max-w-2xl bg-[#020608] border-t md:border border-white/[0.05] rounded-t-[4rem] md:rounded-[4rem] shadow-[0_100px_150px_-30px_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-bottom-20 md:zoom-in-95 duration-700 flex flex-col max-h-[95vh] md:max-h-[90vh]">
        
        {/* Barra de arraste mobile */}
        <div className="md:hidden flex justify-center py-6 shrink-0" onClick={onClose}>
          <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
        </div>

        {/* Header do Modal */}
        <div className="px-10 md:px-12 py-8 border-b border-white/[0.03] flex justify-between items-center bg-white/[0.01] shrink-0">
          <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">{title}</h3>
          <button onClick={onClose} className="hidden md:flex w-10 h-10 items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-slate-500 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {/* Área de Conteúdo com Scroll Interno Exclusivo */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-12">
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

  // Funções de Máscara
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

  const maskPhone = (val: string) => {
    val = val.replace(/\D/g, "").substring(0, 11);
    return val.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
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

  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4 block mb-3";
  const inputClass = "w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-800";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* SEÇÃO: IDENTIDADE */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-emerald-500/30"></span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Identidade</span>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-2 rounded-2xl border border-white/5">
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'PF', document: ''})}
              className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-600 hover:text-white'}`}
            >Pessoa Física</button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: 'PJ', document: ''})}
              className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-600 hover:text-white'}`}
            >Pessoa Jurídica</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'Nome Completo' : 'Nome Fantasia'}</label>
              <input 
                required
                className={inputClass}
                placeholder={formData.type === 'PF' ? 'Ex: João Silva' : 'Ex: Nexo Tech'}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</label>
                <input 
                  required
                  className={inputClass}
                  placeholder={formData.type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                  value={formData.document}
                  onChange={e => setFormData({...formData, document: maskDocument(e.target.value, formData.type)})}
                />
              </div>
              {formData.type === 'PJ' ? (
                <div>
                  <label className={labelClass}>Razão Social</label>
                  <input className={inputClass} placeholder="Nome Empresarial" value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Profissão / Cargo</label>
                  <input className={inputClass} placeholder="Ocupação Principal" />
                </div>
              )}
            </div>

            {formData.type === 'PJ' && (
              <div>
                <label className={labelClass}>Nome do Responsável</label>
                <input className={inputClass} placeholder="Pessoa de contato direto" value={formData.responsible} onChange={e => setFormData({...formData, responsible: e.target.value})} />
              </div>
            )}
          </div>
        </section>

        {/* SEÇÃO: COMUNICAÇÃO */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-emerald-500/30"></span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Comunicação</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>E-mail Principal</label>
              <input required type="email" className={inputClass} placeholder="contato@entidade.com.br" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Telefone / WhatsApp</label>
              <input required className={inputClass} placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})} />
            </div>
          </div>
        </section>

        {/* SEÇÃO: FINANCEIRO */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-emerald-500/30"></span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Financeiro</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Valor Mensal (R$)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 font-black mono text-[10px]">R$</span>
                <input 
                  required
                  className={`${inputClass} pl-14`}
                  placeholder="0,00"
                  value={formData.monthlyValue}
                  onChange={e => setFormData({...formData, monthlyValue: maskCurrency(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Dia de Vencimento</label>
              <select className={inputClass} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                {[...Array(28)].map((_, i) => <option key={i+1} value={i+1} className="bg-slate-900">Dia {i+1}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Forma de Pagamento</label>
              <select className={inputClass} value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                <option value="Boleto" className="bg-slate-900">Boleto Bancário</option>
                <option value="Pix" className="bg-slate-900">Chave Pix</option>
                <option value="Transferência" className="bg-slate-900">TED / DOC / Lançamento</option>
                <option value="Outro" className="bg-slate-900">Personalizado</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status Inicial</label>
              <select className={inputClass} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Ativo" className="bg-slate-900">Ativo</option>
                <option value="Inadimplente" className="bg-slate-900 text-rose-500">Inadimplente</option>
                <option value="Em negociação" className="bg-slate-900 text-amber-500">Em negociação</option>
              </select>
            </div>
          </div>
        </section>

        <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-7 rounded-[2rem] transition-all shadow-2xl uppercase tracking-[0.3em] text-[11px] active:scale-[0.98] hover:bg-emerald-400">
          CONSOLIDAR CADASTRO
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

    addReceivable({
      clientId: client.id,
      clientName: client.name,
      amount: rawAmount,
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
            <div className="relative">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 font-black mono text-[10px]">R$</span>
              <input 
                required
                className={`${inputClass} pl-16`}
                placeholder="0,00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: maskCurrency(e.target.value)})}
              />
            </div>
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

  const maskCurrency = (val: string) => {
    val = val.replace(/\D/g, "");
    const v = (Number(val) / 100).toFixed(2).replace(".", ",");
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    
    const rawAmount = Number(formData.amount.replace(/\./g, "").replace(",", "."));

    addExpense({
      description: formData.description,
      amount: rawAmount,
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
            <div className="relative">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 font-black mono text-[10px]">R$</span>
              <input 
                required
                className={`${inputClass} pl-16`}
                placeholder="0,00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: maskCurrency(e.target.value)})}
              />
            </div>
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
