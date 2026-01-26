
import React from 'react';

interface ProfileViewProps {
  user: any;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col">
      <nav className="flex items-center justify-between p-6 border-b border-white/5">
        <span className="material-symbols-outlined text-zinc-500">arrow_back_ios</span>
        <h2 className="text-lg font-tech font-bold uppercase tracking-tight">Perfil</h2>
        <button className="flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </nav>

      <header className="flex flex-col items-center p-8 space-y-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-2 border-primary p-1 neon-glow">
            <img 
              src={`https://picsum.photos/seed/${user?.email}/200/200`} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-primary p-1 rounded-full text-black border-2 border-pure-black">
            <span className="material-symbols-outlined text-sm font-bold">verified</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-3xl font-bold font-tech uppercase">{user?.name}</h3>
          <p className="text-primary text-base font-medium">Master of Ingredients</p>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Miembro desde Oct 2024</p>
        </div>
      </header>

      <section className="px-6 grid grid-cols-3 gap-3">
        <StatCard value="42" label="Recetas" />
        <StatCard value="128" label="Escaneos" />
        <StatCard value="PRO" label="Nivel" />
      </section>

      <section className="mt-8 px-4 space-y-6">
        <div className="space-y-1">
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] px-4 pb-2 opacity-50">Configuración</h3>
          <div className="space-y-1">
            <ProfileLink icon="account_circle" label="Cuenta Personal" />
            <div className="group flex items-center gap-4 px-4 min-h-[64px] justify-between rounded-2xl bg-primary/5 border border-primary/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-xl bg-primary/20 shrink-0 size-11 neon-glow">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div>
                  <p className="text-white text-base font-medium truncate">Plan Premium</p>
                  <p className="text-primary text-[10px] font-bold uppercase">Renueva en 15 días</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">arrow_forward</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] px-4 pb-2 opacity-50">Soporte</h3>
          <div className="space-y-1">
            <ProfileLink icon="help" label="Ayuda y Soporte" />
            <ProfileLink icon="lock" label="Privacidad" />
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 min-h-[64px] rounded-2xl hover:bg-red-500/10 transition-all text-red-500"
        >
          <div className="flex items-center justify-center rounded-xl bg-red-500/10 shrink-0 size-11">
            <span className="material-symbols-outlined">logout</span>
          </div>
          <p className="text-base font-medium uppercase tracking-widest text-xs">Cerrar Sesión</p>
        </button>
      </section>
    </div>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 items-center text-center">
    <p className="text-primary text-2xl font-tech font-bold">{value}</p>
    <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-wider">{label}</p>
  </div>
);

const ProfileLink = ({ icon, label }: { icon: string; label: string }) => (
  <div className="group flex items-center gap-4 px-4 min-h-[64px] justify-between rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="text-zinc-400 flex items-center justify-center rounded-xl bg-white/5 shrink-0 size-11">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-white text-sm font-bold uppercase tracking-widest">{label}</p>
    </div>
    <span className="material-symbols-outlined text-zinc-500">chevron_right</span>
  </div>
);

export default ProfileView;
