
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import CommandBar from './components/CommandBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Recebiveis from './pages/Recebiveis';
import Atraso from './pages/Atraso';
import Historico from './pages/Historico';
import Relatorios from './pages/Relatorios';
import FaturamentoLiquido from './pages/FaturamentoLiquido';
import DespesasExtras from './pages/DespesasExtras';
import Cobranca from './pages/Cobranca';
import Sistema from './pages/Sistema';
import Configuracoes from './pages/Configuracoes';
import Tutorial from './pages/Tutorial';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsAIPanelOpen(false);
    setIsCommandBarOpen(false);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  return (
    <div className="flex min-h-screen text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden font-['Inter']">
      {/* Overlay mobile melhorado */}
      <div 
        className={`fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[45] transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={`fixed inset-y-0 left-0 z-[50] w-72 transform transition-transform duration-500 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
        <Header 
          onOpenNotifications={() => setIsNotificationsOpen(true)} 
          onOpenAI={() => setIsAIPanelOpen(true)}
          onOpenSearch={() => setIsCommandBarOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-12 lg:py-10 scroll-smooth relative custom-scrollbar pb-32 md:pb-10">
          <div className="max-w-[1600px] mx-auto page-enter">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/recebiveis" element={<Recebiveis />} />
              <Route path="/parcelas-atraso" element={<Atraso />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/faturamento-liquido" element={<FaturamentoLiquido />} />
              <Route path="/despesas-extras" element={<DespesasExtras />} />
              <Route path="/cobranca-automatica" element={<Cobranca />} />
              <Route path="/sistema" element={<Sistema />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        <AIInsightsPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
        <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
        <BottomNav onOpenMore={() => setIsSidebarOpen(true)} />
      </div>

      {/* FAB Premium - Reposicionado para 100% Alinhamento Tátil */}
      <button 
        onClick={() => setIsAIPanelOpen(true)}
        aria-label="Assistente IA Oracle"
        className="fixed bottom-28 right-5 md:bottom-12 md:right-12 w-14 h-14 md:w-20 md:h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl md:rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center text-slate-950 text-xl md:text-3xl transition-all z-40 active:scale-90 group border border-white/20 backdrop-blur-lg"
      >
        <div className="absolute inset-0 rounded-2xl md:rounded-[2.5rem] bg-emerald-400 animate-ping opacity-[0.03]"></div>
        <i className="fa-solid fa-sparkles scale-90 md:scale-100"></i>
      </button>
    </div>
  );
};

export default App;
