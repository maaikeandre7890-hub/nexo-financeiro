import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../contexts/AppContext';
import OracleIcon from './OracleIcon';

interface Message {
  role: 'user' | 'model';
  text: string;
  links?: { title: string; uri: string }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { totals, state, formatNumber } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Conexão estabelecida com a unidade de inteligência da ${state.companyName || 'NEXO'}. Sou sua IA estratégica. Como posso otimizar sua liquidez hoje?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const financialContext = JSON.stringify({
      totals: {
        toReceive: formatNumber(totals.toReceive),
        overdue: formatNumber(totals.overdue),
        paid: formatNumber(totals.paid),
        cashHealth: totals.cashHealth
      }
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `Você é o NEXO IA, o cérebro estratégico por trás de um SaaS financeiro de alto escalão. Seu tom é formal, executivo, extremamente analítico e sofisticado. Contexto: ${financialContext}. Ajude o gestor a tomar decisões que valem milhões.`,
        },
      });

      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Relatório Externo',
        uri: chunk.web?.uri
      })).filter((l: any) => l.uri);

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "Não foi possível consolidar a análise estratégica no momento.",
        links: links
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Houve uma interrupção no protocolo de análise financeira." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY COM BLUR INTENSIFICADO */}
      <div 
        className={`fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* MODAL / BOTTOM SHEET CONTAINER */}
      <div 
        className={`fixed z-[160] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) bg-[#020608] border border-white/[0.04] shadow-[0_40px_100px_rgba(0,0,0,0.8)]
          bottom-0 left-0 w-full h-[92vh] rounded-t-[2.5rem] 
          md:inset-10 md:w-full md:max-w-5xl md:mx-auto md:h-[85vh] md:rounded-[3rem] md:top-1/2 md:-translate-y-1/2
          ${isOpen ? 'translate-y-0 md:translate-y-[-50%] opacity-100 scale-100' : 'translate-y-full md:translate-y-[100%] opacity-0 scale-95'}`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          
          {/* HANDLE VISUAL MOBILE */}
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mt-4 md:hidden" />

          {/* Header Superior Premium */}
          <div className="p-6 md:p-10 border-b border-white/[0.02] flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="relative">
                 <OracleIcon className="w-8 h-8 md:w-10 md:h-10" />
                 <div className="absolute inset-0 bg-emerald-500/10 blur-xl animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold italic tracking-tighter text-white uppercase leading-none">NEXO<span className="text-emerald-500">.</span>IA</h2>
                <p className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.4em] mt-2">Intelligence Unit</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-2xl border border-white/[0.04] flex items-center justify-center text-zinc-600 hover:text-white transition-all hover:bg-white/[0.03]"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Área de Chat */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar bg-gradient-to-b from-transparent to-black/30">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className={`max-w-[90%] md:max-w-[80%] p-6 md:p-8 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-xl ${
                   msg.role === 'user' 
                    ? 'bg-emerald-500 text-black font-bold rounded-tr-none' 
                    : 'bg-white/[0.02] text-zinc-300 border border-white/[0.03] rounded-tl-none font-medium'
                 }`}>
                   {msg.text}
                   {msg.links && msg.links.length > 0 && (
                     <div className="mt-8 pt-6 border-t border-white/[0.03] space-y-3">
                       <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mb-4">Fontes Operacionais</p>
                       {msg.links.map((link, i) => (
                         <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group/link p-2 -ml-2 rounded-xl hover:bg-white/[0.03] transition-all">
                           <i className="fa-solid fa-link text-[10px] text-emerald-500/40 group-hover/link:text-emerald-500"></i>
                           <span className="text-[11px] text-zinc-500 group-hover/link:text-emerald-400 truncate font-bold uppercase tracking-tight">{link.title}</span>
                         </a>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex items-center gap-4 animate-pulse px-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                  <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.5em]">Processando Inteligência...</span>
               </div>
             )}
          </div>

          {/* Footer de Input */}
          <div className="p-6 md:p-10 border-t border-white/[0.02] bg-[#000000]">
            <div className="flex items-center gap-4 p-2 bg-white/[0.01] rounded-[2rem] border border-white/[0.04] focus-within:border-emerald-500/20 transition-all">
              <input 
                type="text" 
                placeholder="Questione sua operação..." 
                className="flex-1 bg-transparent border-none text-sm md:text-base text-white focus:outline-none px-6 py-4 placeholder:text-zinc-800 font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 bg-emerald-500 text-black rounded-[1.25rem] flex items-center justify-center hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-20 shadow-lg"
              >
                <i className="fa-solid fa-paper-plane-top text-lg"></i>
              </button>
            </div>
            <p className="text-[8px] font-black text-zinc-900 uppercase tracking-[0.6em] text-center mt-8">Secure Access • NEXO Alpha Protocol</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIInsightsPanel;