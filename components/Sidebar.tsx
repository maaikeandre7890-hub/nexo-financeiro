
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  onClose?: () => void;
}

const LogoMark = () => (
  <div className="relative group">
    {/* Aura de fundo - Brilho de profundidade */}
    <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* O Prisma - SVG de Alta Precisão */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {/* Face Principal */}
        <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
        
        {/* Elemento de Conexão Superior */}
        <path d="M16 6L26 11V21L16 16V6Z" fill="url(#prism-grad-1)" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        
        {/* Elemento de Conexão Inferior */}
        <path d="M16 26L6 21V11L16 16V26Z" fill="url(#prism-grad-2)" fillOpacity="0.6" />
        
        <defs>
          <linearGradient id="prism-grad-1" x1="16" y1="6" x2="26" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="prism-grad-2" x1="16" y1="26" x2="6" y2="11" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Frame de Vidro Externo */}
      <div className="absolute inset-0 border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
    </div>
  </div>
);

const Sidebar: React.FC<Props> = ({ onClose }) => {
  return (
    <aside className="w-72 bg-[var(--surface-glass)] backdrop-blur-3xl border-r border-white/[0.03] flex flex-col h-full z-20 relative overflow-hidden">
      {/* Ruído e Gradiente de Fundo sutil */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="p-10 pb-12 flex items-center gap-5 relative z-10">
        <LogoMark />
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <h1 className="text-2xl font-black tracking-[-0.08em] text-white italic">
              NEXO
            </h1>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1 mb-1 shadow-[0_0_10px_#10b981]"></span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-500 mt-1 leading-none">
            Systems
          </p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto mt-2 relative z-10 custom-scrollbar">
        <div className="px-4 py-2">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Core Infrastructure</p>
        </div>
        
        {NAVIGATION.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-500 group relative ${
                isActive
                  ? 'bg-emerald-500/[0.04] text-white border border-emerald-500/10'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Indicador Ativo Minimalista */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-4 bg-emerald-500 rounded-full -translate-x-1.5 shadow-[0_0_15px_#10b981]" />
                )}
                
                <div className={`w-5 flex justify-center transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-700 group-hover:text-slate-400'}`}>
                  <i className={`fa-solid ${item.icon} text-[11px]`}></i>
                </div>
                
                <span className={`text-[12px] font-bold tracking-tight transition-all ${isActive ? 'translate-x-1' : ''}`}>
                  {item.label}
                </span>

                {/* Efeito de hover sutil */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 relative z-10">
        <div className="p-5 rounded-3xl bg-black/40 border border-white/[0.03] relative group overflow-hidden">
          {/* Animação de Varredura de Segurança */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.02] to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-10 h-10 rounded-2xl bg-[#0a0f1e] border border-white/10 flex items-center justify-center shadow-2xl">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
             </div>
             <div>
                <p className="text-[9px] font-black text-white uppercase tracking-widest italic leading-none">Security Node</p>
                <p className="text-[8px] text-emerald-500/60 font-black uppercase mt-1.5 tracking-tighter">
                  Encrypted & Verified
                </p>
             </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
