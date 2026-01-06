
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const GerarNF: React.FC = () => {
  const { state, maskCurrency, parseCurrency } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    clientId: '',
    document: '',
    amount: '',
    description: '',
    type: 'Serviço',
    status: 'Rascunho'
  });

  const handleClientChange = (clientId: string) => {
    const client = state.clients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      clientId,
      document: client ? client.document : ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de API pendente para emissão fiscal.');
  };

  const labelClass = "text-[10px] font-black uppercase tracking-widest mb-2.5 block ml-1 text-white";
  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 px-5 text-sm font-semibold placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.02] transition-all text-white";

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Gerar Nota Fiscal</h1>
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Documento Fiscal</p>
        </div>
        <button 
          onClick={() => navigate('/boletos-nf')}
          className="px-6 py-3 bg-transparent border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tipo de Nota</label>
              <select 
                className={inputClass} 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Serviço" className="bg-slate-950">Serviço</option>
                <option value="Produto" className="bg-slate-950">Produto</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className="py-4 px-5 bg-white/[0.02] border border-white/5 rounded-xl text-blue-400 font-black text-xs uppercase tracking-widest">
                {formData.status}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Selecionar Tomador (Cliente)</label>
            <select 
              required 
              className={inputClass} 
              value={formData.clientId} 
              onChange={e => handleClientChange(e.target.value)}
            >
              <option value="" className="bg-slate-950">Selecione o cliente...</option>
              {state.clients.map(c => <option key={c.id} value={c.id} className="bg-slate-950 font-bold">{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>CPF / CNPJ do Tomador</label>
            <input 
              readOnly 
              className={`${inputClass} opacity-50 cursor-not-allowed`} 
              value={formData.document} 
            />
          </div>

          <div>
            <label className={labelClass}>Valor Bruto (R$)</label>
            <input 
              required 
              className={inputClass} 
              placeholder="0,00" 
              value={formData.amount} 
              onInput={(e) => e.currentTarget.value = maskCurrency(e.currentTarget.value)} 
              onChange={e => setFormData({...formData, amount: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>Discriminação dos Serviços</label>
            <textarea 
              className={`${inputClass} h-32 resize-none`} 
              placeholder="Ex: Prestação de serviços de consultoria financeira..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-blue-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-6">
          Configuração de API pendente
        </button>
      </form>
    </div>
  );
};

export default GerarNF;
