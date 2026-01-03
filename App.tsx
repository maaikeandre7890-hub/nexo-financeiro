
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
    <div className="flex min-h-screen text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden font-['Inter'] pb-20 md:pb-0">
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[45] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
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
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-12 lg:py-10 scroll-smooth relative custom-scrollbar">
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
          <div className="h-10 md:hidden"></div>
        </main>

        <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        <AIInsightsPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
        <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
        <BottomNav onOpenMore={() => setIsSidebarOpen(true)} />
      </div>

      {/* FAB Premium - NEXO ORACLE ACCESS */}
      <button 
        onClick={() => setIsAIPanelOpen(true)}
        title="Abrir NEXO ORACLE"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center text-slate-950 text-xl md:text-3xl hover:-translate-y-2 hover:scale-105 transition-all z-40 active:scale-95 group border border-white/20"
      >
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-emerald-400 animate-ping opacity-10 group-hover:opacity-30"></div>
        <div className="relative flex items-center justify-center">
          <i className="fa-solid fa-robot scale-75 md:scale-90 opacity-40 absolute -top-1 -right-1"></i>
          <i className="fa-solid fa-sparkles"></i>
        </div>
      </button>
    </div>
  );
};

export default App;
