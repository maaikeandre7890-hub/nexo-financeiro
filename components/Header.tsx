
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-16 px-8 flex items-center justify-between sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.03]">
      <div className="flex items-center gap-8">
        <button onClick={onToggleSidebar} className="md:hidden text-zinc-500 hover:text-white transition-colors"><i className="fa-solid fa-bars"></i></button>
        
        <div onClick={onOpenSearch} className="group hidden sm:flex items-center gap-3 px-4 py-2 bg-zinc-900/40 border border-white/[0.03] rounded-lg hover:border-emerald-500/30 transition-all w-[300px] cursor-pointer">
          <i className="fa-solid fa-magnifying-glass text-[10px] text-zinc-600 group-hover:text-emerald-500"></i>
          <span className="text-[11px] font-medium text-zinc-600">Buscar comando...</span>
          <kbd className="ml-auto text-[9px] font-bold text-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={onOpenAI} className="h-9 px-4 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2">
          <i className="fa-solid fa-brain-circuit"></i>
          Brain
        </button>

        <div className="flex items-center gap-4">
          <button onClick={onOpenNotifications} className="relative p-2 text-zinc-600 hover:text-white transition-colors">
            <i className="fa-solid fa-bell"></i>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          </button>
          
          <div className="w-[1px] h-6 bg-white/5"></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=18181b&color=10b981&bold=true" alt="User" />
            </div>
            <div className="hidden lg:block">
              <p className="text-[11px] font-bold text-white leading-none">Admin Node</p>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Sessão Ativa</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
