
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  activeNav?: string;
  onNavClick?: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true, activeNav, onNavClick }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-pure-black relative overflow-hidden font-body">
      <main className="flex-1 w-full overflow-y-auto pb-32 custom-scrollbar">
        {children}
      </main>

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-zinc-900 pb-10 pt-4 px-6 z-50 max-w-[430px] mx-auto">
          <div className="flex justify-between items-center h-16 relative">
            <NavItem 
              icon="home" 
              label="Inicio" 
              active={activeNav === 'dashboard'} 
              onClick={() => onNavClick?.('dashboard')} 
            />
            <NavItem 
              icon="favorite" 
              label="Favoritos" 
              active={activeNav === 'favorites'} 
              onClick={() => onNavClick?.('favorites')} 
            />
            
            {/* Centered Floating Scanner Button */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-14">
              <button 
                onClick={() => onNavClick?.('scanner')}
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(57,255,20,0.5)] border-8 border-pure-black transform active:scale-90 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-4xl font-black">photo_camera</span>
              </button>
            </div>

            <NavItem 
              icon="history" 
              label="Historial" 
              active={activeNav === 'history'} 
              onClick={() => onNavClick?.('history')} 
            />
            <NavItem 
              icon="person" 
              label="Perfil" 
              active={activeNav === 'profile'} 
              onClick={() => onNavClick?.('profile')} 
            />
          </div>
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-zinc-600'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-icon' : ''}`}>
      {icon}
    </span>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);
