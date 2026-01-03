
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
    <div className="fixed inset-0 z-[200] bg-[#020608] flex items-center justify-center p-6 overflow-hidden">
      {/* Glow de Fundo Cinemático */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent opacity-60"></div>
      
      <div className="max-w-xl w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-16 animate-in fade-in zoom-in duration-1000">
          <div className="relative group mb-12">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full opacity-50"></div>
            <BrandLogo className="w-32 h-32 md:w-40 md:h-40" showText={true} centered={true} />
          </div>
          
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 transition-all duration-700 rounded-full ${step >= s ? 'w-12 bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'w-4 bg-white/5'}`}></div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10 md:p-14 rounded-[3.5rem] border-white/[0.03] relative overflow-hidden bg-black/60 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-4 text-center">
                <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
                  Bem-vindo ao centro de comando de seu capital. Prepare-se para a gestão definitiva.
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
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">Configurando Acesso Seguro</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Identidade do Gestor</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Seu Nome Completo"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 h-16 transition-all"
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Razão Social da Unidade</label>
                  <input 
                    type="text" 
                    placeholder="Nome da sua Empresa"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 h-16 transition-all"
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleBack} className="flex-1 py-5 bg-white/[0.01] border border-white/5 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">Voltar</button>
                <button 
                  disabled={!isStep2Valid}
                  onClick={handleNext}
                  className={`${buttonClass} flex-[2] disabled:opacity-20`}
                >
                  CONSOLIDAR
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="space-y-8">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-500 mb-6 border border-emerald-500/20 shadow-2xl animate-pulse relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
                  <i className="fa-solid fa-check text-3xl relative z-10"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Protocolo Ativo.</h2>
                  <p className="text-slate-500 leading-relaxed font-medium text-sm italic mt-4 max-w-xs mx-auto">
                    Terminal configurado com sucesso para <br/><span className="text-emerald-500 font-bold">{formData.companyName}</span>.
                  </p>
                </div>
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
        
        <div className="mt-16 text-center opacity-30">
           <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.8em]">NEXO SYSTEM PLATFORM — © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
