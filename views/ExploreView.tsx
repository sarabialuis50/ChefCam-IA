import React, { useState } from 'react';
import { Recipe } from '../types';
import { getRecipeImage } from '../utils/imageUtils';
import { useTranslation, Language } from '../utils/i18n';
import { formatPrepTime } from '../utils/recipeUtils';

interface ExploreViewProps {
  onBack: () => void;
  onRecipeClick: (recipe: Recipe) => void;
  language: Language;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onBack, onRecipeClick, language }) => {
  const t = useTranslation(language);
  const [activeFilter, setActiveFilter] = useState(t('all').toUpperCase());

  const mockRecipes: Partial<Recipe>[] = [
    { id: '1', title: 'FUSILLI PESTO NEÓN', prepTime: '12 MINS', matchPercentage: 98, imageUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'POKE BOWL CIBERNÉTICO', prepTime: '15 MINS', matchPercentage: 85, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400' },
    { id: '3', title: 'DADOS DE TOFU PICANTES', prepTime: '20 MINS', category: 'Keto', imageUrl: 'https://images.unsplash.com/photo-1546069901-e0183f0f07c7?auto=format&fit=crop&q=80&w=400' },
    { id: '4', title: 'MEZCLA ENERGÉTICA MATCHA', prepTime: '05 MINS', category: 'Vegano', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
    { id: '5', title: 'SALTEADO DE VEGETALES TECH', prepTime: '10 MINS', imageUrl: 'https://images.unsplash.com/photo-1512058560550-42749359a767?auto=format&fit=crop&q=80&w=400' },
    { id: '6', title: 'ENSALADA MATRIX DE AGUACATE', prepTime: '08 MINS', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
  ];

  const filters = [t('all').toUpperCase(), t('vegan'), t('rapid'), t('keto')];

  return (
    <div style={{ backgroundColor: 'var(--bg-app)' }} className="flex flex-col min-h-full p-5 space-y-6 pb-6">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full border border-card-border bg-surface-soft flex items-center justify-center mr-2">
            <span className="material-symbols-outlined text-primary text-xl">arrow_back</span>
          </button>
          <div>
            <h1 style={{ color: 'var(--text-main)' }} className="font-bold text-xl uppercase tracking-wider font-outfit">{t('explore_recipes_title')}</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('sub_explorar')}</p>
          </div>
        </div>
        <button style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }} className="w-10 h-10 rounded-full border flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">tune</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500">search</span>
        <input
          type="text"
          placeholder={t('search_explore_placeholder')}
          style={{ backgroundColor: 'var(--bg-surface-inner)', color: 'var(--text-main)', borderColor: 'var(--card-border)' }}
          className="w-full border rounded-xl py-4 pl-12 pr-4 text-sm placeholder-zinc-700 outline-none focus:border-primary/50 transition-all"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeFilter === filter
              ? 'bg-primary text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]'
              : 'border'
              }`}
            style={{
              backgroundColor: activeFilter === filter ? 'var(--primary)' : 'var(--bg-surface-soft)',
              borderColor: 'var(--card-border)',
              color: activeFilter === filter ? '#000' : 'var(--text-main)'
            }}
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
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--card-border)' }}
            className="border rounded-[2rem] overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <div className="relative aspect-square">
              <img
                src={getRecipeImage(recipe as Recipe, 400)}
                className="w-full h-full object-cover"
                alt={recipe.title}
              />
              {recipe.matchPercentage && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-primary/40 px-2 py-1 rounded-md">
                  <span className="text-primary text-[8px] font-black uppercase tracking-tighter">{recipe.matchPercentage}% {t('match_label')}</span>
                </div>
              )}
              {recipe.category && (
                <div className={`absolute top-2 right-2 border px-2 py-1 rounded-md backdrop-blur-md ${recipe.category === 'Keto' ? 'bg-black/60 border-primary/40 text-primary' : 'bg-green-600/60 border-green-400/40 text-white'
                  }`}>
                  <span className="text-[8px] font-black uppercase tracking-tighter">{recipe.category}</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-xs uppercase leading-tight tracking-wide min-h-[2.5rem] line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                <span className="text-primary font-black text-[10px] uppercase tracking-tighter">
                  {formatPrepTime(recipe.prepTime)}
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
