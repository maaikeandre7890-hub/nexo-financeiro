
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CommandBar: React.FC<Props> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = NAVIGATION.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-4">
          <i className="fa-solid fa-magnifying-glass text-emerald-500 text-xl"></i>
          <input
            autoFocus
            type="text"
            placeholder="O que você deseja buscar? (ex: 'Clientes', 'Notas'...)"
            className="bg-transparent border-none text-white text-lg w-full focus:outline-none placeholder:text-slate-600 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:block px-2 py-1 bg-slate-800 rounded-md text-[10px] text-slate-500 font-black border border-slate-700 uppercase">ESC</kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Navegação Direta</p>
          {filteredItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); onClose(); }}
              className="w-full flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-emerald-500/10 group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <span className="text-white font-bold tracking-tight">{item.label}</span>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"></i>
            </button>
          ))}
          
          <div className="h-4"></div>
          <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Atalhos Rápidos</p>
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-blue-500/10 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-500">
              <i className="fa-solid fa-plus"></i>
            </div>
            <span className="text-white font-bold tracking-tight">Novo Recebível Manual</span>
          </button>
        </div>

        <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-between items-center">
          <div className="flex gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span>↑↓ para navegar</span>
            <span>ENTER para selecionar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
