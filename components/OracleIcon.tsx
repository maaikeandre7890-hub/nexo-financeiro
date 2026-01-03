
import React from 'react';

interface Props {
  className?: string;
}

const OracleIcon: React.FC<Props> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Gradiente de metal da marca */}
        <linearGradient id="oracle_ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="45%" stopColor="#059669" />
          <stop offset="55%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Efeito de brilho externo (Aura) */}
        <filter id="oracle_glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Luz de varredura (Scanning) */}
        <linearGradient id="scan_light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
          <animateTransform 
            attributeName="gradientTransform" 
            type="translate" 
            from="0 -1" 
            to="0 1" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </linearGradient>
      </defs>

      <g filter="url(#oracle_glow)">
        {/* Pernas Laterais Estáticas */}
        <path d="M22 15 Q28 16 38 15 V85 Q28 84 22 85 V15Z" fill="#064e3b" opacity="0.6" />
        <path d="M62 15 Q72 16 78 15 V85 Q72 84 62 85 V15Z" fill="#064e3b" opacity="0.6" />

        {/* Fita Central Ativa (O 'N' Digital) */}
        <path 
          d="M22 15 L38 15 L78 85 L62 85 Z" 
          fill="url(#oracle_ribbon)" 
        />

        {/* Overlay de Varredura (Indica Processamento) */}
        <path 
          d="M22 15 L38 15 L78 85 L62 85 Z" 
          fill="url(#scan_light)" 
          style={{ mixMode: 'overlay' }}
        />

        {/* Núcleo de Inteligência Central (Pulsante) */}
        <circle cx="50" cy="50" r="4" fill="white">
          <animate 
            attributeName="r" 
            values="3;6;3" 
            dur="1.5s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            values="0.4;1;0.4" 
            dur="1.5s" 
            repeatCount="indefinite" 
          />
        </circle>

        {/* Rim Light de Contorno Fino */}
        <path 
          d="M22 15 L38 15 L78 85 L62 85 Z" 
          stroke="white" 
          strokeWidth="0.5" 
          strokeOpacity="0.3" 
        />
      </g>
    </svg>
  );
};

export default OracleIcon;
