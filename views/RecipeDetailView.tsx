
import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeDetailViewProps {
  recipe: Recipe | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  isPremium?: boolean;
}

const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, isFavorite, onToggleFavorite, onBack, isPremium }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (!recipe) return null;

  const handleNutritionClick = () => {
    if (!isPremium) setShowPremiumModal(true);
  };

  return (
    <div className="min-h-screen bg-pure-black pb-12">
      <div className="relative h-96 w-full">
        <img 
          src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/800/800`} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-pure-black/20 to-transparent"></div>
        
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
          <button 
            onClick={onToggleFavorite}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isFavorite ? 'bg-primary/20 border-primary text-primary' : 'bg-black/40 border-white/10 text-white'}`}
          >
            <span className={`material-symbols-outlined ${isFavorite ? 'fill-icon' : ''}`} style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "" }}>
              favorite
            </span>
          </button>
        </header>

        <div className="absolute bottom-0 left-0 p-6 space-y-2">
          <div className="inline-flex px-2 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold uppercase">
             {recipe.matchPercentage || 100}% Match
          </div>
          <h1 className="text-3xl font-bold font-tech uppercase">{recipe.title}</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Info Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-surface-dark p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-primary text-sm font-bold">{recipe.calories || 'N/A'}</p>
            <p className="text-[8px] text-zinc-500 uppercase font-bold mt-1">Kcal</p>
          </div>
          <div className="bg-surface-dark p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-primary text-sm font-bold">{recipe.prepTime}</p>
            <p className="text-[8px] text-zinc-500 uppercase font-bold mt-1">Tiempo</p>
          </div>
          <div className="bg-surface-dark p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-primary text-sm font-bold">{recipe.difficulty || 'Fácil'}</p>
            <p className="text-[8px] text-zinc-500 uppercase font-bold mt-1">Nivel</p>
          </div>
          <div className="bg-surface-dark p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-primary text-sm font-bold">{recipe.portions || 1}</p>
            <p className="text-[8px] text-zinc-500 uppercase font-bold mt-1">Pers.</p>
          </div>
        </div>

        {/* Nutrition Banner */}
        <button 
          onClick={handleNutritionClick}
          className="w-full p-4 glass-card rounded-2xl flex items-center justify-between border-primary/20 group"
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:neon-glow">
                <span className="material-symbols-outlined text-lg">info</span>
             </div>
             <div className="text-left">
               <p className="text-xs font-bold uppercase tracking-wider">Informe Nutricional</p>
               <p className="text-[10px] text-zinc-500">Hazte PRO para ver detalles completos</p>
             </div>
          </div>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
        </button>

        {/* Ingredients */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Ingredientes</h2>
          <ul className="space-y-3">
            {(recipe.ingredients || []).length > 0 ? recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-center gap-3 text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span className="text-sm">{ing}</span>
              </li>
            )) : (
              <li className="text-zinc-500 text-xs italic">No hay ingredientes listados.</li>
            )}
          </ul>
        </section>

        {/* Preparation */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Preparación</h2>
          <div className="space-y-6">
            {(recipe.instructions || []).length > 0 ? recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary text-black font-black flex items-center justify-center text-sm">
                  {idx + 1}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{step}</p>
              </div>
            )) : (
              <p className="text-zinc-500 text-xs italic">Instrucciones no disponibles para esta receta de exploración.</p>
            )}
          </div>
        </section>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-pure-black/90 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card rounded-3xl p-8 border-primary/30 space-y-6 text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto neon-glow">
               <span className="material-symbols-outlined text-4xl">workspace_premium</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-tech font-bold uppercase tracking-tight">Acceso Premium</h3>
              <p className="text-zinc-400 text-sm">Desbloquea informe nutricional completo, recetas ilimitadas y tu Agente Chef IA personal.</p>
            </div>
            <div className="grid gap-3 pt-2">
              <button className="w-full py-4 bg-primary text-black rounded-xl font-bold uppercase text-xs tracking-widest neon-glow">
                Subir a PRO • $9.99/mes
              </button>
              <button onClick={() => setShowPremiumModal(false)} className="w-full py-4 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                Tal vez más tarde
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailView;
