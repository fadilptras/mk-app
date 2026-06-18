import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const useSetupPassword = () => {
    const [loading, setLoading] = useState(false);

    const setupPassword = async (newPassword: string) => {
        setLoading(true);
        try {
        // 1. Ambil data sesi user yang saat ini sedang login
        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !user) {
            throw new Error("Sesi tidak valid. Silakan login ulang.");
        }

        // 2. Update password di auth.users (Sistem Keamanan Supabase)
        const { error: updateAuthError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateAuthError) throw updateAuthError;

        // 3. Trigger perubahan status_akun menjadi 'aktif' di public.users
        const { error: updateUserError } = await supabase
            .from('users')
            .update({ status_akun: 'aktif' })
            .eq('id', user.id);

        if (updateUserError) throw updateUserError;

        toast.success("Password berhasil diperbarui!");
        return { success: true };

        } catch (error: any) {
        console.error('Setup Password Error:', error);
        toast.error(`Gagal menyimpan: ${error.message}`);
        return { success: false };
        } finally {
        setLoading(false);
        }
    };

    return { setupPassword, loading };
    };