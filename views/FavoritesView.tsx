import React, { useState, useMemo, useRef } from 'react';
import { Recipe } from '../types';
import { getRecipeImage } from '../utils/imageUtils';
import { useTranslation, Language } from '../utils/i18n';

interface FavoritesViewProps {
  recipes: (Recipe & { category?: string })[];
  userTags?: string[];
  onRecipeClick: (recipe: Recipe) => void;
  onBack: () => void;
  language: Language;
}

const ImageWithPlaceholder: React.FC<{ recipe: Recipe, alt: string }> = ({ recipe, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const finalSrc = getRecipeImage(recipe, 200);

  return (
    <div style={{ backgroundColor: 'var(--bg-surface-inner)', borderColor: 'var(--card-border)' }} className="w-24 h-24 rounded-2xl border shadow-lg overflow-hidden relative flex-shrink-0">
      {!loaded && (
        <div style={{ backgroundColor: 'var(--bg-surface-inner)' }} className="absolute inset-0 animate-pulse flex items-center justify-center">
          <span className="material-symbols-outlined text-zinc-700 text-sm">image</span>
        </div>
      )}
      <img
        src={finalSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const FavoritesView: React.FC<FavoritesViewProps> = ({ recipes, onRecipeClick, onBack, userTags = [], language }) => {
  const t = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(t('all'));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast factor
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const defaultCategories = [t('all'), t('breakfast'), t('lunch'), t('dinner'), t('healthy'), t('vegan')];
  const allCategories = [...new Set([...defaultCategories, ...userTags])];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = activeCategory === t('all') || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchTerm, activeCategory]);

  return (
    <div className="p-6 pb-6">
      <header className="flex flex-col gap-6 mt-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }}
              className="w-10 h-10 rounded-full border flex items-center justify-center active:scale-90 transition-all mr-2"
            >
              <span className="material-symbols-outlined text-primary text-xl">arrow_back</span>
            </button>
            <h1 style={{ color: 'var(--text-main)' }} className="text-2xl font-black tracking-tighter uppercase">{t('favorites_title')}<span className="text-primary">.IA</span></h1>
          </div>
          <div className="px-3 py-1 bg-primary/20 rounded-full border border-primary/30 text-[10px] font-black text-primary uppercase">
            {filteredRecipes.length} {t('recipe_count')}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary">search</span>
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: 'var(--bg-surface-inner)', color: 'var(--text-main)', borderColor: 'var(--card-border)' }}
            className="w-full border rounded-2xl py-4 pl-12 pr-4 text-sm placeholder-zinc-500 focus:border-primary/40 outline-none transition-all"
          />
        </div>

        {/* Categories Tabs - Scrollable structure to fit many tags */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-2 overflow-x-auto pb-4 px-1 custom-scrollbar w-full no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}`}
        >
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                if (!isDragging) setActiveCategory(cat);
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border pointer-events-auto hover:bg-primary/10 ${activeCategory === cat
                ? 'shadow-lg shadow-primary/20'
                : ''
                }`}
              style={{
                backgroundColor: activeCategory === cat ? '#39FF14' : 'var(--bg-surface-soft)',
                borderColor: activeCategory === cat ? '#39FF14' : 'var(--card-border)',
                color: activeCategory === cat ? '#000000' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {filteredRecipes.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }} className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div style={{ backgroundColor: 'var(--bg-surface-inner)', borderColor: 'var(--card-border)' }} className="w-20 h-20 rounded-full border flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl opacity-20">favorite_border</span>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1">{t('no_fav_title')}</p>
            <p className="text-xs">{t('no_fav_desc')}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecipes.map((recipe, idx) => (
            <div
              key={recipe.id || idx}
              onClick={() => onRecipeClick(recipe)}
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--card-border)' }}
              className="group relative flex items-center gap-4 p-4 rounded-3xl transition-all cursor-pointer border shadow-xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

              <div className="relative">
                <ImageWithPlaceholder recipe={recipe} alt={recipe.title} />
                {recipe.category && (
                  <div className="absolute -top-1 -left-1 px-2 py-0.5 bg-primary text-black rounded border border-primary/20 text-[7px] font-black uppercase tracking-widest shadow-glow">
                    {recipe.category}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 z-10 space-y-2">
                <div>
                  <h4 style={{ color: 'var(--text-main)' }} className="text-[11px] font-bold uppercase tracking-tight leading-tight line-clamp-2">{recipe.title}</h4>
                  <p className="text-zinc-500 text-[10px] italic line-clamp-2 leading-relaxed mt-1">
                    {recipe.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary/60">schedule</span>
                    <span style={{ color: 'var(--text-muted)' }} className="text-[9px] font-bold uppercase tracking-tighter">{recipe.prepTime || '20 min'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary/60">restaurant</span>
                    <span style={{ color: 'var(--text-muted)' }} className="text-[9px] font-bold uppercase tracking-tighter">{recipe.difficulty || 'Fácil'}</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-zinc-700 group-hover:text-primary transition-colors pr-2">play_circle</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
