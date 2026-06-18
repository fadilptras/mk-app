import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    
    const [statusAkun, setStatusAkun] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            
            // 1. Cek Sesi (Token Login)
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                setAuthenticated(true);
                
                // 2. Jika ada sesi, ambil detail status akun dari database
                const { data: userData } = await supabase
                    .from('users')
                    .select('status_akun, role')
                    .eq('id', session.user.id)
                    .single();
                    
                if (userData) {
                    setStatusAkun(userData.status_akun);
                    setRole(userData.role);
                }
            } else {
                setAuthenticated(false);
            }
            
            setLoading(false);
        };

        checkAuth();

        // 3. Listener real-time jika ada perubahan sesi
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setAuthenticated(false);
                setStatusAkun(null);
                setRole(null);
            } else {
                // Fetch ulang jika tiba-tiba login di tab yang sama
                checkAuth();
            }
        });

        // Bersihkan listener
        return () => subscription.unsubscribe();
    }, []);

    // Tampilan Loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#BFDDF0]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#0D2F5C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-black text-[#0D2F5C] tracking-widest uppercase text-[10px]">Otentikasi Sistem...</span>
                </div>
            </div>
        );
    }

    // Jika belum login sama sekali, tendang ke halaman login
    if (!authenticated) {
        return <Navigate to="/login" replace />; 
    }

    // ==========================================
    // LOGIKA PENCEGATAN (INTERCEPTOR KEAMANAN)
    // ==========================================
    const isSetupPage = location.pathname === '/setup-password';

    // CELAH 1 DITUTUP: Akun belum aktif TAPI mencoba akses halaman selain setup
    if (role !== 'admin' && statusAkun === 'belum_aktif' && !isSetupPage) {
        return <Navigate to="/setup-password" replace />;
    }

    // CELAH 3 DITUTUP: Akun sudah aktif TAPI iseng mencoba akses halaman setup
    if (statusAkun === 'aktif' && isSetupPage) {
        return <Navigate to="/dashboard" replace />;
    }

    // Jika semua pengecekan aman, silakan masuk ke rute yang dituju
    return <Outlet />;
};