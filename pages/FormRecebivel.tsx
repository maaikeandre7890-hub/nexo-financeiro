
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const FormRecebivel: React.FC = () => {
  const { state, addReceivable, formatNumber } = useApp();
  const navigate = useNavigate();
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
    navigate('/recebiveis');
  };

  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 block ml-1";
  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl py-4 px-5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500/50 transition-all";

  return (
    <div className="space-y-12 py-6 max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Novo Lançamento</h1>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Fluxo de Entrada</p>
        </div>
        <button 
          onClick={() => navigate('/recebiveis')}
          className="px-6 py-3 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-all"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
        <div className="space-y-8">
          <div>
            <label className={labelClass}>Vincular ao Cliente</label>
            <select required className={inputClass} value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
              <option value="" className="bg-slate-950">Selecione na base de dados...</option>
              {state.clients.map(c => <option key={c.id} value={c.id} className="bg-slate-950 font-bold">{c.name}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-2xl transition-all shadow-2xl hover:bg-emerald-400 active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] mt-10 border border-white/10">
          CONSOLIDAR TÍTULO FINANCEIRO
        </button>
      </form>
    </div>
  );
};

export default FormRecebivel;
