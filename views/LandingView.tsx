
import React from 'react';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-pure-black flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=1024" 
          alt="Food background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-pure-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-12">
        <header className="flex justify-between items-center w-full absolute top-0 left-0 p-8">
           <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-black font-bold">smart_toy</span>
            </div>
            <span className="font-outfit font-bold text-2xl tracking-tight">ChefCam<span className="text-primary">.AI</span></span>
          </div>
          <button className="px-4 py-2 bg-primary text-black rounded-full text-xs font-bold neon-glow">
            Descargar App
          </button>
        </header>

        <div className="space-y-6 pt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Tecnología de Visión IA</span>
          </div>
          
          <h1 className="font-outfit font-extrabold text-5xl lg:text-7xl leading-[1.1] tracking-tight">
            Transforma tus <br/>
            <span className="text-primary neon-text-glow">ingredientes</span> <br/>
            en obras maestras.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed font-light max-w-sm">
            Nuestra IA avanzada reconoce visualmente lo que tienes en tu refrigerador y diseña la receta gourmet perfecta para ti en cuestión de segundos.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onStart}
              className="w-full py-4 bg-primary text-black rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 flex items-center justify-center group active:scale-[0.98] transition-all"
            >
              Comenzar ahora
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button className="w-full py-4 glass-card rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Ya tengo una cuenta
            </button>
          </div>
        </div>

        <div className="pt-8 flex items-center gap-8 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">98%</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Precisión IA</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">500k+</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Recetas Creadas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
