
import React from 'react';

const Tutorial: React.FC = () => {
  return (
    <div className="space-y-12 py-2 page-enter">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-black text-white tracking-tighter">NEXO Masterclass<span className="text-emerald-500">.</span></h1>
        <p className="text-zinc-500 text-lg font-medium">Aprenda a dominar sua inteligência financeira em poucos minutos.</p>
        <button className="px-10 py-5 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-xl">
           Iniciar Tutorial Detalhado
        </button>
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Duração estimada: 4 minutos • 8 Passos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Configuração de Clientes', desc: 'Como importar sua base e definir scores de risco.', icon: 'fa-users' },
          { title: 'Gestão de Recebíveis', desc: 'Lançamentos manuais e conciliação automática.', icon: 'fa-arrow-up-to-line' },
          { title: 'IA Consultora', desc: 'Interpretando insights estratégicos para o lucro real.', icon: 'fa-sparkles' }
        ].map((step, i) => (
          <div key={i} className="glass-card p-10 rounded-[2.5rem] border-white/5 group hover:border-emerald-500/20 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-all mb-8">
              <i className={`fa-solid ${step.icon} text-2xl`}></i>
            </div>
            <h4 className="text-lg font-black text-white mb-4 tracking-tight italic">{step.title}</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorial;
