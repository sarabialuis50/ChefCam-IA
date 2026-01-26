
import React from 'react';

interface HistoryItem {
  ingredient: string;
  recipe: string;
  date: string;
  time: string;
  imageUrl?: string;
}

interface HistoryViewProps {
  history: HistoryItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  return (
    <div className="p-6">
      <header className="flex items-center justify-between mt-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">history</span>
          <h2 className="text-xl font-bold tracking-tight">Historial</h2>
        </div>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-zinc-500">tune</span>
        </button>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600 text-center space-y-4">
          <span className="material-symbols-outlined text-6xl opacity-20">history_toggle_off</span>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em]">El sistema está vacío</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-4 px-1">Reciente</h3>
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div key={idx} className="group relative flex items-center gap-4 glass-card p-3 rounded-2xl hover:bg-primary/5 transition-all cursor-pointer border-white/5 hover:border-primary/20">
                  <div className="relative flex-shrink-0">
                    <div 
                      className="w-16 h-16 rounded-xl bg-center bg-cover border border-white/10"
                      style={{ backgroundImage: `url(https://picsum.photos/seed/${item.recipe}/200/200)` }}
                    ></div>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-black rounded-full p-0.5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-base font-semibold truncate uppercase">{item.ingredient}</p>
                    <p className="text-primary/70 text-sm font-medium truncate">{item.recipe}</p>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-tighter">AI Generada • {item.time}</p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-500 group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
