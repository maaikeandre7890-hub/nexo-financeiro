
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const FormCliente: React.FC = () => {
  const { state, addClient, maskCurrency, parseCurrency, logAction } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', 
    type: 'PF' as 'PF' | 'PJ', 
    document: '', 
    installments: '12', 
    email: '', 
    phone: '', 
    monthlyValue: '', 
    dueDay: '10', 
    birthDate: '',
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zip: '',
    status: 'Ativo' as any
  });

  const validateCPF = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCpf)) return false;
    return true;
  };

  const maskDocument = (val: string, type: 'PF' | 'PJ') => {
    val = val.replace(/\D/g, "");
    if (type === 'PF') return val.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return val.substring(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const maskPhone = (val: string) => {
    val = val.replace(/\D/g, "");
    if (val.length <= 10) {
      return val.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return val.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.document || !formData.monthlyValue || !formData.phone) return;
    
    const rawValue = parseCurrency(formData.monthlyValue);
    
    // Armazenar CPF mascarado no banco por padrão conforme regra de segurança
    const maskedDoc = formData.type === 'PF' 
      ? formData.document.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "***.***.$3-$4")
      : formData.document;

    addClient({ 
      ...formData, 
      document: maskedDoc,
      monthlyValue: rawValue, 
      installments: Number(formData.installments),
      dueDay: Number(formData.dueDay),
      email: formData.email || `${formData.name.toLowerCase().replace(/\s/g, '')}@exemplo.com`,
      phone: formData.phone,
      address: {
        street: formData.street,
        number: formData.number,
        district: formData.district,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      }
    });
    
    navigate('/dashboard');
  };

  const labelClass = `text-[10px] font-black uppercase tracking-widest mb-2.5 block ml-1 ${
    state.theme === 'light' ? 'text-slate-600' : 'text-white'
  }`;
  
  const inputClass = `w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 px-5 text-sm font-semibold placeholder:text-slate-800 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] transition-all ${
    state.theme === 'light' ? 'text-slate-900 border-slate-200 bg-slate-50' : 'text-white'
  }`;

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className={`text-3xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Novo Cliente</h1>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Cadastro de Venda e Contato</p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className="px-6 py-3 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-all"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] rounded-xl border border-white/5">
            <button type="button" onClick={() => setFormData({...formData, type: 'PF', document: ''})} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-black' : 'text-slate-600'}`}>Pessoa Física</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'PJ', document: ''})} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-black' : 'text-slate-600'}`}>Pessoa Jurídica</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</label>
              <div className="relative">
                <input 
                  required 
                  className={inputClass} 
                  placeholder={formData.type === 'PF' ? "000.000.000-00" : "00.000.000/0000-00"} 
                  value={formData.document} 
                  onChange={e => setFormData({...formData, document: maskDocument(e.target.value, formData.type)})} 
                />
              </div>
              {formData.type === 'PF' && (
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-2 ml-1">
                  Consulta automática será habilitada em breve.
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Nome Completo / Razão Social</label>
              <input required className={inputClass} placeholder="Ex: João da Padaria" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>E-mail</label>
                <input className={inputClass} placeholder="cliente@exemplo.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp / Celular</label>
                <input required className={inputClass} placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-8">
           <div className="space-y-6">
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4 block italic">Informações de Fluxo</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Valor mensal (R$)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-[10px]">R$</span>
                    <input 
                      required 
                      className={`${inputClass} pl-12`} 
                      placeholder="0,00" 
                      value={formData.monthlyValue} 
                      onInput={(e) => e.currentTarget.value = maskCurrency(e.currentTarget.value)} 
                      onChange={e => setFormData({...formData, monthlyValue: e.target.value})} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Vencimento & Ciclo</label>
                  <div className="flex gap-4">
                    <select className={`${inputClass} appearance-none cursor-pointer flex-1`} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                      {[...Array(31)].map((_, i) => <option key={i+1} value={i+1} className="bg-slate-950 text-white font-bold italic">Dia {i+1}</option>)}
                    </select>
                    <input required type="number" min="1" className={`${inputClass} w-24 text-center`} placeholder="Parcelas" value={formData.installments} onChange={e => setFormData({...formData, installments: e.target.value})} />
                  </div>
                </div>
              </div>
           </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-6 border border-white/10">
          CONSOLIDAR CADASTRO
        </button>
      </form>
    </div>
  );
};

export default FormCliente;
