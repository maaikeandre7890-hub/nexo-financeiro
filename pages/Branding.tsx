
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import BrandLogo from '../components/BrandLogo';

const Branding: React.FC = () => {
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePremiumLogo = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // PROMPT DE NÍVEL MESTRE: Foco em texturas, iluminação global e geometria abstrata de luxo
      const prompt = `
        Ultra-premium avant-garde fintech logo for 'NEXO'. 
        The icon is a singular, iconic abstract letter 'N' formed by two sleek, converging architectural ribbons.
        Materials: Frosted translucent glass, polished brushed titanium, and internal glowing emerald core.
        Color Palette: Deep Midnight Petroleum (#071821) background with vibrant Hyper-Emerald (#10b981) highlights.
        Visual Style: Minimalist High-End SaaS, Apple/Stripe aesthetic, sophisticated global illumination, soft raytracing shadows, macro photography style.
        Composition: Perfectly centered, symmetrical, high contrast, 8k resolution, photorealistic rendering. 
        NO text inside the symbol, just the 'N' icon. Pure, bold, and authoritative.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedLogo(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (error) {
      console.error("Erro ao gerar logo:", error);
      alert("O motor de design está sobrecarregado. Tente novamente em instantes.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-16 py-8 animate-in fade-in duration-1000">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Brand System v2.0</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic leading-none">
          A Força da <br/><span className="text-emerald-500">Identidade.</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto italic">
          NEXO é sobre conexão absoluta entre dados e decisões. Nossa marca reflete solidez, luxo e controle total.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Seção Logo Vetorial */}
        <div className="glass-card p-12 md:p-16 rounded-[4rem] border-white/5 flex flex-col items-center justify-center text-center space-y-10 bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <BrandLogo className="w-40 h-40 md:w-56 md:h-56 relative z-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">Monograma NEXO</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em]">The Master Mark</p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full pt-6">
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase">Proporção</p>
                <p className="text-xs font-bold text-white">1:1.618</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase">Peso</p>
                <p className="text-xs font-bold text-white">Black</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-slate-600 uppercase">Estilo</p>
                <p className="text-xs font-bold text-white">Bespoke</p>
             </div>
          </div>
        </div>

        {/* Seção Logo IA Render */}
        <div className="glass-card p-12 md:p-16 rounded-[4rem] border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] -mr-16 -mt-16"></div>
          
          <div className="w-full aspect-square max-w-[320px] bg-slate-950 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative group">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-16 h-16 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Renderizando Render 8K...</p>
                   <p className="text-[8px] font-bold text-slate-700 uppercase">Raytracing Ativado</p>
                </div>
              </div>
            ) : generatedLogo ? (
              <img src={generatedLogo} alt="Logo Gerado" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="flex flex-col items-center text-slate-800">
                <i className="fa-solid fa-microchip text-6xl mb-6"></i>
                <p className="text-xs font-black uppercase tracking-[0.3em]">IA Vision Master</p>
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={generatePremiumLogo}
              disabled={isGenerating}
              className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.25em] text-[11px] hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? "CRIANDO OBRA DE ARTE..." : "GERAR CONCEITO 8K"}
            </button>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Baseado em design arquitetural e materiais nobres</p>
          </div>
        </div>
      </div>

      {/* Grid de Materiais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
         {[
           { name: 'Titânio Escovado', color: 'bg-slate-400', desc: 'Resiliência e estrutura' },
           { name: 'Vidro Esmeralda', color: 'bg-emerald-500', desc: 'Transparência e clareza' },
           { name: 'Deep Petroleum', color: 'bg-slate-900', desc: 'Profundidade e foco' }
         ].map((mat, i) => (
           <div key={i} className="glass-card p-8 rounded-3xl border-white/5 flex gap-6 items-center">
              <div className={`w-14 h-14 ${mat.color} rounded-2xl shadow-xl shrink-0`}></div>
              <div>
                 <h4 className="text-sm font-black text-white italic">{mat.name}</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{mat.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Branding;
