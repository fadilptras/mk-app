import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // 1. Cek inisial saat aplikasi pertama dibuka
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthenticated(!!session);
            setLoading(false);
        });

        // 2. Listener real-time jika ada perubahan sesi (logout, token expire)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
        });

        // 3. Bersihkan listener saat komponen dibongkar
        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen bg-[#BFDDF0]">Memuat...</div>;

    return authenticated ? <Outlet /> : <Navigate to="/auth" />;
};