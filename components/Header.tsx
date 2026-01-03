
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-14 px-8 flex items-center justify-between sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/[0.02]">
      <div className="flex items-center gap-6">
        <button onClick={onToggleSidebar} className="md:hidden text-zinc-500"><i className="fa-solid fa-bars"></i></button>
        <div onClick={onOpenSearch} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-white/5 cursor-pointer group hover:border-emerald-500/20 transition-all">
          <i className="fa-solid fa-magnifying-glass text-[10px] text-zinc-600"></i>
          <span className="text-[11px] font-medium text-zinc-600">Comandos...</span>
          <kbd className="text-[8px] font-bold text-zinc-800 bg-zinc-950 px-1 rounded border border-white/5 ml-4">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onOpenAI} 
          className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-all"
        >
          <i className="fa-solid fa-sparkles"></i>
          AI Brain
        </button>

        <div className="w-[1px] h-4 bg-white/10"></div>

        <button onClick={onOpenNotifications} className="text-zinc-600 hover:text-white transition-colors relative">
          <i className="fa-solid fa-bell text-sm"></i>
          <span className="absolute -top-1 -right-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-emerald-500">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
