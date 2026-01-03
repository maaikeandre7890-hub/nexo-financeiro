
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

  const buttonClass = "w-full py-6 bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98] transition-all duration-500 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]";

  return (
    <div className="fixed inset-0 z-[200] bg-[#020a0d] flex items-center justify-center p-6 overflow-hidden">
      {/* Glow de Fundo Estilo "Theater" */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 to-transparent opacity-40"></div>
      
      <div className="max-w-xl w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-20 animate-in fade-in zoom-in duration-1000">
          {/* Logo Cinematic em destaque */}
          <div className="relative group mb-16">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full opacity-50 group-hover:opacity-100 transition-all duration-1000"></div>
            <BrandLogo className="w-32 h-32 relative z-10" />
          </div>
          
          <div className="flex gap-1 mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-0.5 transition-all duration-1000 ${step >= s ? 'w-16 bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'w-4 bg-white/5'}`}></div>
            ))}
          </div>
        </div>

        <div className="glass-card p-12 md:p-16 rounded-[4rem] border-white/5 relative overflow-hidden bg-black/40 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="space-y-6 text-center">
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] italic uppercase">
                  NEXO<span className="text-emerald-500">.</span>
                </h1>
                <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs md:text-sm italic max-w-xs mx-auto border-l border-emerald-500/20 pl-4">
                  Gestão financeira
                </p>
              </div>
              <button 
                onClick={handleNext}
                className={buttonClass}
              >
                ATIVAR TERMINAL
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 text-center border-b border-white/5 pb-8">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Autenticação</h2>
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">Definindo Identidade Operacional</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Comandante</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Nome Completo"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 h-16 transition-all"
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Razão Social</label>
                  <input 
                    type="text" 
                    placeholder="Sua Empresa"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 h-16 transition-all"
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleBack} className="flex-1 py-5 bg-white/[0.02] border border-white/5 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Voltar</button>
                <button 
                  disabled={!isStep2Valid}
                  onClick={handleNext}
                  className={`${buttonClass} flex-[2] disabled:opacity-20`}
                >
                  AUTENTICAR
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 mb-6 border border-emerald-500/20 shadow-2xl animate-pulse">
                  <i className="fa-solid fa-play text-2xl ml-1"></i>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none">Acesso<br/><span className="text-emerald-500">Garantido.</span></h2>
                <p className="text-slate-500 leading-relaxed font-medium text-sm italic max-w-xs mx-auto">
                  Tudo pronto para a <span className="text-white font-bold">{formData.companyName}</span> decolar.
                </p>
              </div>

              <button 
                onClick={handleFinish}
                className={buttonClass}
              >
                ASSUMIR COMANDO
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center opacity-30">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[1em]">NEXO SYSTEM PLATFORM — 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
