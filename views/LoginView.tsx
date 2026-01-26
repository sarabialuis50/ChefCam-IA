
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ 
      name: email.split('@')[0] || "Chef", 
      email, 
      isPremium: false 
    });
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-pure-black relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #39FF14 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] pointer-events-none"></div>

      <main className="w-full max-w-md glass-card rounded-[3rem] p-10 relative z-10 border-primary/20">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-pure-black rounded-3xl border border-primary/30 flex items-center justify-center mb-6 neon-glow overflow-hidden relative">
            <span className="material-symbols-outlined text-primary text-6xl">photo_camera</span>
            <span className="material-symbols-outlined text-primary text-3xl absolute top-6" style={{ fontVariationSettings: "'FILL' 1" }}>cooking</span>
          </div>
          <h1 className="text-3xl font-tech font-bold text-white tracking-widest mb-3 uppercase">
            ChefCam<span className="text-primary">.IA</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
            Recetas saludables creadas con IA para tu bienestar diario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Email de Acceso</label>
            <div className="relative group rounded-xl border border-white/10 bg-white/5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">alternate_email</span>
              </span>
              <input 
                type="email" 
                required
                className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-700"
                placeholder="usuario@chefcam.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative group rounded-xl border border-white/10 bg-white/5 focus-within:border-primary transition-all">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">lock</span>
              </span>
              <input 
                type="password" 
                className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-700"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end pt-1">
              <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-black rounded-xl font-black uppercase tracking-[0.25em] text-[11px] shadow-neon-glow hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="px-4 bg-[#0a0a0a] text-gray-600 font-bold uppercase tracking-[0.25em]">O CONTINUAR CON</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center px-4 py-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest">
          <img src="https://lh3.googleusercontent.com/COxitqSgS1P-B82qs9n95v-9Y98777n50d6P_wO9p2D6p7S-N_D-S459n_f_N-o-N" alt="Google" className="w-4 h-4 mr-3" />
          Google ID
        </button>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
            ¿NUEVO EN CHEFCAM? 
            <a href="#" className="ml-2 font-black text-primary hover:underline">REGÍSTRATE</a>
          </p>
        </div>
      </main>
      
      <footer className="mt-10">
        <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.4em]">© 2026 ChefCam System v2.5</p>
      </footer>
    </div>
  );
};

export default LoginView;
