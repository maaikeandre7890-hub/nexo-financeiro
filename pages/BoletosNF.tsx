
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoletosNF: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 py-6 page-enter">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Gestão Fiscal & Bancária</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
          Boletos & <br/><span className="text-slate-600">Notas Fiscais.</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium italic">Emissão e controle de cobranças financeiras e fiscais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Gerar Boleto */}
        <div 
          onClick={() => navigate('/boletos-nf/boleto')}
          className="glass-card p-12 rounded-[3.5rem] border-white/5 flex flex-col items-center justify-center space-y-8 bg-[#020608] group hover:border-amber-500/30 hover:bg-amber-500/[0.02] cursor-pointer transition-all h-[300px]"
        >
          <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-xl">
            <i className="fa-solid fa-barcode text-4xl"></i>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Gerar Boleto</h3>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-2">🟡 Cobrança Bancária</p>
          </div>
        </div>

        {/* Card Gerar NF */}
        <div 
          onClick={() => navigate('/boletos-nf/nf')}
          className="glass-card p-12 rounded-[3.5rem] border-white/5 flex flex-col items-center justify-center space-y-8 bg-[#020608] group hover:border-blue-500/30 hover:bg-blue-500/[0.02] cursor-pointer transition-all h-[300px]"
        >
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-xl">
            <i className="fa-solid fa-file-invoice-dollar text-4xl"></i>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Gerar Nota Fiscal</h3>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2">🔵 Documento Fiscal</p>
          </div>
        </div>
      </div>

      <div className="p-10 glass-card rounded-[3rem] border-white/5 bg-[#030d12] flex items-center gap-8">
         <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center text-slate-600 text-xl border border-white/5">
            <i className="fa-solid fa-circle-info"></i>
         </div>
         <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
           <strong className="text-white uppercase tracking-widest text-[10px]">Nota:</strong> O módulo de Boletos e NF está em fase de pré-integração. Os lançamentos gerados agora ficarão salvos como rascunhos internos até que a API de emissão seja configurada.
         </p>
      </div>
    </div>
  );
};

export default BoletosNF;
