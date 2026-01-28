import React from 'react';
import { Recipe } from '../types';
import { getRecipeImage } from '../utils/imageUtils';

interface NutritionalDetailViewProps {
    recipe: Recipe | null;
    onBack: () => void;
}

const NutritionalDetailView: React.FC<NutritionalDetailViewProps> = ({ recipe, onBack }) => {
    if (!recipe) return null;

    // Mock micronutrients data for the demo
    const micronutrients = [
        { name: 'Vitamina A', value: 15, unit: '%' },
        { name: 'Vitamina C', value: 85, unit: '%' },
        { name: 'Calcio', value: 10, unit: '%' },
        { name: 'Hierro', value: 20, unit: '%' },
        { name: 'Potasio', value: 12, unit: 'mg' },
        { name: 'Magnesio', value: 8, unit: '%' },
    ];

    return (
        <div className="min-h-screen bg-pure-black pb-12">
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Informe Nutricional</h1>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Análisis Detallado por Porción</p>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Nutritional Card */}
                <section className="bg-surface-dark border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    {/* Header Section with Image */}
                    <div className="h-[280px] w-full relative">
                        <img
                            src={getRecipeImage(recipe, 400)}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
                    </div>

                    <div className="p-8 space-y-6 relative z-10 bg-surface-dark">
                        <div className="space-y-3">
                            <div className="text-left">
                                <h2 className="text-xl font-black uppercase tracking-normal text-white px-2 leading-tight">{recipe.title}</h2>
                            </div>

                            {/* Info Grid - Exact match to RecipeDetailView */}
                            <div className="grid grid-cols-4 gap-3 py-2">
                                <div className="bg-surface-dark/60 p-4 rounded-3xl border border-white/5 text-center shadow-inner hover:border-primary/20 transition-all">
                                    <p className="text-primary text-sm font-black tracking-tight">{recipe.calories?.toString().replace(/kcal/i, '').trim() || 'N/A'}</p>
                                    <p className="text-[8px] text-zinc-600 uppercase font-black mt-1 tracking-widest">Kcal</p>
                                </div>
                                <div className="bg-surface-dark/60 p-4 rounded-3xl border border-white/5 text-center shadow-inner hover:border-primary/20 transition-all">
                                    <p className="text-primary text-sm font-black tracking-tight">{recipe.protein || 'N/A'}</p>
                                    <p className="text-[8px] text-zinc-600 uppercase font-black mt-1 tracking-widest">Prot</p>
                                </div>
                                <div className="bg-surface-dark/60 p-4 rounded-3xl border border-white/5 text-center shadow-inner hover:border-primary/20 transition-all">
                                    <p className="text-primary text-sm font-black tracking-tight">{recipe.carbs || 'N/A'}</p>
                                    <p className="text-[8px] text-zinc-600 uppercase font-black mt-1 tracking-widest">Carb</p>
                                </div>
                                <div className="bg-surface-dark/60 p-4 rounded-3xl border border-white/5 text-center shadow-inner hover:border-primary/20 transition-all">
                                    <p className="text-primary text-sm font-black tracking-tight">{recipe.fat || 'N/A'}</p>
                                    <p className="text-[8px] text-zinc-600 uppercase font-black mt-1 tracking-widest">Grasa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Micronutrients Grid */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <span className="material-symbols-outlined text-primary">biotech</span>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Micronutrientes y Vitaminas</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {micronutrients.map((micro, idx) => (
                            <div key={idx} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{micro.name}</span>
                                    <span className="text-[10px] font-black text-primary">{micro.value}{micro.unit}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary/50 shadow-[0_0_8px_rgba(57,255,20,0.3)]"
                                        style={{ width: `${micro.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Premium Badge */}
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black">
                        <span className="material-symbols-outlined font-black">verified</span>
                    </div>
                    <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">Análisis IA Certificado</p>
                        <p className="text-[10px] text-zinc-500">Este informe ha sido generado y verificado por el modelo neuronal de ChefScan.IA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionalDetailView;
