
import React from 'react';
import { supabase } from '../lib/supabase';
import { getRedirectUrl } from '../lib/auth';

interface AuthRedirectViewProps {
    onBack: () => void;
}

const AuthRedirectView: React.FC<AuthRedirectViewProps> = ({ onBack }) => {
    const handleGoogleLogin = async () => {
        const redirectTo = getRedirectUrl();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    prompt: 'select_account',
                    access_type: 'offline'
                }
            }
        });
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-app)' }} className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Grids */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #39FF14 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] pointer-events-none"></div>

            <main style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--card-border)' }} className="w-full max-w-md rounded-[3rem] p-10 relative z-10 border shadow-2xl">
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 text-zinc-600 hover:text-white transition-colors z-[50] flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
                >
                    <span className="material-symbols-outlined text-sm text-primary">arrow_back</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Volver</span>
                </button>

                <div className="flex flex-col items-center text-center mb-10">
                    <div style={{ backgroundColor: 'var(--bg-surface-inner)', borderColor: 'rgba(var(--primary-rgb), 0.3)' }} className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 neon-glow border overflow-hidden">
                        <img src="/landing-logo.png" alt="ChefScan Logo" className="w-14 h-14 object-contain relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter drop-shadow-lg mb-4">
                        <span style={{ color: 'var(--text-main)' }}>Acceso</span> <span className="text-primary">Seguro</span>
                    </h2>
                    <div className="space-y-4 px-2">
                        <p style={{ color: 'var(--text-main)' }} className="text-sm font-medium leading-relaxed">
                            Te vamos a redirigir a nuestro proveedor de autenticación seguro (<span className="text-primary font-bold">Supabase</span>) para iniciar sesión con Google.
                        </p>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed italic">
                            Una vez completado el proceso, volverás automáticamente a ChefScan.IA para continuar tu experiencia culinaria.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center px-4 py-5 border border-white/10 rounded-2xl bg-white text-black hover:bg-gray-100 transition-all text-xs font-black uppercase tracking-[0.2em] gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continuar con Google
                </button>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xs">verified_user</span>
                        Conexión Encriptada de Extremo a Extremo
                    </p>
                </div>
            </main>

            <footer className="mt-10">
                <p style={{ color: 'var(--text-muted)', opacity: 0.5 }} className="text-[9px] font-bold uppercase tracking-[0.4em]">Protegido por Supabase Auth & Google Cloud</p>
            </footer>
        </div>
    );
};

export default AuthRedirectView;
