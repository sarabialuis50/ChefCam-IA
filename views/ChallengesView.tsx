import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { useTranslation, Language } from '../utils/i18n';

interface ChallengesViewProps {
    onBack: () => void;
    onAcceptChallenge: (item: InventoryItem) => void;
    onViewInventory?: () => void;
    inventory: InventoryItem[];
    language: Language;
}

const ChallengesView: React.FC<ChallengesViewProps> = ({ onBack, onAcceptChallenge, onViewInventory, inventory, language }) => {
    const t = useTranslation(language);
    const [searchQuery, setSearchQuery] = useState('');

    const expiringItems = inventory
        .filter(item => {
            if (!item.expiryDate) return false;
            const days = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return days >= 0 && days <= 7; // Buscamos productos que vencen en la próxima semana
        })
        .sort((a, b) => {
            const daysA = new Date(a.expiryDate!).getTime();
            const daysB = new Date(b.expiryDate!).getTime();
            return daysA - daysB;
        })
        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={{ backgroundColor: 'var(--bg-app)' }} className="min-h-screen pb-1">
            {/* Header */}
            <header style={{ backgroundColor: 'rgba(var(--bg-app-rgb), 0.8)', borderColor: 'var(--card-border)' }} className="sticky top-0 z-50 backdrop-blur-xl border-b p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }} className="w-10 h-10 rounded-full flex items-center justify-center border">
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                    </button>
                    <h2 style={{ color: 'var(--text-main)' }} className="text-2xl font-black uppercase tracking-tighter">{t('challenges_title')}<span className="text-primary">.IA</span></h2>
                </div>
                <div className="px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{expiringItems.length} {t('challenges_count')}</span>
                </div>
            </header>

            <main className="p-6 space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary opacity-60">search</span>
                    <input
                        type="text"
                        placeholder={t('search_challenges')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-inner)', color: 'var(--text-main)', borderColor: 'var(--card-border)' }}
                        className="w-full border rounded-2xl py-4 pl-12 pr-4 text-sm placeholder-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                {/* List of Challenges */}
                <div className="space-y-4">
                    {expiringItems.length > 0 ? (
                        expiringItems.map((item) => {
                            const days = Math.ceil((new Date(item.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const urgencyColor = days <= 1 ? 'text-red-500' : days <= 3 ? 'text-orange-500' : 'text-primary';

                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: 'var(--bg-surface)',
                                        borderColor: days <= 1 ? 'rgba(239, 68, 68, 0.4)' : 'var(--card-border)',
                                        boxShadow: 'none'
                                    }}
                                    className="rounded-[2.5rem] p-6 border relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500"
                                >
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>

                                    <div className="flex flex-col gap-5 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`material-symbols-outlined text-sm ${urgencyColor}`}>alarm</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${urgencyColor}`}>
                                                        {days === 0 ? t('expires_today') : days === 1 ? t('expires_tomorrow') : `${t('expires_in')} ${days} ${t('days')}`}
                                                    </span>
                                                </div>
                                                <h3 style={{ color: 'var(--text-main)' }} className="text-xl font-black uppercase italic tracking-tight">
                                                    {t('resurrect_your')} <span className="text-primary">{item.name}</span>
                                                </h3>
                                            </div>
                                            <div style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }} className="w-12 h-12 rounded-2xl border flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">skillet</span>
                                            </div>
                                        </div>

                                        <p style={{ color: 'var(--text-muted)' }} className="text-[11px] font-medium leading-relaxed max-w-[90%]">
                                            {t('avoid_waste')}
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => onAcceptChallenge(item)}
                                                className="flex-[1.5] bg-primary text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95 transition-all whitespace-nowrap"
                                                style={{ backgroundColor: '#39FF14' }}
                                            >
                                                {t('accept_challenge')}
                                            </button>
                                            <button
                                                onClick={onViewInventory}
                                                style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
                                                className="flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border active:scale-95 transition-all whitespace-nowrap"
                                            >
                                                {t('leave_for_later')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                            <span className="material-symbols-outlined text-6xl">inventory</span>
                            <p className="text-xs font-bold uppercase tracking-widest">{t('no_challenges')}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ChallengesView;
