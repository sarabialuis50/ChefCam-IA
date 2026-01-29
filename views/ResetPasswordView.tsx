import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ResetPasswordViewProps {
    onSuccess: () => void;
    onBack: () => void;
}

const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onSuccess, onBack }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        setLoading(false);

        if (error) {
            setError('Error al actualizar: ' + error.message);
        } else {
            alert('¡Contraseña actualizada con éxito!');
            onSuccess();
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-pure-black relative overflow-hidden">
            {/* Background Grids */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #39FF14 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>

            <main className="w-full max-w-md glass-card rounded-[3rem] p-10 relative z-10 border-primary/20">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 neon-glow border border-primary/30">
                        <span className="material-symbols-outlined text-4xl text-primary">lock_reset</span>
                    </div>
                    <h1 className="text-2xl font-tech font-bold text-white tracking-widest mb-3">
                        Nueva <span className="text-primary">Contraseña</span>
                    </h1>
                    <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Nueva Contraseña</label>
                        <div className="relative group rounded-xl border border-white/10 bg-white/5 focus-within:border-primary transition-all overflow-hidden">
                            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">lock</span>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="block w-full pl-12 pr-12 py-4 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-700 text-white"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white bg-transparent border-none cursor-pointer z-10"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                        <div className="relative group rounded-xl border border-white/10 bg-white/5 focus-within:border-primary transition-all overflow-hidden">
                            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-700 text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-black rounded-xl font-black uppercase tracking-[0.25em] text-[11px] neon-glow hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 border-none cursor-pointer"
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={onBack}
                        className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest bg-transparent border-none cursor-pointer"
                    >
                        Cancelar y volver
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ResetPasswordView;
