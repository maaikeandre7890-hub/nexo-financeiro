
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
    { role: 'model', text: 'Saudações, Alexandre. Sou o Oráculo NEXO. Analisei seu fluxo de R$ ' + totals.netBalance.toLocaleString() + ' e estou pronto para otimizar sua margem operacional. O que analisaremos hoje?' }
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
          systemInstruction: `Você é o NEXO CFO, um consultor sênior de elite em estratégia financeira.
          CONTEXTO DO CLIENTE: ${financialContext}.
          ESTILO DE RESPOSTA:
          - Tom executivo, direto, confiante e consultivo.
          - Use Markdown (negrito, listas) para clareza.
          - Fale em termos de rentabilidade, ROI, EBITDA e Cash Flow.
          - Responda apenas em Português Brasil.`,
        },
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Desculpe, encontrei um erro no processamento dos dados fiscais." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "A conexão com o Oracle foi interrompida. Verifique os nodes do sistema." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[45] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-screen w-full max-w-xl bg-[#071821] border-l border-white/10 z-[50] shadow-[-40px_0_80px_rgba(0,0,0,0.8)] transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative overflow-hidden">
          
          {/* Header do Oracle */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.03] backdrop-blur-md relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 oracle-chip rounded-2xl flex items-center justify-center text-emerald-500 relative">
                <i className="fa-solid fa-robot text-xl"></i>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 text-[10px] font-black border-2 border-[#071821]">
                  N
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight italic uppercase leading-none mb-1">Oracle Concierge</h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Análise Preditiva Ativa</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] rounded-full transition-all text-slate-500 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Área de Mensagens */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[90%] p-5 rounded-2xl text-sm leading-relaxed ${
                   msg.role === 'user' 
                    ? 'bg-emerald-600 text-white font-bold rounded-tr-none shadow-xl shadow-emerald-900/20' 
                    : 'bg-white/[0.04] border border-white/5 text-slate-200 rounded-tl-none backdrop-blur-md'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white/[0.04] px-6 py-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-4 items-center">
                   <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:1s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]"></div>
                   </div>
                   <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest">Calculando ROI...</span>
                 </div>
               </div>
             )}
          </div>

          {/* Input Premium */}
          <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-2xl">
            <div className="flex items-center gap-4 p-3 bg-white/[0.03] rounded-[1.5rem] border border-white/10 focus-within:border-emerald-500/50 focus-within:bg-white/[0.05] transition-all duration-300">
              <input 
                type="text" 
                placeholder="Ex: 'Qual a projeção de caixa para Agosto?'" 
                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-4 py-2 font-medium placeholder:text-slate-600"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center hover:bg-emerald-400 transition-all disabled:opacity-30 shadow-lg shadow-emerald-500/20 active:scale-90"
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
