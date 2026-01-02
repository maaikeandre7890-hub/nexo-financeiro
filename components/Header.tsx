
import React from 'react';

interface Props {
  onOpenNotifications: () => void;
  onOpenAI: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ onOpenNotifications, onOpenAI, onOpenSearch, onToggleSidebar }) => {
  return (
    <header className="h-20 px-10 md:px-14 flex items-center justify-between sticky top-0 z-40 bg-[#02040a]/50 backdrop-blur-2xl border-b border-white/[0.03]">
      <div className="flex items-center gap-10">
        <button onClick={onToggleSidebar} className="md:hidden text-slate-500 hover:text-white"><i className="fa-solid fa-bars"></i></button>
        
        <div onClick={onOpenSearch} className="group relative cursor-pointer hidden sm:flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] px-5 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all w-[320px]">
          <i className="fa-solid fa-search text-[10px] text-slate-600 group-hover:text-emerald-500 transition-colors"></i>
          <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-400">Search intelligence...</span>
          <kbd className="ml-auto text-[9px] font-black text-slate-700 border border-slate-800 px-1.5 py-0.5 rounded-md">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button onClick={onOpenAI} className="px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-3">
          <i className="fa-solid fa-sparkles text-[8px]"></i>
          Brain Sync
        </button>

        <div className="flex items-center gap-6">
          <button onClick={onOpenNotifications} className="relative p-2 text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-bell-on"></i>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#02040a]"></span>
          </button>
          
          <div className="w-[1px] h-8 bg-white/5"></div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden relative shadow-2xl">
              <img src="https://ui-avatars.com/api/?name=Director&background=0a0f1e&color=10b981&bold=true" alt="User" />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-black text-white leading-none tracking-tight">Admin Executivo</p>
              <p className="label-pro !text-[8px] opacity-40 mt-1">NODE_001_ACTIVE</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
