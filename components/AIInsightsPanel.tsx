
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
  const firstName = state.userName ? state.userName.split(' ')[0] : 'Empreendedor';
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Olá ${firstName}. Sou a NEXO IA. Gostaria de analisar alguma estratégia específica para a ${state.companyName || 'sua empresa'} hoje?` }
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
          systemInstruction: `Você é o analista financeiro premium da NEXO. Contexto: ${financialContext}. Seja executivo, direto e preciso. Padrão R$.`,
        },
      });

      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Referência',
        uri: chunk.web?.uri
      })).filter((l: any) => l.uri);

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "Não foi possível processar agora.",
        links: links
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Houve um erro na comunicação estratégica." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div 
        className={`fixed z-[130] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) bg-[#131c21] border-l border-white/5
          bottom-0 left-0 w-full h-[80vh] rounded-t-3xl md:top-0 md:right-0 md:left-auto md:w-full md:max-w-md md:h-screen md:rounded-t-none
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <OracleIcon className="w-6 h-6 text-emerald-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Consultoria NEXO</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${
                   msg.role === 'user' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/[0.04] text-slate-200 border border-white/5'
                 }`}>
                   {msg.text}
                   {msg.links && msg.links.length > 0 && (
                     <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                       {msg.links.map((link, i) => (
                         <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-emerald-400 truncate">
                           <i className="fa-solid fa-link mr-1"></i> {link.title}
                         </a>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             ))}
             {isLoading && <div className="text-[10px] font-bold text-emerald-500 uppercase animate-pulse">Analisando...</div>}
          </div>

          <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-1.5 bg-white/[0.02] rounded-xl border border-white/10">
              <input 
                type="text" 
                placeholder="Como posso ajudar?" 
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none px-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="w-10 h-10 bg-emerald-500 text-black rounded-lg flex items-center justify-center hover:bg-emerald-400 transition-all">
                <i className="fa-solid fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIInsightsPanel;
