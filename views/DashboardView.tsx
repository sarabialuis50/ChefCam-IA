
import React, { useState, useRef } from 'react';
import { Recipe } from '../types';
import { analyzeIngredientImage } from '../services/geminiService';

interface DashboardViewProps {
  user: any;
  recentRecipes: Recipe[];
  onScanClick: () => void;
  onRecipeClick: (recipe: Recipe) => void;
  onGenerate: (recipes: Recipe[]) => void;
  onStartGeneration: (ingredients: string[], portions: number) => void;
  onExploreClick: () => void;
  onNotificationsClick: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  user, 
  recentRecipes, 
  onScanClick, 
  onRecipeClick, 
  onGenerate, 
  onStartGeneration, 
  onExploreClick,
  onNotificationsClick
}) => {
  const [manualInput, setManualInput] = useState('');
  const [portions, setPortions] = useState(2);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!manualInput.trim()) return;
    onStartGeneration(manualInput.split(',').map(i => i.trim()), portions);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const identifiedIngredients = await analyzeIngredientImage(base64);
        
        if (identifiedIngredients && identifiedIngredients.length > 0) {
          const names = identifiedIngredients.map(i => i.name).join(', ');
          setManualInput(prev => prev ? `${prev}, ${names}` : names);
        } else {
          alert("No pudimos identificar ingredientes claros en esta imagen. Por favor, intenta con otra foto.");
        }
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error analyzing uploaded file:", error);
      setAnalyzing(false);
    }
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetSystem = () => {
    setManualInput('');
    setPortions(2);
  };

  return (
    <div className="flex flex-col bg-pure-black min-h-full p-5 space-y-8 pb-10">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(57,255,20,0.4)]">
             <span className="material-symbols-outlined text-primary text-2xl font-bold">restaurant</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Status: Online</span>
            <h2 className="text-white font-bold text-lg leading-none">Chef {user?.name || 'Alejandro'}</h2>
          </div>
        </div>
        <button 
          onClick={onNotificationsClick}
          className="w-12 h-12 bg-zinc-900/50 rounded-xl border border-white/5 flex items-center justify-center relative active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-zinc-400">notifications</span>
          <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full neon-glow"></span>
        </button>
      </header>

      {/* Hero Branding */}
      <div className="space-y-1">
        <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
          CHEF<span className="text-primary italic">CAM.IA</span>
        </h1>
        <p className="text-primary font-medium text-xs">Transforma tus ingredientes en obras maestras.</p>
      </div>

      {/* Ingredient Image Section */}
      <section className="bg-[#0A0A0A] border border-zinc-800 rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">photo_camera</span>
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">Imagen de ingredientes</h3>
        </div>
        
        {/* Preview Box - At the Top */}
        <div className="w-full h-48 border-2 border-dashed border-primary/30 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 bg-black/40 relative overflow-hidden">
           {analyzing ? (
             <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Analizando Red Neuronal...</span>
             </div>
           ) : (
             <>
               <span className="material-symbols-outlined text-primary text-4xl opacity-50">frame_inspect</span>
               <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Esperando entrada visual...</span>
             </>
           )}
        </div>

        {/* Unified Button - Now full width and primary style */}
        <button 
          onClick={handleUploadClick}
          disabled={analyzing}
          className="w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(57,255,20,0.4)] uppercase text-sm active:scale-95 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined font-black text-xl">{analyzing ? 'sync' : 'upload'}</span>
          {analyzing ? 'Analizando...' : 'Subir Foto'}
        </button>

        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.15em] text-center pt-1">
          Escaneo inteligente de red neuronal activado.
        </p>
      </section>

      {/* Suggested Recipes Section */}
      <section className="bg-[#0A0A0A] border border-zinc-800 rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">Recetas sugeridas</h3>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block ml-1">Entrada manual:</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary opacity-60">local_activity</span>
              <input 
                type="text" 
                placeholder="Ej: pollo, arroz, verduras"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full bg-black border border-primary/40 rounded-2xl py-5 pl-12 pr-4 text-sm text-white placeholder-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-black border border-primary/40 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-white font-black text-xs uppercase tracking-widest">Porciones:</span>
            <div className="flex items-center gap-6 bg-zinc-900/50 rounded-xl px-4 py-1.5 border border-white/5">
               <button onClick={() => setPortions(Math.max(1, portions - 1))} className="text-zinc-500 hover:text-primary transition-colors">
                 <span className="material-symbols-outlined text-xl">remove</span>
               </button>
               <span className="text-primary font-black text-xl w-4 text-center">{portions}</span>
               <button onClick={() => setPortions(portions + 1)} className="text-zinc-500 hover:text-primary transition-colors">
                 <span className="material-symbols-outlined text-xl">add</span>
               </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              onClick={handleGenerate}
              disabled={loading || analyzing || (!manualInput.trim())}
              className="w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(57,255,20,0.4)] uppercase text-sm active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined font-bold">{loading ? 'sync' : 'rocket_launch'}</span>
              {loading ? "Generando..." : "Generar Recetas"}
            </button>
            
            <button 
              onClick={resetSystem}
              className="w-full bg-transparent border-2 border-zinc-800 text-zinc-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-[11px] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Reiniciar Sistema
            </button>
          </div>
        </div>
      </section>

      {/* Recent Discoveries */}
      <section className="space-y-4 pt-2 pb-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-white font-bold uppercase tracking-[0.15em] text-[11px]">Descubrimientos recientes</h3>
          <button onClick={onExploreClick} className="text-primary text-[10px] font-black uppercase tracking-tighter hover:underline">Ver Todo</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4">
          {recentRecipes.length > 0 ? recentRecipes.map((recipe, idx) => (
            <button key={recipe.id} onClick={() => onRecipeClick(recipe)} className="flex-shrink-0 w-40 space-y-3 group">
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900">
                <img 
                  src={`https://picsum.photos/seed/${recipe.id}/300/300?grayscale`} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                />
              </div>
              <p className="text-primary font-black text-[10px] uppercase tracking-widest text-center truncate px-2 group-hover:neon-text-glow">
                {recipe.title}
              </p>
            </button>
          )) : (
            <>
              <DiscoveryCard image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300" title="Pasta Pomodoro" onClick={onExploreClick} />
              <DiscoveryCard image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300" title="Ensalada Verde" onClick={onExploreClick} />
              <DiscoveryCard image="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300" title="Salmón Parri" onClick={onExploreClick} />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const DiscoveryCard = ({ image, title, onClick }: { image: string, title: string, onClick?: () => void }) => (
  <div className="flex-shrink-0 w-40 space-y-3 cursor-pointer" onClick={onClick}>
    <div className="w-40 h-40 rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
      <img src={image} className="w-full h-full object-cover grayscale opacity-60" />
    </div>
    <p className="text-primary font-black text-[10px] uppercase tracking-widest text-center truncate px-2 leading-tight">{title}</p>
  </div>
);

export default DashboardView;
