
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import BrandLogo from './BrandLogo';
import { useApp } from '../contexts/AppContext';

interface Props {
  onClose?: () => void;
}

const NewNexoLogo = () => (
  <div className="relative group flex items-center gap-4">
    <div className="absolute -left-2 top-0 w-16 h-16 bg-emerald-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    <div className="relative z-10 w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:border-emerald-500/20 group-hover:bg-white/[0.05]">
      <BrandLogo className="w-9 h-9" />
    </div>
    <div className="flex flex-col">
      <h1 className="text-2xl font-black tracking-[-0.04em] text-white leading-none group-hover:text-emerald-500 transition-colors duration-500">
        NEXO<span className="text-emerald-500 group-hover:text-white transition-colors">.</span>
      </h1>
      <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1.5 transition-all duration-500 group-hover:text-emerald-500/50">
        Gestão de Contas
      </span>
    </div>
  </div>
);

const Sidebar: React.FC<Props> = ({ onClose }) => {
  const { state } = useApp();
  const sections = [
    { title: 'Dia a Dia', items: NAVIGATION.slice(0, 5) },
    { title: 'Relatórios', items: NAVIGATION.slice(5, 9) },
    { title: 'Ajustes', items: NAVIGATION.slice(9) },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="w-full md:w-72 bg-[#051118] flex flex-col h-full z-20 relative border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="pt-12 pb-10 px-8 relative z-10">
        <NewNexoLogo />
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

      <div className="p-8 mt-auto border-t border-white/5 bg-[#030a0e] relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all font-black text-[9px]">
            {getInitials(state.userName || 'AD')}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[11px] font-bold text-white truncate tracking-tight">{state.companyName || 'Meu Negócio'}</p>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest truncate">{state.businessType || 'Dono do Negócio'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
