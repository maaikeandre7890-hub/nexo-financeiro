
import React from 'react';

interface Props {
  className?: string;
  showText?: boolean;
}

/**
 * NEXO BRAND IDENTITY v6.1 - "THE COMPLETE CINEMATIC N"
 * Correção de geometria: A fita diagonal agora possui a mesma espessura dos pilares,
 * eliminando a sensação de "pedaço faltando".
 */
const BrandLogo: React.FC<Props> = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className={`flex items-center gap-6 ${className.includes('w-') ? '' : 'w-auto'}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`${className} transition-all duration-700 ease-out`}
      >
        <defs>
          {/* Gradiente principal vibrante (Nexo Emerald) */}
          <linearGradient id="main_ribbon" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Sombra para profundidade tátil na dobra */}
          <filter id="ribbon_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feOffset dx="2" dy="0" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>

        {/* Pilar Esquerdo (Base) */}
        <path 
          d="M22 15 Q30 17 38 16 V84 Q30 83 22 85 V15Z" 
          fill="#064e3b" 
        />
        
        {/* Pilar Direito (Base) */}
        <path 
          d="M62 16 Q70 17 78 15 V85 Q70 83 62 84 V16Z" 
          fill="#064e3b" 
        />

        {/* A Fita Diagonal (O elemento de destaque que "dobra" por cima) */}
        {/* Agora com espessura completa conectando os cantos corretamente */}
        <path 
          d="M22 15 L38 15 L78 85 L62 85 Z" 
          fill="url(#main_ribbon)" 
          style={{ filter: 'drop-shadow(4px 0 8px rgba(0,0,0,0.6))' }}
        />
        
        {/* Brilho sutil na borda superior para realçar o acabamento premium */}
        <path 
          d="M22 15 L38 15 L42 22 L26 22 Z" 
          fill="white" 
          fillOpacity="0.08" 
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-4xl font-black tracking-[-0.08em] text-white uppercase leading-[0.8] italic">
            NEXO<span className="text-emerald-500">.</span>
          </span>
          <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.8em] mt-2 ml-1">
            Capital Management
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
