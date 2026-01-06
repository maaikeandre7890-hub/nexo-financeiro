
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Client } from '../types';

const EditCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, updateClient, maskCurrency, parseCurrency, formatNumber } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const client = state.clients.find(c => c.id === id);
    if (client) {
      setFormData({ ...client });
    } else {
      navigate('/clientes');
    }
  }, [id, state.clients, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !id) return;
    
    setIsSaving(true);
    
    // Simula salvamento para UX premium
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateClient(id, formData);
    
    setIsSaving(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      navigate('/clientes');
    }, 1500);
  };

  const maskPhone = (val: string) => {
    val = val.replace(/\D/g, "");
    if (val.length <= 10) {
      return val.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return val.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const labelClass = `text-[10px] font-black uppercase tracking-widest mb-2.5 block ml-1 ${
    state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'
  }`;
  
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] transition-all ${
    state.theme === 'light' 
      ? 'text-[#0F172A] border-slate-200 bg-white placeholder:text-slate-300' 
      : 'text-white border-white/10 bg-white/[0.04] placeholder:text-slate-800'
  }`;

  if (!formData.name) return null;

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className={`text-3xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Editar Cliente</h1>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Atualização Cadastral e Financeira</p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className={`px-6 py-3 bg-transparent border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.theme === 'light' ? 'border-slate-200 text-[#6B7280]' : 'border-white/10 text-slate-500 hover:text-white'}`}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-10 glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden ${state.theme === 'light' ? 'bg-white' : ''}`}>
        {showSuccess && (
          <div className="absolute inset-0 bg-emerald-500 z-50 flex flex-col items-center justify-center text-black animate-in fade-in duration-500">
             <i className="fa-solid fa-check-circle text-6xl mb-4"></i>
             <h3 className="text-2xl font-black uppercase italic tracking-tighter">Alterações Salvas</h3>
             <p className="text-xs font-bold uppercase tracking-widest mt-2">Retornando à lista...</p>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <label className={labelClass}>Nome Completo / Razão Social</label>
            <input 
              required 
              className={inputClass} 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Documento (CPF/CNPJ)</label>
              <input 
                disabled 
                className={`${inputClass} opacity-50 cursor-not-allowed`} 
                value={formData.document || ''} 
              />
            </div>
            <div>
              <label className={labelClass}>Status da Conta</label>
              <select 
                className={inputClass} 
                value={formData.status || 'Ativo'} 
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="Ativo" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Ativo</option>
                <option value="Inadimplente" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Inadimplente</option>
                <option value="Em negociação" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Em negociação</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>WhatsApp / Celular</label>
              <input 
                required 
                className={inputClass} 
                value={formData.phone || ''} 
                onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})} 
              />
            </div>
            <div>
              <label className={labelClass}>E-mail de Contato</label>
              <input 
                className={inputClass} 
                value={formData.email || ''} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 block italic ${state.theme === 'light' ? 'text-slate-400' : 'text-zinc-700'}`}>Condições de Cobrança</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Valor Mensal (R$)</label>
                  <input 
                    required 
                    className={inputClass} 
                    value={formData.monthlyValue ? formatNumber(formData.monthlyValue) : '0,00'} 
                    onInput={e => e.currentTarget.value = maskCurrency(e.currentTarget.value)}
                    onChange={e => setFormData({...formData, monthlyValue: parseCurrency(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Dia de Vencimento</label>
                  <select 
                    className={inputClass} 
                    value={formData.dueDay || 10} 
                    onChange={e => setFormData({...formData, dueDay: Number(e.target.value)})}
                  >
                    {[...Array(31)].map((_, i) => <option key={i+1} value={i+1} className={state.theme === 'light' ? '' : 'bg-slate-950'}>Dia {i+1}</option>)}
                  </select>
                </div>
              </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-6 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <i className="fa-solid fa-circle-notch animate-spin"></i>
              PROCESSANDO...
            </>
          ) : (
            'CONFIRMAR ALTERAÇÕES'
          )}
        </button>
      </form>
    </div>
  );
};

export default EditCliente;
