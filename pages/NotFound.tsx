
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h1 className="text-9xl font-black text-emerald-500/10">404</h1>
    <h2 className="text-2xl font-bold text-white -mt-10 mb-4">Página Não Encontrada</h2>
    <p className="text-slate-400 mb-8 max-w-sm">O link que você seguiu pode estar quebrado ou a página pode ter sido movida.</p>
    <Link to="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 text-[#02111b] font-bold py-3 px-8 rounded-xl transition-all">
      Voltar para Segurança
    </Link>
  </div>
);

export default NotFound;
