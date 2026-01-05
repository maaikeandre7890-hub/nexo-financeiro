
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

  const inputClass = "w-full bg-[#141414] border border-white/[0.06] rounded-xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:border-white/20 focus:bg-[#1A1A1A] transition-all duration-300 placeholder:text-zinc-700";
  const labelClass = "text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-3 block ml-1";
  const primaryButtonClass = "w-full py-5 bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-500 rounded-xl font-bold uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(255,255,255,0.1)]";

  return (
    <div className="fixed inset-0 z-[200] bg-[#000000] flex flex-col md:flex-row overflow-hidden font-['Space_Grotesk']">
      
      {/* TEXTURA DE RUÍDO GLOBAL (O toque de $1M) */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[50]"></div>

      {/* COLUNA ESQUERDA: LOGIN (40%) */}
      <div className="w-full md:w-[40%] h-full flex items-center justify-center p-6 md:p-12 z-20 relative bg-[#000000]">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          
          {/* Card Flutuante Premium */}
          <div className="bg-[#0A0A0A] p-10 md:py-16 md:px-14 rounded-[3rem] border border-white/[0.04] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] space-y-12 relative">
            
            {/* Header Brand */}
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <BrandLogo className="w-10 h-10" />
                <div className="text-[10px] font-bold text-zinc-800 uppercase tracking-[0.3em]">Secure Access</div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-white tracking-tighter">
                  {step === 1 ? 'Bem-vindo' : step === 2 ? 'Identificação' : 'Acesso Liberto'}
                </h1>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-[300px]">
                  {step === 1 && 'Entre com suas credenciais para gerenciar sua operação.'}
                  {step === 2 && 'Valide sua unidade de negócio para prosseguir.'}
                  {step === 3 && 'Protocolo de segurança validado com sucesso.'}
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-8">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>E-mail</label>
                      <input type="email" placeholder="nome@empresa.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Senha</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>
                  
                  <button onClick={handleNext} className={primaryButtonClass}>
                    ENTRAR NA PLATAFORMA <i className="fa-solid fa-arrow-right-long ml-2 opacity-50"></i>
                  </button>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Recuperar acesso</span>
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Criar conta</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in duration-700">
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
                        placeholder="Nome da Empresa"
                        className={inputClass}
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button onClick={handleBack} className="flex-1 py-5 border border-white/[0.05] text-zinc-600 rounded-xl font-bold text-[10px] uppercase hover:text-white transition-all">
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
                <div className="space-y-12 text-center animate-in zoom-in-95 duration-700 py-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_60px_rgba(255,255,255,0.15)] relative overflow-hidden">
                    <i className="fa-solid fa-check text-4xl relative z-10"></i>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-2xl tracking-tight">{formData.companyName}</p>
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.5em]">Ambiente Criptografado</p>
                  </div>
                  <button onClick={handleFinish} className={primaryButtonClass}>
                    ENTRAR NO DASHBOARD
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.8em]">
              NEXO TERMINAL — 2025
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: BRANDING (60%) */}
      <div className="hidden md:flex flex-1 bg-[#000000] relative items-center justify-start pl-32 overflow-hidden border-l border-white/[0.03]">
        
        {/* LUZES VOLUMÉTRICAS (Atmosfera Premium) */}
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[#ff0055] opacity-[0.07] rounded-full blur-[250px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-[#7000ff] opacity-[0.06] rounded-full blur-[220px] delay-1000 animate-pulse"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-white opacity-[0.02] rounded-full blur-[180px]"></div>
        
        {/* HEADLINE EDITORIAL (Alinhada à Esquerda) */}
        <div className="relative z-10 space-y-10 max-w-5xl">
          <div className="space-y-0 text-left">
            <h2 className="text-8xl lg:text-[160px] font-bold text-white tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Decisões claras.
            </h2>
            <h2 className="text-7xl lg:text-[120px] font-light text-white/50 tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              Resultados reais.
            </h2>
          </div>
          
          <div className="pt-16 animate-in fade-in duration-1000 delay-700 flex items-center gap-12">
             <div className="w-24 h-[1px] bg-white/10"></div>
             <p className="text-[12px] font-bold text-zinc-600 uppercase tracking-[0.9em] whitespace-nowrap">
               The intelligence behind your capital
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
