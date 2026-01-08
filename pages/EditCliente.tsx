import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.tsx';
import { Client } from '../types.ts';

const EditCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, updateClient, maskCurrency, parseCurrency, formatNumber } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadClient = () => {
      setIsLoading(true);
      const client = state.clients.find(c => c.id === id);
      if (client) {
        setFormData({ ...client });
      } else {
        navigate('/clientes');
      }
      setIsLoading(false);
    };

    loadClient();
  }, [id, state.clients, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !id) return;
    
    setIsSaving(true);
    
    // Feedback visual premium de persistência
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
  
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold focus:outline-none focus:border-emerald-500/50 transition-all ${
    state.theme === 'light' ? 'text-[#0F172A] border-slate-200 bg-white' : 'text-white border-white/10 bg-white/[0.04]'
  }`;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-circle-notch animate-spin text-4xl text-emerald-500"></i>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Carregando Perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      {/* Header idêntico ao de referência */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className={`text-3xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#2563EB]' : 'text-white'}`}>
            Editar Cliente
          </h1>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">
            Atualização de Registro Ativo
          </p>
        </div>
        <button 
          onClick={() => navigate('/clientes')}
          className={`px-6 py-3 bg-transparent border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.theme === 'light' ? 'border-slate-200 text-slate-500 hover:text-emerald-500 hover:border-emerald-500' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-10 glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden ${state.theme === 'light' ? 'bg-white' : ''}`}>
        {showSuccess && (
          <div className="absolute inset-0 bg-emerald-500 z-50 flex flex-col items-center justify-center text-black animate-in fade-in duration-500">
             <i className="fa-solid fa-check-circle text-6xl mb-4"></i>
             <h3 className="text-2xl font-black uppercase italic tracking-tighter">Dados Atualizados</h3>
             <p className="text-xs font-bold uppercase tracking-widest mt-2 text-black/60">Sincronizando com a base...</p>
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
              <label className={labelClass}>Status Operacional</label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Valor Mensal (R$)</label>
              <div className="relative">
                <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-[10px] ${state.theme === 'light' ? 'text-slate-400' : 'text-slate-700'}`}>R$</span>
                <input 
                  required 
                  className={`${inputClass} pl-12`} 
                  value={formData.monthlyValue ? formatNumber(formData.monthlyValue) : '0,00'} 
                  onInput={e => e.currentTarget.value = maskCurrency(e.currentTarget.value)}
                  onChange={e => setFormData({...formData, monthlyValue: parseCurrency(e.target.value)})} 
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Total de Parcelas</label>
              <input 
                required 
                type="number"
                min="1"
                className={inputClass} 
                value={formData.installments || 12} 
                onChange={e => setFormData({...formData, installments: Number(e.target.value)})} 
              />
            </div>
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

          <div>
             <label className={labelClass}>Observações Internas</label>
             <textarea 
               className={`${inputClass} min-h-[120px] resize-none`}
               placeholder="Notas sobre o cliente, acordos verbais ou histórico..."
               value={formData.notes || ''}
               onChange={e => setFormData({...formData, notes: e.target.value})}
             />
          </div>
        </div>

        {/* Botão de submit idêntico ao de referência */}
        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-10 border border-white/10 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <i className="fa-solid fa-circle-notch animate-spin"></i>
              PROCESSANDO...
            </>
          ) : (
            'SALVAR ALTERAÇÕES E ATUALIZAR BASE'
          )}
        </button>
      </form>
    </div>
  );
};

export default EditCliente;