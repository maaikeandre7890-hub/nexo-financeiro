
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
    { role: 'model', text: 'Análise de caixa concluída. O saldo líquido atual é de R$ ' + totals.netBalance.toLocaleString() + '. Como posso atuar na otimização da sua rentabilidade hoje?' }
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
      maior_receita_mrr: Math.max(...state.clients.map(c => c.monthlyValue), 0)
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é o NEXO CFO, um consultor financeiro de elite para empresas B2B.
          DADOS REAIS: ${financialContext}.
          COMPORTAMENTO:
          - Seja ultra-direto, corporativo e use jargões financeiros reais (ROI, EBITDA, Burn Rate, Churn).
          - Use Markdown para tabelas e negritos.
          - Sempre sugira uma ação para reduzir a inadimplência ou aumentar o faturamento recorrente.
          - Se houver atrasos críticos, soe o alerta imediatamente.`,
        },
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Operação de IA falhou." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Conexão interrompida com o cérebro central." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[45] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-screen w-full max-w-lg bg-[#0a0f1e] border-l border-white/5 z-[50] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0a0f1e]/90 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <i className="fa-solid fa-microchip text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tighter italic">NEXO AI CFO</h2>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Link Active</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar bg-gradient-to-b from-[#0a0f1e] to-black">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                 <div className={`max-w-[90%] p-5 rounded-2xl text-sm leading-relaxed border ${
                   msg.role === 'user' 
                    ? 'bg-emerald-600 text-white font-bold rounded-tr-none border-emerald-500 shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 rounded-tl-none shadow-xl'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-slate-900/50 p-4 rounded-2xl rounded-tl-none border border-slate-800 flex gap-3 items-center text-emerald-500 text-xs font-black uppercase tracking-widest">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                   </div>
                   Calculando Estratégia
                 </div>
               </div>
             )}
          </div>

          <div className="p-8 bg-black/40 backdrop-blur-md border-t border-white/5">
            <div className="flex items-center gap-4 p-2 bg-slate-900/80 rounded-2xl border border-slate-800 focus-within:border-emerald-500/40 transition-all shadow-inner">
              <input 
                type="text" 
                placeholder="Como posso otimizar meu faturamento?" 
                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-4 py-2 font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-90"
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
