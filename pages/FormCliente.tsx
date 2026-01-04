
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const FormCliente: React.FC = () => {
  const { state, addClient } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', 
    type: 'PF' as 'PF' | 'PJ', 
    document: '', 
    installments: '12', // Valor padrão de 1 ano
    email: '', 
    phone: '', 
    monthlyValue: '', 
    dueDay: '10', // Dia padrão dia 10
    status: 'Ativo' as any
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
    if (!formData.name || !formData.document || !formData.monthlyValue) return;
    
    const rawValue = Number(formData.monthlyValue.replace(/\./g, "").replace(",", "."));
    
    addClient({ 
      ...formData, 
      monthlyValue: rawValue, 
      installments: Number(formData.installments),
      dueDay: Number(formData.dueDay),
      email: formData.email || `${formData.name.toLowerCase().replace(/\s/g, '')}@exemplo.com`,
      phone: formData.phone || '(00) 00000-0000'
    });
    
    // Redireciona para Dashboard para ver o impacto nos gráficos
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
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Cadastro rápido de venda</p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className="px-6 py-3 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-all"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 glass-card p-10 rounded-[3rem] shadow-2xl">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] rounded-xl border border-white/5">
            <button type="button" onClick={() => setFormData({...formData, type: 'PF', document: ''})} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PF' ? 'bg-emerald-500 text-black' : 'text-slate-600'}`}>Pessoa Física</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'PJ', document: ''})} className={`py-3 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'PJ' ? 'bg-emerald-500 text-black' : 'text-slate-600'}`}>Pessoa Jurídica</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Nome do cliente (ou nome fantasia)</label>
              <input required className={inputClass} placeholder="Ex: João da Padaria" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>CPF</label>
                <input required className={inputClass} placeholder="Ex: 000.000.000-00" value={formData.document} onChange={e => setFormData({...formData, document: maskDocument(e.target.value, formData.type)})} />
              </div>
              <div>
                <label className={labelClass}>Quantas parcelas?</label>
                <input required type="number" min="1" className={inputClass} placeholder="Ex: 12 (ou 60)" value={formData.installments} onChange={e => setFormData({...formData, installments: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Valor mensal (R$)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-[10px]">R$</span>
                <input required className={`${inputClass} pl-12`} placeholder="Ex: 1200" value={formData.monthlyValue} onChange={e => setFormData({...formData, monthlyValue: maskCurrency(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Dia de cobrança</label>
              <select className={`${inputClass} appearance-none cursor-pointer pr-10`} value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: e.target.value})}>
                {[...Array(31)].map((_, i) => <option key={i+1} value={i+1} className="bg-slate-950 text-white font-bold italic">Dia {i+1}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-6 border border-white/10">
          Cadastrar cliente
        </button>
      </form>
    </div>
  );
};

export default FormCliente;
