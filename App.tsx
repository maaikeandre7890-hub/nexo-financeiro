import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import CommandBar from './components/CommandBar';
import Onboarding from './components/Onboarding';
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
import BrandLogo from './components/BrandLogo';
import { useApp } from './contexts/AppContext';

const App: React.FC = () => {
  const { state } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Sincronização de Bloqueio sem perda de posição
  useEffect(() => {
    const isAnyOverlaid = isNotificationsOpen || isAIPanelOpen || isCommandBarOpen || isSidebarOpen;
    const mainElement = mainRef.current;
    
    if (mainElement) {
      if (isAnyOverlaid) {
        // Bloqueia interações mas mantém visual e scroll position
        mainElement.style.overflowY = 'hidden';
      } else {
        mainElement.style.overflowY = 'auto';
      }
    }
  }, [isNotificationsOpen, isAIPanelOpen, isCommandBarOpen, isSidebarOpen]);

  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsAIPanelOpen(false);
    setIsCommandBarOpen(false);
    setIsSidebarOpen(false);
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
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

  if (!state.onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <div className="flex h-screen w-full text-slate-300 selection:bg-emerald-500/30 font-['Inter'] overflow-hidden bg-transparent">
      {/* Sidebar Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] transition-opacity duration-500 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <div className={`fixed inset-y-0 left-0 z-[110] w-[280px] transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 md:w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          onOpenNotifications={() => setIsNotificationsOpen(true)} 
          onOpenAI={() => setIsAIPanelOpen(true)}
          onOpenSearch={() => setIsCommandBarOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto p-5 md:p-8 lg:px-14 lg:py-12 relative custom-scrollbar pb-10"
        >
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
      </div>

      <div className="fixed bottom-10 right-10 z-40">
        <button 
          onClick={() => setIsAIPanelOpen(true)}
          className="flex items-center gap-4 bg-emerald-500 hover:bg-emerald-400 p-2 pr-6 rounded-2xl shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all active:scale-95 group border border-white/10"
        >
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
            <BrandLogo className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-start text-left pointer-events-none">
            <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest leading-none">Oracle NEXO</span>
            <span className="text-[8px] font-black text-slate-900/40 uppercase tracking-widest mt-1">Análise Inteligente</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default App;