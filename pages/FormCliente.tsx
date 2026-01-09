import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.tsx';

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
    
    addClient({ 
      ...formData, 
      document: formData.document,
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

  const labelClass = `text-[9px] font-black uppercase tracking-[0.2em] mb-2.5 block ml-1 ${
    state.theme === 'light' ? 'text-slate-500' : 'text-zinc-600'
  }`;
  
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold focus:outline-none transition-all duration-300 ${
    state.theme === 'light' 
      ? 'text-slate-900 border-slate-200 bg-white placeholder:text-slate-300 focus:border-emerald-500/30' 
      : 'text-white border-white/5 bg-white/[0.02] placeholder:text-zinc-800 focus:border-emerald-500/20 focus:bg-white/[0.04]'
  }`;

  return (
    <div className="space-y-10 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between pb-8">
        <div className="space-y-1">
          <h1 className={`text-2xl font-bold italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Novo Cliente</h1>
          <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">Protocolo de Inserção de Ativos</p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className={`px-5 py-2.5 bg-transparent border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state.theme === 'light' ? 'border-slate-200 text-slate-500 hover:text-emerald-500' : 'border-white/5 text-zinc-500 hover:text-white'}`}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-8 glass-card p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ${state.theme === 'light' ? 'bg-white' : ''}`}>
        <div className="space-y-6">
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border ${state.theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.01] border-white/5'}`}>
            <button type="button" onClick={() => { setFormData({...formData, type: 'PF', document: ''}); setCpfStatus(null); }} className={`py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-600 hover:text-emerald-500'}`}>Pessoa Física</button>
            <button type="button" onClick={() => { setFormData({...formData, type: 'PJ', document: ''}); setCpfStatus(null); }} className={`py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-600 hover:text-emerald-500'}`}>Pessoa Jurídica</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>{formData.type === 'PF' ? 'CPF' : 'CNPJ'}</label>
              <input 
                required 
                className={`${inputClass} ${cpfStatus === 'invalid' ? 'border-rose-500/30' : cpfStatus === 'valid' ? 'border-emerald-500/30' : ''}`}
                placeholder={formData.type === 'PF' ? "000.000.000-00" : "00.000.000/0000-00"} 
                value={formData.document} 
                onChange={e => setFormData({...formData, document: maskDocument(e.target.value, formData.type)})}
                onKeyDown={handleCPFKeyDown}
              />
              {formData.type === 'PF' && cpfStatus === 'invalid' && (
                <p className="mt-2 text-[8px] font-bold text-rose-500 uppercase tracking-widest">Documento inválido no protocolo nacional.</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Nome Completo / Razão Social</label>
              <input 
                required 
                ref={nameInputRef}
                className={inputClass} 
                placeholder="Ex: NEXO Capital Holding" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>E-mail Institucional</label>
                <input className={inputClass} type="email" placeholder="contato@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Operacional</label>
                <input required className={inputClass} placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Valor mensal (R$)</label>
                <input 
                  required 
                  className={inputClass} 
                  placeholder="0,00" 
                  value={formData.monthlyValue} 
                  onInput={(e) => e.currentTarget.value = maskCurrency(e.currentTarget.value)} 
                  onChange={e => setFormData({...formData, monthlyValue: e.target.value})} 
                />
              </div>
              <div>
                <label className={labelClass}>Vencimento & Parcelas</label>
                <div className="flex gap-2">
                  <select className={`${inputClass} flex-1 appearance-none`} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                    {[...Array(31)].map((_, i) => <option key={i+1} value={i+1} className="bg-black text-white">Dia {i+1}</option>)}
                  </select>
                  <input required type="number" min="1" className={`${inputClass} w-24 text-center`} placeholder="12x" value={formData.installments} onChange={e => setFormData({...formData, installments: e.target.value})} />
                </div>
              </div>
           </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl transition-all shadow-xl hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] mt-6">
          VALIDAR E REGISTRAR CLIENTE
        </button>
      </form>
    </div>
  );
};

export default FormCliente;