
import React, { useState } from 'react';
import { Recipe } from '../types';

interface ExploreViewProps {
  onBack: () => void;
  onRecipeClick: (recipe: Recipe) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onBack, onRecipeClick }) => {
  const [activeFilter, setActiveFilter] = useState('TODOS');

  const mockRecipes: Partial<Recipe>[] = [
    { id: '1', title: 'FUSILLI PESTO NEÓN', prepTime: '12 MINS', matchPercentage: 98, imageUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'POKE BOWL CIBERNÉTICO', prepTime: '15 MINS', matchPercentage: 85, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400' },
    { id: '3', title: 'DADOS DE TOFU PICANTES', prepTime: '20 MINS', category: 'Keto', imageUrl: 'https://images.unsplash.com/photo-1546069901-e0183f0f07c7?auto=format&fit=crop&q=80&w=400' },
    { id: '4', title: 'MEZCLA ENERGÉTICA MATCHA', prepTime: '05 MINS', category: 'Vegano', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
    { id: '5', title: 'SALTEADO DE VEGETALES TECH', prepTime: '10 MINS', imageUrl: 'https://images.unsplash.com/photo-1512058560550-42749359a767?auto=format&fit=crop&q=80&w=400' },
    { id: '6', title: 'ENSALADA MATRIX DE AGUACATE', prepTime: '08 MINS', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
  ];

  const filters = ['TODOS', 'Vegano', 'Rápido', 'Keto'];

  return (
    <div className="flex flex-col bg-pure-black min-h-full p-5 space-y-6 pb-32">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl font-bold">chevron_left</span>
          </button>
          <h1 className="text-white font-bold text-xl uppercase tracking-wider font-outfit">Explorar Recetas</h1>
        </div>
        <button className="w-10 h-10 bg-zinc-900/50 rounded-full border border-white/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">tune</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500">search</span>
        <input 
          type="text" 
          placeholder="Buscar por ingrediente o plato..."
          className="w-full bg-black border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm text-zinc-400 placeholder-zinc-700 outline-none focus:border-primary/50 transition-all"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeFilter === filter 
                ? 'bg-primary text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]' 
                : 'bg-zinc-900/50 text-white border border-zinc-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mockRecipes.map((recipe) => (
          <div 
            key={recipe.id}
            onClick={() => onRecipeClick(recipe as Recipe)}
            className="bg-[#0A0A0A] border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-all"
          >
            <div className="relative aspect-square">
              <img 
                src={recipe.imageUrl} 
                className="w-full h-full object-cover" 
                alt={recipe.title} 
              />
              {recipe.matchPercentage && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-primary/40 px-2 py-1 rounded-md">
                   <span className="text-primary text-[8px] font-black uppercase tracking-tighter">{recipe.matchPercentage}% MATCH</span>
                </div>
              )}
              {recipe.category && (
                <div className={`absolute top-2 right-2 border px-2 py-1 rounded-md backdrop-blur-md ${
                  recipe.category === 'Keto' ? 'bg-black/60 border-primary/40 text-primary' : 'bg-green-600/60 border-green-400/40 text-white'
                }`}>
                   <span className="text-[8px] font-black uppercase tracking-tighter">{recipe.category}</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-white font-bold text-xs uppercase leading-tight tracking-wide min-h-[2.5rem] line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                <span className="text-primary font-black text-[10px] uppercase tracking-tighter">
                  {recipe.prepTime}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreView;
