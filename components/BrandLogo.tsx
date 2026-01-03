
import React from 'react';

interface Props {
  className?: string;
  showText?: boolean;
  centered?: boolean;
}

const BrandLogo: React.FC<Props> = ({ className = "w-12 h-12", showText = false, centered = false }) => {
  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start'}`}>
      <div className="relative group">
        {/* Glow de fundo para profundidade 3D */}
        <div className={`absolute inset-0 bg-emerald-500/20 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
        
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${className} relative z-10 transition-all duration-700 ease-out transform group-hover:scale-110 group-hover:rotate-1`}
        >
          <defs>
            {/* Gradiente da Fita Principal - Simula Profundidade */}
            <linearGradient id="ribbon_3d" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="45%" stopColor="#059669" />
              <stop offset="55%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Brilho de Metal (Rim Light) */}
            <linearGradient id="rim_light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0.3" />
            </linearGradient>

            <filter id="shadow_deep">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* Sombra de Oclusão */}
          <path d="M22 18 L38 18 L78 82 L62 82 Z" fill="black" fillOpacity="0.4" filter="blur(4px)" />

          {/* Pernas Laterais (Base) */}
          <path d="M22 15 Q28 16 38 15 V85 Q28 84 22 85 V15Z" fill="#064e3b" />
          <path d="M62 15 Q72 16 78 15 V85 Q72 84 62 85 V15Z" fill="#064e3b" />

          {/* A Fita Diagonal - O "N" Central */}
          <path 
            d="M22 15 L38 15 L78 85 L62 85 Z" 
            fill="url(#ribbon_3d)" 
            filter="url(#shadow_deep)"
          />

          {/* Linha de Brilho Superior (Highlight) */}
          <path 
            d="M22 15 L38 15 L30 30 Z" 
            fill="white" 
            fillOpacity="0.15"
          />
          
          {/* Rim Light (Contorno de Luz) */}
          <path 
            d="M22 15 L38 15 L78 85 L62 85 Z" 
            stroke="url(#rim_light)" 
            strokeWidth="0.5" 
            strokeOpacity="0.5"
          />
        </svg>
      </div>
      
      {showText && (
        <div className={`mt-8 transition-all duration-1000 ${centered ? 'flex flex-col items-center' : 'flex flex-col'}`}>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.06em] text-white uppercase leading-none italic flex items-baseline">
            NEXO<span className="text-emerald-500 text-2xl md:text-3xl ml-0.5">.</span>
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-[1px] w-6 bg-emerald-500/20"></div>
            <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-[0.8em] whitespace-nowrap leading-none">
              Inteligência Financeira
            </span>
            <div className="h-[1px] w-6 bg-emerald-500/20"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
