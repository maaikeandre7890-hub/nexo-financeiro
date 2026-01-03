import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import CommandBar from './components/CommandBar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Recebiveis from './pages/Recebiveis';
import Atraso from './pages/Atraso';
import Historico from './pages/Historico';
import Relatorios from './pages/Relatorios';
import Faturamento from './pages/Faturamento';
import Despesas from './pages/Despesas';
import Configuracoes from './pages/Configuracoes';
import Tutorial from './pages/Tutorial';
import NotFound from './pages/NotFound';

const BUILD_VERSION = new Date().toISOString();

const App: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // 🔥 PROVA DEFINITIVA DE DEPLOY
  useEffect(() => {
    console.log('🚀 NEXO DEPLOY ATIVO — BUILD:', BUILD_VERSION);
  }, []);

  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsAIPanelOpen(false);
    setIsCommandBarOpen(false);
    setIsSidebarOpen(false);
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
    <div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 overflow-hidden font-['Inter']">

      {/* 🔍 BUILD VERSION FIXA NA TELA */}
      <div className="fixed bottom-2 left-2 z-[9999] text-[10px] text-slate-400 opacity-70">
        BUILD: {BUILD_VERSION}
      </div>

      {/* Sidebar Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className={`fixed inset-y-0 left-0 z-[50] w-72 transform transition-transform duration-500 md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
        <Header 
          onOpenNotifications={() => setIsNotificationsOpen(true)} 
          onOpenAI={() => setIsAIPanelOpen(true)}
          onOpenSearch={() => setIsCommandBarOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-12 lg:py-10 scroll-smooth relative">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/recebiveis" element={<Recebiveis />} />
              <Route path="/parcelas-atraso" element={<Atraso />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/faturamento" element={<Faturamento />} />
              <Route path="/despesas" element={<Despesas />} />
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

      <button 
        onClick={() => setIsAIPanelOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center text-slate-950 text-2xl md:text-3xl hover:scale-110 hover:-rotate-12 transition-all z-40 active:scale-95 group"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-10 group-hover:opacity-30"></div>
        <i className="fa-solid fa-sparkles"></i>
      </button>
    </div>
  );
};

export default App;
