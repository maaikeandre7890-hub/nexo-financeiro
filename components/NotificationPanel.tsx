
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const notifications = [
    { id: 1, type: 'payment', title: 'Pagamento Confirmado', desc: 'Tecnologia Avançada SA liquidou R$ 15.000', time: 'Há 2 min' },
    { id: 2, type: 'alert', title: 'Atenção: Inadimplência', desc: 'Distribuidora Norte Ltda - Vencida há 2 dias', time: 'Há 1 hora' },
    { id: 3, type: 'info', title: 'Relatório Disponível', desc: 'O fechamento de Julho já pode ser consultado.', time: 'Há 3 horas' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-screen w-full max-w-sm bg-[#07131A] border-l border-white/5 z-[50] shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">Notificações</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-all"><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 
                    notif.type === 'alert' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    <i className={`fa-solid ${
                      notif.type === 'payment' ? 'fa-check' : 
                      notif.type === 'alert' ? 'fa-exclamation' : 'fa-file-lines'
                    }`}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{notif.title}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{notif.desc}</p>
                    <span className="text-[10px] text-slate-600 font-bold uppercase mt-2 block tracking-widest">{notif.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-8 w-full py-3 rounded-xl border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/[0.03] hover:text-white transition-all">
            Limpar Notificações
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
