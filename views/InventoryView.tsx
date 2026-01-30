
import React, { useState, useMemo, useRef } from 'react';
import { InventoryItem } from '../types';
import { getDaysDiff, formatLocalDate } from '../utils/dateUtils';
import { useTranslation, Language } from '../utils/i18n';
import { getItemStatus } from '../utils/itemStatus';

interface InventoryViewProps {
    inventory: InventoryItem[];
    onAddItem: (name: string, quantity: number, unit: string, expiryDate?: string) => void;
    onDeleteItem: (id: string) => void;
    onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
    onStartGeneration: (ingredients: string[], portions: number, itemId?: string) => void;
    acceptedChallengeId?: string | null;
    onBack: () => void;
    language: Language;
}

const InventoryView: React.FC<InventoryViewProps> = ({
    inventory,
    onAddItem,
    onDeleteItem,
    onUpdateItem,
    onStartGeneration,
    acceptedChallengeId,
    onBack,
    language
}) => {
    const t = useTranslation(language);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: t('units_unidades'), expiryDate: '' });
    const [expiryDisplay, setExpiryDisplay] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateChange = (v: string) => {
        let cleaned = v.replace(/\D/g, '');
        if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        if (cleaned.length > 4) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4);
        }

        setExpiryDisplay(formatted);

        if (cleaned.length === 8) {
            const d = cleaned.slice(0, 2);
            const m = cleaned.slice(2, 4);
            const y = cleaned.slice(4);
            setNewItem(prev => ({ ...prev, expiryDate: `${y}-${m}-${d}` }));
        } else {
            setNewItem(prev => ({ ...prev, expiryDate: '' }));
        }
    };

    const filteredInventory = useMemo(() => {
        return inventory.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            if (!a.expiryDate) return 1;
            if (!b.expiryDate) return -1;
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        });
    }, [inventory, searchTerm]);

    // Helper for non-status items or logic that still needs a checked color
    const getStatusColor = (expiryDate?: string) => {
        if (!expiryDate) return 'text-zinc-500';
        const daysLeft = getDaysDiff(expiryDate);
        if (daysLeft < 0) return 'text-purple-600'; // Vencido
        if (daysLeft === 0) return 'text-red-500'; // Hoy
        if (daysLeft === 1) return 'text-orange-500'; // Mañana
        if (daysLeft <= 3) return 'text-green-500'; // Prox
        return 'text-primary';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.name) {
            onAddItem(newItem.name, newItem.quantity, newItem.unit, newItem.expiryDate || undefined);
            setNewItem({ name: '', quantity: 1, unit: t('units_unidades'), expiryDate: '' });
            setExpiryDisplay('');
            setIsAdding(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-app)' }} className="min-h-screen p-6">
            <header className="flex flex-col gap-6 mt-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }} className="w-10 h-10 rounded-full border flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">arrow_back</span>
                        </button>
                        <div>
                            <h2 style={{ color: 'var(--text-main)' }} className="text-2xl font-black tracking-tighter uppercase">{t('inventory_title')}<span className="text-primary">.IA</span></h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t('smart_management')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-11 h-11 bg-primary text-black rounded-xl flex items-center justify-center shadow-glow active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined font-black">add</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }} className="border p-4 rounded-2xl">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">inventory_2</span>
                            {t('total_items')}
                        </p>
                        <p style={{ color: 'var(--text-main)' }} className="text-2xl font-black">{inventory.length}</p>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-surface-soft)', borderColor: 'var(--card-border)' }} className="border p-4 rounded-2xl">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">timer</span>
                            {t('near_expiry')}
                        </p>
                        <p className="text-2xl font-black text-orange-500">
                            {inventory.filter(item => {
                                if (!item.expiryDate) return false;
                                const days = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                return days >= 0 && days <= 3;
                            }).length}
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500">search</span>
                    <input
                        type="text"
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-inner)', color: 'var(--text-main)', borderColor: 'var(--card-border)' }}
                        className="w-full border rounded-2xl py-4 pl-12 pr-4 text-sm placeholder-zinc-700 focus:border-primary/40 outline-none transition-all"
                    />
                </div>
            </header>

            {/* Inventory List */}
            <div className="space-y-3">
                {filteredInventory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div style={{ backgroundColor: 'var(--bg-surface-inner)', borderColor: 'var(--card-border)' }} className="w-16 h-16 rounded-full flex items-center justify-center border opacity-40">
                            <span className="material-symbols-outlined text-3xl text-zinc-500">inventory_2</span>
                        </div>
                        <p className="text-zinc-500 text-sm">{t('empty_inventory')}</p>
                    </div>
                ) : (
                    filteredInventory.map(item => {
                        const daysLeft = item.expiryDate
                            ? getDaysDiff(item.expiryDate)
                            : null;

                        // Use the new utility for consistency
                        const itemStatus = getItemStatus(item.expiryDate);

                        // We only apply the intense styling if it's expired, expires today/tomorrow, or is very close (<= 3 days)
                        // The 'Green' status for dates >= 2 applies here if daysLeft <= 3

                        const isExpired = daysLeft !== null && daysLeft < 0;
                        const isToday = daysLeft === 0;
                        const isTomorrow = daysLeft === 1;
                        const isNearExpiry = daysLeft !== null && daysLeft >= 2 && daysLeft <= 3;

                        // Determine active styles based on our logic
                        const activeStatus = (isExpired || isToday || isTomorrow || isNearExpiry) ? itemStatus : null;

                        const borderColor = activeStatus ? activeStatus.borderColorStyle : 'var(--card-border)';
                        const shadowClass = activeStatus?.shadowClass || (activeStatus ? '' : 'shadow-sm');
                        const animateClass = activeStatus?.effectClasses || '';

                        return (
                            <div key={item.id}
                                style={{ backgroundColor: 'var(--bg-surface)', borderColor: borderColor }}
                                className={`group relative flex items-center gap-4 p-4 rounded-3xl transition-all duration-500 border ${shadowClass} ${animateClass} ${!activeStatus ? 'hover:border-primary/20' : ''}`}>
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col">
                                            <h4 style={{ color: 'var(--text-main)' }} className="text-sm font-bold truncate uppercase tracking-tight">{item.name}</h4>

                                            {/* Status Text Logic */}
                                            {isExpired && itemStatus ? (
                                                <span className={`${itemStatus.textColorClass} text-[8px] font-black uppercase tracking-widest mt-0.5`}>● {t(itemStatus.statusKey as any)}</span>
                                            ) : isToday && itemStatus ? (
                                                <span className={`${itemStatus.textColorClass} text-[8px] font-black uppercase tracking-widest mt-0.5`}>● {t(itemStatus.statusKey as any)}</span>
                                            ) : isTomorrow && itemStatus ? (
                                                <span className={`${itemStatus.textColorClass} text-[8px] font-black uppercase tracking-widest mt-0.5`}>● {t(itemStatus.statusKey as any)}</span>
                                            ) : isNearExpiry && itemStatus ? (
                                                <span className={`${itemStatus.textColorClass} text-[8px] font-black uppercase tracking-widest mt-0.5`}>● {t(itemStatus.statusKey as any)}</span>
                                            ) : (isNearExpiry && item.id === acceptedChallengeId) ? (
                                                <button
                                                    onClick={() => onStartGeneration([item.name], 2, item.id)}
                                                    className="mt-1 px-2 py-0.5 bg-primary/20 border border-primary/40 text-primary text-[7px] font-black uppercase rounded tracking-widest hover:bg-primary hover:text-black transition-colors w-fit"
                                                >
                                                    {t('regenerate_challenge')}
                                                </button>
                                            ) : <span className="text-[9px] text-zinc-600 font-medium truncate">{t('added_on')} {new Date(item.createdAt).toLocaleDateString()}</span>}
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter block ${getStatusColor(item.expiryDate)}`}>
                                                {item.expiryDate ? formatLocalDate(item.expiryDate) : t('no_date')}
                                            </span>
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase">{item.quantity} {item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div style={{ backgroundColor: 'var(--bg-surface-inner)', borderColor: 'var(--card-border)' }} className="flex items-center gap-1 rounded-lg p-1 border transition-opacity">
                                        <button
                                            onClick={() => onUpdateItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                                            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">remove</span>
                                        </button>
                                        <button
                                            onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
                                            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-primary"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">add</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => onDeleteItem(item.id)}
                                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center active:scale-90 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Item Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300" style={{ backgroundColor: 'rgba(var(--bg-app-rgb), 0.95)' }}>
                    <form onSubmit={handleSubmit}
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--card-border)' }}
                        className="w-full max-w-sm max-h-[90vh] rounded-3xl p-8 border flex flex-col relative overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h3 style={{ color: 'var(--text-main)' }} className="text-xl font-black uppercase tracking-tighter">{t('new_item')}</h3>
                            <button type="button" onClick={() => {
                                setIsAdding(false);
                                setNewItem({ name: '', quantity: 1, unit: t('units_unidades'), expiryDate: '' });
                                setExpiryDisplay('');
                            }} className="text-zinc-500 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 px-1">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">{t('ingredient_label')}</label>
                                    <input
                                        autoFocus
                                        required
                                        type="text"
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        style={{ backgroundColor: 'var(--bg-surface-inner)', color: '#ffffff', borderColor: 'var(--card-border)' }}
                                        className="w-full border p-4 rounded-2xl text-sm focus:border-primary outline-none"
                                        placeholder={t('item_placeholder')}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">{t('qty')}</label>
                                        <input
                                            type="number"
                                            value={newItem.quantity}
                                            onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                            style={{ backgroundColor: 'var(--bg-surface-inner)', color: '#ffffff', borderColor: 'var(--card-border)' }}
                                            className="w-full border p-4 rounded-2xl text-sm focus:border-primary outline-none quantity-input-dark"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">{t('unit')}</label>
                                        <select
                                            value={newItem.unit}
                                            onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                            style={{ backgroundColor: 'var(--bg-surface-inner)', color: '#ffffff', borderColor: 'var(--card-border)' }}
                                            className="w-full border p-4 rounded-2xl text-sm focus:border-primary outline-none"
                                        >
                                            <option value="unidades">uds ({t('units_unidades')})</option>
                                            <option value="kg">kg ({t('units_kilos')})</option>
                                            <option value="g">g ({t('units_grams')})</option>
                                            <option value="L">L ({t('units_liters')})</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">{t('expiry_date_label')}</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="text"
                                            placeholder={t('date_format_placeholder')}
                                            value={expiryDisplay}
                                            onChange={e => handleDateChange(e.target.value)}
                                            style={{
                                                backgroundColor: 'var(--bg-surface-inner)',
                                                color: '#ffffff',
                                                borderColor: 'var(--card-border)'
                                            }}
                                            className="w-full border p-4 rounded-2xl text-sm focus:border-primary outline-none"
                                        />
                                        <div
                                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 hover:text-primary transition-colors flex items-center"
                                            onClick={() => dateInputRef.current?.showPicker()}
                                        >
                                            <span className="material-symbols-outlined text-xl">calendar_today</span>
                                        </div>
                                        <input
                                            type="date"
                                            ref={dateInputRef}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="absolute opacity-0 pointer-events-none"
                                            style={{ width: 0, height: 0, top: '50%', right: '1rem' }}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (val) {
                                                    const [y, m, d] = val.split('-');
                                                    setExpiryDisplay(`${d}/${m}/${y}`);
                                                    setNewItem(prev => ({ ...prev, expiryDate: val }));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary text-black rounded-xl font-bold uppercase text-xs tracking-widest shadow-glow mt-4"
                            >
                                {t('add_to_pantry_btn')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default InventoryView;
