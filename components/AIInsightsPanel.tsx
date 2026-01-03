
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../contexts/AppContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { totals, state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Analista Financeiro NEXO ativo. Saldo líquido monitorado: R$ ' + totals.netBalance.toLocaleString() + '. Como posso auxiliar na sua estratégia de capital hoje?' }
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
      resumo: totals,
      clientes: state.clients.length,
      faturas_atrasadas: state.receivables.filter(r => r.status === 'Atrasado').length,
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é o NEXO CFO, consultor sênior de bancos de investimento.
          CONTEXTO FINANCEIRO: ${financialContext}.
          DIRETRIZES:
          - Linguagem executiva, precisa e baseada em dados.
          - Use jargões de mercado (LTV, CAC, EBITDA, Liquidez).
          - Formate respostas com Markdown elegante.
          - Priorize rentabilidade e mitigação de risco.`,
        },
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Erro de sincronização neural." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Conexão perdida com o terminal central." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-[#07131A]/80 backdrop-blur-md z-[45] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-screen w-full max-w-lg bg-[#0B1C26] border-l border-white/5 z-[50] shadow-[-30px_0_60px_rgba(0,0,0,0.6)] transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-10 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-brain text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight italic uppercase">NEXO Oracle</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enterprise AI Node</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl transition-all text-slate-500 hover:text-white">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-6 rounded-3xl text-sm leading-relaxed ${
                   msg.role === 'user' 
                    ? 'bg-emerald-600 text-white font-bold rounded-tr-none shadow-lg shadow-emerald-900/20' 
                    : 'bg-[#112532] border border-white/5 text-slate-300 rounded-tl-none'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-[#112532] px-6 py-4 rounded-3xl rounded-tl-none border border-white/5 flex gap-4 items-center">
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Calculando Fluxo</span>
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                 </div>
               </div>
             )}
          </div>

          <div className="p-10 border-t border-white/5 bg-[#07131A]/40">
            <div className="flex items-center gap-4 p-2.5 bg-[#112532] rounded-2xl border border-white/5 focus-within:border-emerald-500/40 transition-all shadow-inner">
              <input 
                type="text" 
                placeholder="Solicitar análise de liquidez..." 
                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-4 py-2 font-medium placeholder:text-slate-600"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-30 shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                <i className="fa-solid fa-paper-plane-top"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIInsightsPanel;
