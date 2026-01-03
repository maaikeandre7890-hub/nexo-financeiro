
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  onClose?: () => void;
}

const LogoMillionDollar = () => (
  <div className="relative group flex items-center justify-center w-16 h-16">
    {/* Profundidade e Brilho de Fundo (Backlight) */}
    <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] rounded-full scale-150 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
    
    <svg width="60" height="60" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
      {/* Camada 1: Estrutura Base (Obsidiana) */}
      <path d="M60 15L100 40V80L60 105L20 80V40L60 15Z" fill="#050505" stroke="url(#border_luxury)" strokeWidth="0.5" />
      
      {/* Camada 2: O Nexus "N" em Cristal Líquido */}
      <path d="M42 42V78L60 60L78 78V42" stroke="url(#emerald_gradient_pro)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="filter-gpu">
        <animate attributeName="stroke-dasharray" from="0 400" to="400 400" dur="2s" fill="freeze" />
      </path>

      {/* Camada 3: Reflexos de Luz Especular */}
      <path d="M45 45L60 55L75 45" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M25 45L60 25L95 45" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />

      {/* Camada 4: O Core Pulsante (Sinal de Atividade) */}
      <circle cx="60" cy="60" r="3" fill="#10b981">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
        <animate attributeName="r" values="2.5;3.5;2.5" dur="4s" repeatCount="indefinite" />
      </circle>

      <defs>
        <linearGradient id="emerald_gradient_pro" x1="42" y1="42" x2="78" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="border_luxury" x1="20" y1="15" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const Sidebar: React.FC<Props> = ({ onClose }) => {
  const sections = [
    { title: 'Core Business', items: NAVIGATION.slice(0, 4) },
    { title: 'Intelligence', items: NAVIGATION.slice(4, 8) },
    { title: 'Executive', items: NAVIGATION.slice(8) },
  ];

  return (
    <aside className="w-full md:w-72 bg-black flex flex-col h-full z-20 relative border-r border-white/[0.04] shadow-[40px_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* Textura de Ruído Luxo na Sidebar */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Brand Identity - Alinhamento Matemático */}
      <div className="pt-16 pb-12 px-10 flex flex-col items-start relative z-10">
        <LogoMillionDollar />
        <div className="mt-8 flex flex-col items-start w-full">
          <h1 className="text-4xl font-black tracking-[-0.08em] text-white leading-none">
            NEXO
          </h1>
          {/* Hairline Divider com Animação */}
          <div className="h-[0.5px] w-[88px] bg-gradient-to-r from-emerald-500/60 to-transparent mt-3 mb-2 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/40 w-1/2 -skew-x-12 animate-[shimmer_3s_infinite]"></div>
          </div>
          <span className="text-[7.5px] font-bold text-emerald-500/80 uppercase tracking-[0.52em] leading-none block whitespace-nowrap">
            Inteligência Financeira
          </span>
        </div>
        
        <button onClick={onClose} className="md:hidden absolute top-12 right-6 text-zinc-600 p-2 hover:text-white transition-colors">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
      </div>

      {/* Swiss Layout Navigation */}
      <nav className="flex-1 px-4 space-y-12 overflow-y-auto custom-scrollbar relative z-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="px-8 text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] mb-4">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-5 px-8 py-3.5 rounded-xl transition-all duration-700 group relative overflow-hidden ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.01]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <>
                          <div className="absolute left-0 w-[2px] h-6 bg-emerald-500 rounded-r-full shadow-[0_0_20px_#10b981]"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent opacity-100"></div>
                        </>
                      )}
                      <div className={`w-5 flex justify-center transition-all duration-500 ${isActive ? 'text-emerald-500 scale-125' : 'group-hover:text-emerald-400 group-hover:scale-110'}`}>
                        <i className={`fa-solid ${item.icon} text-[14px]`}></i>
                      </div>
                      <span className={`text-[12px] font-bold tracking-tight transition-all duration-500 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-0.5'}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Executive Footer Profile */}
      <div className="p-10 mt-auto border-t border-white/[0.02] bg-black relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-800 p-[0.5px] group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-700">
               <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-zinc-600 group-hover:text-white font-black text-[10px] transition-colors">AD</div>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-black text-white truncate tracking-tight">Drex Financial</p>
            <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest truncate">Plano Institucional</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
