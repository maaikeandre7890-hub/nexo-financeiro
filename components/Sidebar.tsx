
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  onClose?: () => void;
}

const LogoMillionDollar = () => (
  <div className="relative group flex items-center justify-center w-14 h-14">
    <div className="absolute inset-0 bg-emerald-500/10 blur-[30px] rounded-full scale-125 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
    
    <svg width="48" height="48" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <path d="M60 15L100 40V80L60 105L20 80V40L60 15Z" fill="#07131A" stroke="url(#border_luxury)" strokeWidth="0.8" />
      <path d="M42 42V78L60 60L78 78V42" stroke="url(#emerald_gradient_pro)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="60" r="3" fill="#10b981">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <defs>
        <linearGradient id="emerald_gradient_pro" x1="42" y1="42" x2="78" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="border_luxury" x1="20" y1="15" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.3" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const Sidebar: React.FC<Props> = ({ onClose }) => {
  const sections = [
    { title: 'Gestão Core', items: NAVIGATION.slice(0, 4) },
    { title: 'Estratégico', items: NAVIGATION.slice(4, 8) },
    { title: 'Sistema', items: NAVIGATION.slice(8) },
  ];

  return (
    <aside className="w-full md:w-72 bg-[#07131A] flex flex-col h-full z-20 relative border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="pt-12 pb-10 px-8 flex flex-col items-start relative z-10">
        <div className="flex flex-col items-start w-full group">
          <LogoMillionDollar />
          <div className="mt-6 flex flex-col items-start w-full">
            <h1 className="text-3xl font-black tracking-[-0.06em] text-white leading-none">
              NEXO
            </h1>
            <div className="h-[1px] w-[60px] bg-emerald-500/40 mt-3 mb-2"></div>
            <span className="text-[7px] font-bold text-emerald-500/70 uppercase tracking-[0.45em] leading-none block whitespace-nowrap">
              Inteligência Financeira
            </span>
          </div>
        </div>
        
        <button onClick={onClose} className="md:hidden absolute top-10 right-6 text-slate-500 p-2 hover:text-white transition-colors">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar relative z-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-6 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 group relative ${
                      isActive
                        ? 'text-white bg-white/[0.04]'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 w-[3px] h-4 bg-emerald-500 rounded-r-full shadow-[0_0_10px_#10b981]"></div>
                      )}
                      <div className={`w-5 flex justify-center transition-all duration-300 ${isActive ? 'text-emerald-500' : 'group-hover:text-emerald-400'}`}>
                        <i className={`fa-solid ${item.icon} text-[13px]`}></i>
                      </div>
                      <span className={`text-[12px] font-semibold tracking-tight ${isActive ? 'translate-x-0.5' : ''}`}>
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

      <div className="p-8 mt-auto border-t border-white/5 bg-[#050D12] relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all font-black text-[9px]">
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[11px] font-bold text-white truncate tracking-tight">Drex Financial</p>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest truncate">Corporate Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
