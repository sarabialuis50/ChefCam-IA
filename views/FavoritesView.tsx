
import React from 'react';
import { Recipe } from '../types';

interface FavoritesViewProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ recipes, onRecipeClick }) => {
  return (
    <div className="p-6">
      <header className="flex items-center justify-between mt-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
          <h1 className="text-2xl font-bold tracking-tight">Favoritos</h1>
        </div>
        <div className="bg-primary/20 border border-primary/30 px-4 py-1 rounded-full">
          <span className="text-primary text-sm font-bold">{recipes.length} Recetas</span>
        </div>
      </header>
      
      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600 text-center space-y-4">
          <div className="w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl opacity-30">heart_broken</span>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">Aún no tienes favoritos</p>
          <p className="text-xs max-w-[200px]">Explora recetas y presiona el corazón para guardarlas aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <button 
              key={recipe.id}
              onClick={() => onRecipeClick(recipe)}
              className="w-full glass-card rounded-2xl p-4 flex gap-4 text-left group transition-all hover:border-primary/30"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                <img src={`https://picsum.photos/seed/${recipe.id}/200/200`} alt={recipe.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-lg font-bold leading-tight line-clamp-2 uppercase">{recipe.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary/80 text-[8px] font-bold px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 uppercase tracking-widest">Saludable</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                   <p className="text-zinc-500 text-[10px] font-bold flex items-center gap-1 uppercase">
                     <span className="material-symbols-outlined text-xs">schedule</span>
                     {recipe.prepTime} • {recipe.difficulty}
                   </p>
                   <span className="material-symbols-outlined text-primary text-lg">play_circle</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
