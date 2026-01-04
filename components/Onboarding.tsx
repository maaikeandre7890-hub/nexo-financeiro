
import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { useApp } from '../contexts/AppContext';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: '',
    companyName: '',
    businessType: 'SaaS / B2B'
  });
  const { completeOnboarding } = useApp();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const isStep2Valid = formData.userName.trim().length > 2 && formData.companyName.trim().length > 2;

  const handleFinish = () => {
    completeOnboarding(formData);
  };

  const inputClass = "w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-4 py-4 text-sm font-medium text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600";
  const labelClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block";
  const primaryButtonClass = "w-full py-4 bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-300 rounded-lg font-bold uppercase tracking-widest text-[11px] shadow-xl";

  return (
    <div className="fixed inset-0 z-[200] bg-[#000000] flex flex-col md:flex-row overflow-hidden font-['Space_Grotesk']">
      
      {/* COLUNA ESQUERDA: LOGIN / FORM */}
      <div className="w-full md:w-[45%] lg:w-[40%] h-full flex items-center justify-center p-8 md:p-12 lg:p-20 z-10 relative bg-[#000000]">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
          
          {/* Header do Form */}
          <div className="space-y-6">
            <BrandLogo className="w-12 h-12" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {step === 1 ? 'Bem-vindo ao NEXO' : step === 2 ? 'Acesse sua conta' : 'Tudo pronto'}
              </h1>
              <p className="text-sm text-zinc-500 font-medium">
                {step === 1 && 'Sua inteligência de capital centralizada em um único terminal.'}
                {step === 2 && 'Preencha os dados da sua unidade para prosseguir.'}
                {step === 3 && 'Protocolo de segurança e acesso confirmado.'}
              </p>
            </div>
          </div>

          {/* Card do Formulário */}
          <div className="bg-[#111111] p-8 rounded-2xl border border-white/5 shadow-2xl space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <p className="text-[10px] leading-relaxed text-emerald-400 font-medium italic">
                    "O NEXO redefine a gestão financeira para líderes que buscam clareza absoluta e resultados reais."
                  </p>
                </div>
                <button onClick={handleNext} className={primaryButtonClass}>
                  INICIAR SESSÃO
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nome do Gestor</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Seu nome"
                      className={inputClass}
                      value={formData.userName}
                      onChange={e => setFormData({...formData, userName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Unidade / Empresa</label>
                    <input 
                      type="text" 
                      placeholder="Nome da empresa"
                      className={inputClass}
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 py-4 bg-transparent border border-white/5 text-zinc-500 rounded-lg font-bold text-[10px] uppercase hover:text-white transition-all">
                    Voltar
                  </button>
                  <button 
                    disabled={!isStep2Valid}
                    onClick={handleNext}
                    className={`${primaryButtonClass} flex-[2] disabled:opacity-20`}
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <i className="fa-solid fa-check text-xl"></i>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold text-lg">{formData.companyName}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Acesso Autorizado</p>
                </div>
                <button onClick={handleFinish} className={primaryButtonClass}>
                  ENTRAR NO DASHBOARD
                </button>
              </div>
            )}
          </div>

          {/* Footer discreto */}
          <div className="pt-4">
            <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.4em]">
              NEXO SYSTEM PLATFORM — © 2025
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: BRANDING / GRADIENT */}
      <div className="hidden md:flex flex-1 bg-[#000000] relative items-center justify-center overflow-hidden">
        
        {/* Gradientes Abstratos Desfocados */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-pink-600/20 rounded-full blur-[100px] delay-700 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-magenta-600/10 rounded-full blur-[150px]"></div>
        
        {/* Headline Branding */}
        <div className="relative z-10 text-center space-y-4 px-12">
          <div className="space-y-0">
            <h2 className="text-6xl lg:text-8xl font-medium text-white tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Decisões claras.
            </h2>
            <h2 className="text-6xl lg:text-8xl font-medium text-white/40 tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Resultados reais.
            </h2>
          </div>
          <div className="pt-8 animate-in fade-in duration-1000 delay-500">
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.6em]">
               The intelligence behind your capital
             </p>
          </div>
        </div>

        {/* Textura de ruído sutil */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>
    </div>
  );
};

export default Onboarding;
