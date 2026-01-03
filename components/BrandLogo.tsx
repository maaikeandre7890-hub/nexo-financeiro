
import React from 'react';

interface Props {
  className?: string;
  showText?: boolean;
}

const BrandLogo: React.FC<Props> = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className={`flex items-center gap-4 ${className.includes('w-') ? '' : 'w-auto'}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.2))' }}
      >
        <defs>
          <linearGradient id="nexo_lux_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="nexo_accent_grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Estrutura Principal do N (Design Arquitetural) */}
        <path 
          d="M30 25C30 22.2386 32.2386 20 35 20H45C47.7614 20 50 22.2386 50 25V55L70 30H80C82.7614 30 85 32.2386 85 35V75C85 77.7614 82.7614 80 80 80H70C67.2386 80 65 77.7614 65 75V45L45 70H35C32.2386 70 30 67.7614 30 65V25Z" 
          fill="url(#nexo_lux_grad)" 
        />
        
        {/* Reflexo de Vidro/Brilho Superior */}
        <path 
          d="M30 25C30 22.2386 32.2386 20 35 20H45C47.7614 20 50 22.2386 50 25V35L30 25Z" 
          fill="url(#nexo_accent_grad)" 
        />

        {/* Ponto de Equilíbrio Central */}
        <rect x="47" y="47" width="6" height="6" rx="1" fill="white" />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-3xl font-black tracking-[-0.06em] text-white">
            NEXO<span className="text-emerald-500">.</span>
          </span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1 ml-0.5">
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
