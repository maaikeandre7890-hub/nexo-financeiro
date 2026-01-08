import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.tsx';

const FormRecebivel: React.FC = () => {
  const { state, addReceivable, formatNumber, maskCurrency, parseCurrency } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    clientId: '', 
    amount: '', 
    dueDate: '', 
    category: 'Venda',
    paymentMethod: 'PIX' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find(c => c.id === formData.clientId);
    if (!client || !formData.amount || !formData.dueDate) return;
    const rawAmount = parseCurrency(formData.amount);
    
    addReceivable({ 
      clientId: client.id, 
      clientName: client.name, 
      amount: rawAmount, 
      dueDate: formData.dueDate, 
      status: 'Pendente', 
      category: formData.category,
      paymentMethod: formData.paymentMethod as any
    });
    
    navigate('/dashboard');
  };

  const labelClass = `text-[10px] font-black uppercase tracking-widest mb-2.5 block ml-1 ${
    state.theme === 'light' ? 'text-[#0F172A]' : 'text-white'
  }`;
  
  const inputClass = `w-full border rounded-xl py-4 px-5 text-sm font-semibold focus:outline-none focus:border-emerald-500/50 transition-all ${
    state.theme === 'light' ? 'text-[#0F172A] border-slate-200 bg-white' : 'text-white border-white/10 bg-white/[0.04]'
  }`;

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className={`text-3xl font-black italic uppercase tracking-tighter ${state.theme === 'light' ? 'text-[#2563EB]' : 'text-white'}`}>Novo Lançamento</h1>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Fluxo de Entrada</p>
        </div>
        <button 
          onClick={() => navigate('/recebiveis')}
          className={`px-6 py-3 bg-transparent border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.theme === 'light' ? 'border-slate-200 text-slate-500 hover:text-emerald-500' : 'border-white/10 text-slate-500 hover:text-white'}`}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-10 glass-card p-10 rounded-[3rem] shadow-2xl ${state.theme === 'light' ? 'bg-white' : ''}`}>
        <div className="space-y-8">
          <div>
            <label className={labelClass}>Vincular ao Cliente</label>
            <select required className={inputClass} value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
              <option value="" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Selecione o cliente...</option>
              {state.clients.map(c => <option key={c.id} value={c.id} className={state.theme === 'light' ? '' : 'bg-slate-950 font-bold'}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Montante</label>
              <div className="relative">
                <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-[10px] ${state.theme === 'light' ? 'text-slate-400' : 'text-slate-700'}`}>R$</span>
                <input required className={`${inputClass} pl-12`} placeholder="0,00" value={formData.amount} onInput={(e) => e.currentTarget.value = maskCurrency(e.currentTarget.value)} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Data de Vencimento</label>
              <input required type="date" className={inputClass} value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Forma de Pagamento</label>
            <select required className={inputClass} value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
              <option value="PIX" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Pix</option>
              <option value="Boleto" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Boleto</option>
              <option value="Dinheiro" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Dinheiro</option>
              <option value="Transferência" className={state.theme === 'light' ? '' : 'bg-slate-950'}>Transferência</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-10 border border-white/10">
          CONSOLIDAR TÍTULO E IR PARA DASHBOARD
        </button>
      </form>
    </div>
  );
};

export default FormRecebivel;