import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const useLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
        // 1. Coba login menggunakan otentikasi Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            // 2. Jika gagal login, cek apakah emailnya terdaftar di database kita
            const { data: checkUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();

            if (!checkUser) {
            toast.error("Akun tidak terdaftar, silakan hubungi admin kost.");
            } else {
            toast.error("Email atau password yang Anda masukkan salah.");
            }
            return { success: false };
        }

        // 3. Jika berhasil auth, ambil status_akun dan role
        const userId = authData.user?.id;
        if (!userId) throw new Error("Terjadi kesalahan sistem.");

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('status_akun, role')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        // 4. Arahkan pengguna sesuai Role dan Status Akun
        if (userData.role === 'admin') {
            toast.success("Selamat datang kembali, Admin!");
            navigate('/admin/dashboard');
            return { success: true };
        }

        if (userData.status_akun === 'belum_aktif') {
            toast.success("Akses diterima! Silakan perbarui password Anda.");
            navigate('/setup-password'); 
        } else {
            toast.success("Login berhasil!");
            navigate('/dashboard'); 
        }
        
        return { success: true };

        } catch (error: any) {
        toast.error(`Terjadi kesalahan sistem: ${error.message}`);
        return { success: false };
        } finally {
        setLoading(false);
        }
    };

    return { login, loading };
};