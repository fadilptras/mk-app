import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // STEP 1: Cek apakah email terdaftar di sistem admin
    const checkEmailEligibility = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
        const { data, error: fetchError } = await supabase
            .from('users')
            .select('email, status_akun')
            .eq('email', email)
            .single();

        if (fetchError || !data) throw new Error("Email tidak ditemukan. Silakan hubungi admin kost.");
        if (data.status_akun !== 'belum_aktif') throw new Error("Akun sudah aktif. Silakan langsung login.");

        return true;
        } catch (err: any) {
        setError(err.message);
        return false;
        } finally {
        setLoading(false);
        }
    };

    // STEP 2: Proses Pendaftaran (Aktivasi)
    const registerNewTenant = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
        // 1. Sign up ke Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        if (authData.user) {
            // 2. Update data di tabel public.users
            const { error: updateError } = await supabase
            .from('users')
            .update({ 
                id: authData.user.id, // Sinkronkan UUID
                status_akun: 'aktif',
                is_profile_complete: false
            })
            .eq('email', email);

            if (updateError) throw updateError;
        }

        return true;
        } catch (err: any) {
        setError(err.message);
        return false;
        } finally {
        setLoading(false);
        }
    };

    // FUNGSI LOGIN: Handle Redirect setelah masuk
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) throw authError;

        // Ambil status profile untuk menentukan arah navigasi
        const { data: profile } = await supabase
            .from('users')
            .select('role, is_profile_complete')
            .eq('id', authData.user.id)
            .single();

        if (profile?.is_profile_complete === false) {
            navigate('/profile/edit'); // Arahkan ke form lengkapi data
        } else {
            navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        }
        } catch (err: any) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return { checkEmailEligibility, registerNewTenant, login, loading, error };
};