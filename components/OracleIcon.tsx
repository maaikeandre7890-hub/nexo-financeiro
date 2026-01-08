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
        <linearGradient id="nexo_n_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      <g opacity="0.95">
        {/* Pernas Laterais Súteis */}
        <rect x="22" y="15" width="14" height="70" rx="2" fill="#064e3b" opacity="0.3" />
        <rect x="64" y="15" width="14" height="70" rx="2" fill="#064e3b" opacity="0.3" />

        {/* Diagonal Principal (O 'N' Ribbon Minimalista) */}
        <path 
          d="M22 15H36L78 85H64L22 15Z" 
          fill="url(#nexo_n_grad)" 
        />

        {/* Ponto de Pulso Central */}
        <circle cx="50" cy="50" r="3" fill="white">
          <animate 
            attributeName="opacity" 
            values="0.2;1;0.2" 
            dur="2s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="r" 
            values="2.5;4;2.5" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </circle>
      </g>
    </svg>
  );
};

export default OracleIcon;