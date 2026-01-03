
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../contexts/AppContext';
import OracleIcon from './OracleIcon';

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
  const firstName = state.userName ? state.userName.split(' ')[0] : 'Empreendedor';
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Saudações, ${firstName}. Sou o Oracle NEXO. Analisei os números da ${state.companyName || 'sua empresa'} e estou pronto para te dar insights estratégicos sobre seu lucro e fluxo de caixa. Como posso ajudar agora?` }
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
      totals,
      company: state.companyName,
      user: state.userName,
      clientCount: state.clients.length,
      overdueCount: state.receivables.filter(r => r.status === 'Atrasado').length,
      expenseTotal: totals.totalExpenses
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Você é o Oracle NEXO, um assistente virtual de elite especializado em gestão financeira para pequenos negócios. 
          Contexto financeiro atual do usuário: ${financialContext}.
          Diretrizes: 
          - Responda de forma direta, encorajadora e consultiva.
          - Use o nome do usuário: ${firstName}.
          - Ajude-o a entender onde ele pode economizar ou como cobrar melhor.
          - Formate em Markdown.
          - Nunca invente dados que não estão no contexto.`,
        },
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Não consegui processar essa análise agora. Tente de outra forma." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Minha conexão com o banco de dados foi interrompida momentaneamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[120] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-screen w-full max-w-xl bg-[#071821] border-l border-white/10 z-[130] shadow-[-20px_0_60px_rgba(0,0,0,0.8)] transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative overflow-hidden">
          
          <div className="p-8 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02] backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 oracle-chip rounded-2xl flex items-center justify-center text-emerald-500">
                <OracleIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight italic uppercase leading-none mb-1">Oracle NEXO</h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Consultoria Ativa</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all text-slate-500">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[90%] p-5 rounded-2xl text-sm leading-relaxed ${
                   msg.role === 'user' 
                    ? 'bg-emerald-600 text-white font-bold rounded-tr-none shadow-xl shadow-emerald-900/10' 
                    : 'bg-white/[0.04] border border-white/5 text-slate-200 rounded-tl-none backdrop-blur-md'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white/[0.03] px-6 py-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-3 items-center">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest">Analisando Dados...</span>
                 </div>
               </div>
             )}
          </div>

          <div className="p-8 border-t border-white/[0.05] bg-black/40 backdrop-blur-2xl">
            <div className="flex items-center gap-4 p-2 bg-white/[0.03] rounded-2xl border border-white/10 focus-within:border-emerald-500/50 transition-all">
              <input 
                type="text" 
                placeholder="Pergunte sobre seu lucro ou despesas..." 
                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-4 py-3 font-medium placeholder:text-slate-600"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all disabled:opacity-30 shadow-lg"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIInsightsPanel;
