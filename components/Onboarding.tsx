
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

  const inputClass = "w-full bg-[#111111] border border-white/[0.04] rounded-xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:border-white/10 transition-all duration-300 placeholder:text-zinc-800";
  const labelClass = "text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 block ml-1";
  const primaryButtonClass = "w-full py-5.5 bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-500 rounded-xl font-bold uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(255,255,255,0.08)]";

  return (
    <div className="fixed inset-0 z-[200] bg-[#000000] flex flex-col md:flex-row overflow-hidden font-['Space_Grotesk']">
      
      {/* TEXTURA DE RUÍDO GLOBAL */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[50]"></div>

      {/* COLUNA ESQUERDA: LOGIN (40%) */}
      <div className="w-full md:w-[40%] h-full flex items-center justify-center p-6 md:p-8 z-20 relative bg-[#000000]">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
          
          {/* Card de Login - Aumentado em altura e padding */}
          <div className="bg-[#050505] py-16 px-10 md:py-24 md:px-14 rounded-[2.5rem] border border-white/[0.04] shadow-[0_100px_150px_-50px_rgba(0,0,0,1)] space-y-14 relative flex flex-col min-h-[580px] justify-center">
            
            {/* Header Brand */}
            <div className="space-y-12 text-center md:text-left">
              <div className="flex justify-between items-center mb-4">
                <BrandLogo className="w-9 h-9" />
                <div className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">Auth Protocol</div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">
                  {step === 1 ? 'Bem-vindo ao NEXO' : step === 2 ? 'Identificação' : 'Acesso Liberto'}
                </h1>
                <p className="text-xs text-zinc-500 font-medium leading-[1.8] max-w-[280px] mx-auto md:mx-0">
                  {step === 1 && 'Gerencie sua operação com inteligência e precisão estratégica.'}
                  {step === 2 && 'Valide sua unidade de negócio para prosseguir com segurança.'}
                  {step === 3 && 'Protocolo de segurança validado com sucesso. Pronto para iniciar.'}
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-8 flex-1 flex flex-col justify-center">
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in duration-700">
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Acesso</label>
                      <input type="email" placeholder="nome@empresa.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Chave</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>
                  
                  <button onClick={handleNext} className={primaryButtonClass}>
                    INICIAR SESSÃO <i className="fa-solid fa-arrow-right-long ml-2 opacity-40"></i>
                  </button>

                  <div className="flex justify-center md:justify-between items-center pt-2 gap-8">
                    <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Esqueci a senha</span>
                    <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Nova conta</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-in fade-in duration-700">
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Gestor Responsável</label>
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Nome completo"
                        className={inputClass}
                        value={formData.userName}
                        onChange={e => setFormData({...formData, userName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Organização</label>
                      <input 
                        type="text" 
                        placeholder="Empresa"
                        className={inputClass}
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button onClick={handleBack} className="flex-1 py-5.5 border border-white/[0.04] text-zinc-600 rounded-xl font-bold text-[10px] uppercase hover:text-white transition-all">
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
                <div className="space-y-14 text-center animate-in zoom-in-95 duration-700 py-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_60px_rgba(255,255,255,0.1)] relative">
                    <i className="fa-solid fa-check text-3xl"></i>
                  </div>
                  <div className="space-y-3">
                    <p className="text-white font-bold text-2xl tracking-tight">{formData.companyName}</p>
                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em]">Terminal Validado</p>
                  </div>
                  <button onClick={handleFinish} className={primaryButtonClass}>
                    ACESSAR DASHBOARD
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center opacity-20">
            <p className="text-[8px] font-black text-white uppercase tracking-[1em]">
              NEXO — INTELLIGENCE UNIT
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: BRANDING (60%) */}
      <div className="hidden md:flex flex-1 bg-[#000000] relative items-center justify-start pl-32 overflow-hidden border-l border-white/[0.02]">
        
        {/* GRADIENTE ATMOSFÉRICO (DESLOCADO DO CENTRO) */}
        <div className="absolute top-[10%] right-[-15%] w-[900px] h-[900px] bg-[#7000ff] opacity-[0.06] rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-[#ff0055] opacity-[0.05] rounded-full blur-[180px] delay-1000 animate-pulse"></div>
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-white opacity-[0.015] rounded-full blur-[150px]"></div>
        
        {/* HEADLINE EDITORIAL */}
        <div className="relative z-10 space-y-4 max-w-5xl">
          <div className="space-y-0 text-left">
            <h2 className="text-[100px] lg:text-[140px] font-semibold text-[#FFFFFF] tracking-tighter leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Decisões claras.
            </h2>
            <h2 className="text-[85px] lg:text-[115px] font-normal text-white/60 tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              Resultados reais.
            </h2>
          </div>
          
          <div className="pt-12 animate-in fade-in duration-1000 delay-700 flex items-center gap-10 opacity-30">
             <div className="w-16 h-[1px] bg-white/40"></div>
             <p className="text-[10px] font-bold text-white uppercase tracking-[0.8em] whitespace-nowrap">
               INTELLIGENCE BEHIND CAPITAL
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
