
import React, { useState } from 'react';
import OracleIcon from './OracleIcon';
import { useApp } from '../contexts/AppContext';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: '',
    companyName: '',
    businessType: ''
  });
  const { completeOnboarding } = useApp();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const isStep2Valid = formData.userName.trim().length > 2 && formData.companyName.trim().length > 2;

  const handleFinish = () => {
    completeOnboarding(formData);
  };

  const buttonClass = "w-full py-5 bg-gradient-to-r from-[#07252d] to-[#10b981] border border-white/10 backdrop-blur-md shadow-lg shadow-emerald-500/5 hover:brightness-110 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-300 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2";

  return (
    <div className="fixed inset-0 z-[200] bg-[#071821] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 oracle-chip rounded-[2rem] flex items-center justify-center text-emerald-500 mb-8 shadow-2xl">
            <OracleIcon className="w-12 h-12 nexus-pulse" />
          </div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-emerald-500' : 'w-4 bg-white/10'}`}></div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[3rem] border-white/5 relative overflow-hidden">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight italic">
                  Bem-vindo ao <span className="text-emerald-500">NEXO.</span>
                </h1>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Vamos organizar seu dinheiro em menos de 1 minuto. Simples, rápido e sem complicações.
                </p>
              </div>
              <button 
                onClick={handleNext}
                className={buttonClass}
              >
                PROSSEGUIR
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-black text-white tracking-tight italic">Sobre seu Negócio</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Só precisamos saber quem você é</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Como devemos te chamar?</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Ex: João Silva"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-16"
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Qual é o nome do seu negócio?</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Loja do João"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-16"
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Tipo de negócio (opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Loja de roupas, mercado, oficina, salão de beleza"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-16"
                    value={formData.businessType}
                    onChange={e => setFormData({...formData, businessType: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-5 bg-white/5 text-slate-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Voltar</button>
                <button 
                  disabled={!isStep2Valid}
                  onClick={handleNext}
                  className={`${buttonClass} flex-[2] disabled:opacity-30 disabled:grayscale`}
                >
                  PROSSEGUIR
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6 border border-emerald-500/30">
                  <i className="fa-solid fa-check text-2xl"></i>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight italic">Tudo pronto, {formData.userName.split(' ')[0]}!</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  O NEXO está pronto para cuidar das contas da <span className="text-white font-bold">{formData.companyName}</span>. 
                  Comece adicionando seus clientes e o dinheiro que você tem para receber.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Negócio</span>
                    <span className="text-emerald-500">{formData.companyName}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Moeda</span>
                    <span className="text-white">Real (R$)</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Saldo Inicial</span>
                    <span className="text-rose-500">R$ 0,00</span>
                 </div>
              </div>

              <button 
                onClick={handleFinish}
                className={buttonClass}
              >
                COMEÇAR AGORA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
