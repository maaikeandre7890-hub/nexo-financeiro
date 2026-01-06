import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const FormCliente: React.FC = () => {
  const { state, addClient, maskCurrency, parseCurrency } = useApp();
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);
  
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

  const [cpfStatus, setCpfStatus] = useState<'valid' | 'invalid' | null>(null);

  const validateCPF = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCpf)) return false;
    
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;
    
    return true;
  };

  const handleCPFKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (formData.type === 'PF') {
        const isValid = validateCPF(formData.document);
        if (isValid) {
          setCpfStatus('valid');
          setTimeout(() => nameInputRef.current?.focus(), 10);
        } else {
          setCpfStatus('invalid');
        }
      } else {
        nameInputRef.current?.focus();
      }
    }
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
    state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'
  }`;
  
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] transition-all ${
    state.theme === 'light' 
      ? 'text-[#0F172A] border-slate-200 bg-white placeholder:text-slate-300' 
      : 'text-white border-white/10 bg-white/[0.04] placeholder:text-slate-800'
  }`;

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className={`text-3xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#2563EB]' : 'text-white'}`}>Novo Cliente</h1>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Cadastro de Venda e Contato</p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className={`px-6 py-3 bg-transparent border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.theme === 'light' ? 'border-slate-200 text-slate-500 hover:text-emerald-500 hover:border-emerald-500' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20 hover:bg-white/5'}`}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-10 glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden ${state.theme === 'light' ? 'bg-white' : ''}`}>
        <div className="space-y-8">
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border ${state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
            <button type="button" onClick={() => { setFormData({...formData, type: 'PF', document: ''}); setCpfStatus(null); }} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-emerald-500'}`}>Pessoa Física</button>
            <button type="button" onClick={() => { setFormData({...formData, type: 'PJ', document: ''}); setCpfStatus(null); }} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-emerald-500'}`}>Pessoa Jurídica</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</label>
              <div className="relative">
                <input 
                  required 
                  className={`${inputClass} ${cpfStatus === 'invalid' ? 'border-rose-500/50' : cpfStatus === 'valid' ? 'border-emerald-500/50' : ''}`}
                  placeholder={formData.type === 'PF' ? "000.000.000-00" : "00.000.000/0000-00"} 
                  value={formData.document} 
                  onChange={e => {
                    setFormData({...formData, document: maskDocument(e.target.value, formData.type)});
                    if (cpfStatus) setCpfStatus(null);
                  }}
                  onKeyDown={handleCPFKeyDown}
                />
              </div>
              {formData.type === 'PF' && (
                <div className="mt-2 ml-1">
                  {cpfStatus === 'valid' ? (
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-in fade-in">
                      CPF válido. Complete os dados do cliente.
                    </p>
                  ) : cpfStatus === 'invalid' ? (
                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest animate-in fade-in">
                      CPF inválido. Verifique os dígitos.
                    </p>
                  ) : (
                    <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${state.theme === 'light' ? 'text-slate-400' : 'text-zinc-600'}`}>
                      Pressione ENTER para validar.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Nome Completo / Razão Social</label>
              <input 
                required 
                ref={nameInputRef}
                className={inputClass} 
                placeholder="Ex: João da Padaria" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
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
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 block italic ${state.theme === 'light' ? 'text-slate-400' : 'text-zinc-700'}`}>Informações de Fluxo</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Valor mensal (R$)</label>
                  <div className="relative">
                    <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-[10px] ${state.theme === 'light' ? 'text-slate-400' : 'text-slate-700'}`}>R$</span>
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
                    <select className={`${inputClass} appearance-none cursor-pointer flex-1 ${state.theme === 'light' ? '' : 'bg-slate-950 text-white'}`} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                      {[...Array(31)].map((_, i) => <option key={i+1} value={i+1} className={state.theme === 'light' ? '' : 'bg-slate-950 text-white font-bold italic'}>Dia {i+1}</option>)}
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