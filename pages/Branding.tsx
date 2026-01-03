
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import BrandLogo from '../components/BrandLogo';

const Branding: React.FC = () => {
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCinematicBrand = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Ultra-modern, cinematic minimalist 'N' logo icon for a financial SaaS called 'NEXO'. 
        Style: Folded ribbon aesthetic, single bold letter 'N', sharp edges, subtle 3D depth with realistic soft shadows at the folds.
        Color: Vibrant Emerald Green (#10b981) with deep forest green shadows.
        Atmosphere: High-end, premium technology, clean and powerful. 
        Background: Solid matte petroleum black. 
        Reference: Netflix logo structure but with NEXO's emerald identity. 
        Lighting: Studio rim light, 8k resolution, flat vector style but with depth.
        NO text, NO extra symbols. Just the iconic ribbon 'N'.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedLogo(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (error) {
      console.error("AI Branding Engine Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-24 py-12 animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[1em] mb-4 block">The Global Icon</span>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] italic uppercase">
          Estética <br/><span className="text-emerald-500">Superior.</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto italic opacity-80">
          Inspirado nos gigantes. Desenhado para a próxima geração de líderes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="flex flex-col items-center">
          <div className="glass-card p-24 rounded-[5rem] border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl mb-12 relative group">
            <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
            <BrandLogo className="w-48 h-48 md:w-64 md:h-64 relative z-10" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">O Ícone "Ribbon"</h3>
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.6em] mt-3">Design de Fita Dobrada</p>
        </div>

        <div className="space-y-12">
           <div className="w-full aspect-square bg-[#01080a] rounded-[5rem] border border-white/5 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] relative group">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
                   <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                   <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Renderizando Visão...</p>
                </div>
              ) : generatedLogo ? (
                <img src={generatedLogo} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="IA Concept" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 p-16 text-center">
                  <i className="fa-solid fa-film text-7xl mb-8 opacity-20"></i>
                  <p className="text-sm font-black uppercase tracking-widest opacity-40 italic">Aguardando geração do <br/>conceito visual premium</p>
                </div>
              )}
           </div>
           
           <button 
             onClick={generateCinematicBrand}
             disabled={isGenerating}
             className="w-full py-7 bg-white text-slate-950 rounded-3xl font-black uppercase tracking-[0.4em] text-[12px] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
           >
             {isGenerating ? "PROCESSANDO..." : "VISUALIZAR CONCEITO CINEMÁTICO"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-16 border-t border-white/5">
         <div className="glass-card p-12 rounded-[4rem] border-white/5 hover:border-emerald-500/20 transition-all">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic">Profundidade Tátil</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">As dobras não são apenas estéticas; elas representam a complexidade financeira simplificada por nossa interface.</p>
         </div>
         <div className="glass-card p-12 rounded-[4rem] border-white/5 hover:border-emerald-500/20 transition-all">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic">O Arco da Vitória</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">A curvatura inferior cria um movimento ascendente, simbolizando o crescimento constante dos nossos parceiros.</p>
         </div>
      </div>
    </div>
  );
};

export default Branding;
