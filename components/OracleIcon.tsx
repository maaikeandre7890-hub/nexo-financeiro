
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
        <linearGradient id="nexus_glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <filter id="aura" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Símbolo Neural Nexus */}
      <g filter="url(#aura)">
        {/* Linhas de Fluxo Externas */}
        <path 
          d="M50 12 L85 32 V68 L50 88 L15 68 V32 L50 12Z" 
          stroke="url(#nexus_glow)" 
          strokeWidth="2.5" 
          strokeDasharray="4 2"
          strokeLinecap="round"
          opacity="0.4"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="24" dur="3s" repeatCount="indefinite" />
        </path>

        {/* O Nexo Central (Abstract N / Connection) */}
        <path 
          d="M35 40 L50 25 L65 40 V60 L50 75 L35 60 V40Z" 
          fill="url(#nexus_glow)" 
          fillOpacity="0.15"
          stroke="url(#nexus_glow)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        
        {/* O Núcleo (Core Intelligence) */}
        <circle cx="50" cy="50" r="6" fill="#10b981">
          <animate 
            attributeName="r" 
            values="5;7;5" 
            dur="2s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            values="0.6;1;0.6" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </circle>

        {/* Pontos de Conexão Críticos */}
        <circle cx="50" cy="25" r="2" fill="white">
           <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="35" cy="60" r="2" fill="white" opacity="0.5" />
        <circle cx="65" cy="60" r="2" fill="white" opacity="0.5" />
      </g>
    </svg>
  );
};

export default OracleIcon;
