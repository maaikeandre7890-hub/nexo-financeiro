
import React from 'react';

const Tutorial: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-white">Central de Ajuda</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#0a192f] p-6 rounded-2xl border border-emerald-900/20 flex flex-col gap-4">
          <div className="aspect-video bg-[#02111b] rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-play text-emerald-500 text-2xl"></i>
          </div>
          <h4 className="font-bold text-white">Como cadastrar {i === 1 ? 'clientes' : i === 2 ? 'recebíveis' : 'bancos'}</h4>
          <p className="text-sm text-slate-400">Aprenda em menos de 2 minutos como configurar seu NEXO.</p>
        </div>
      ))}
    </div>
  </div>
);

export default Tutorial;
