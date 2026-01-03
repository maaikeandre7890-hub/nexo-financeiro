
import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
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
          {/* Logo Premium "The Infinite Link" */}
          <div className="w-28 h-28 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/[0.03] blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <BrandLogo className="w-16 h-16 relative z-10" />
          </div>
          
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-10 bg-emerald-500' : 'w-4 bg-white/10'}`}></div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 md:p-14 rounded-[4rem] border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.9] italic">
                  Controle <br/><span className="text-emerald-500 underline decoration-white/10 underline-offset-8">Absoluto.</span>
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base italic">
                  Bem-vindo à nova era da gestão financeira. O NEXO organiza seu capital com clareza matemática e design de elite.
                </p>
              </div>
              <button 
                onClick={handleNext}
                className={buttonClass}
              >
                CONFIGURAR AMBIENTE
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center md:text-left border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black text-white tracking-tight italic">Identidade de Gestão</h2>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Dados do Proprietário e Negócio</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seu Nome Completo</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Ex: João Silva"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-16"
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Empresa ou Razão Social</label>
                  <input 
                    type="text" 
                    placeholder="Ex: NEXO Capital Ltda"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-16"
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Setor de Atuação</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Consultoria, Varejo, Tecnologia"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/40 transition-all h-16"
                    value={formData.businessType}
                    onChange={e => setFormData({...formData, businessType: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleBack} className="flex-1 py-5 bg-white/[0.02] border border-white/5 text-slate-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Voltar</button>
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
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 mb-8 border border-emerald-500/20 shadow-2xl">
                  <i className="fa-solid fa-bolt-lightning text-2xl"></i>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter italic leading-none">Acesso Autorizado, <br/>{formData.userName.split(' ')[0]}<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-500 leading-relaxed font-medium text-sm italic">
                  O ecossistema da <span className="text-white font-bold">{formData.companyName}</span> foi provisionado e está pronto para o seu comando.
                </p>
              </div>

              <div className="bg-slate-950/40 border border-white/5 rounded-[2rem] p-8 space-y-4 shadow-inner">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-slate-600">Ambiente</span>
                    <span className="text-emerald-500">PRODUÇÃO</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-slate-600">Criptografia</span>
                    <span className="text-white">AES-256</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-slate-600">Base Fiscal</span>
                    <span className="text-white">BRL (R$)</span>
                 </div>
              </div>

              <button 
                onClick={handleFinish}
                className={buttonClass}
              >
                ENTRAR NO TERMINAL
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.6em]">NEXO INTELLIGENCE SYSTEMS — ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
