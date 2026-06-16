import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export const useCreatePenghuni = () => {
    const [isCreating, setIsCreating] = useState(false);

    const createAccount = async (formData: any) => {
        setIsCreating(true);
        try {
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error("Supabase URL atau Service Role Key tidak ditemukan di .env");
        }

        // Klien Jalur VIP (Service Role) tanpa menyimpan sesi Admin
        const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
            persistSession: false,
            autoRefreshToken: false,
            }
        });

        const defaultPassword = 'PasswordKost123!';

        const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
            email: formData.email,
            password: defaultPassword,
            email_confirm: true 
        });

        if (authError) throw authError;

        const newUserId = authData.user?.id;
        if (!newUserId) throw new Error('Gagal mendapatkan ID User dari sistem.');

        // Masukkan profil operasional ke tabel public.users
        const { error: userError } = await supabase.from('users').insert([{
            id: newUserId,
            email: formData.email, 
            role: formData.role || 'penghuni', 
            room_id: formData.kamar_id || null,
            tanggal_masuk: formData.tanggal_masuk || null, 
            tanggal_tagihan: formData.tanggal_tagihan || null,
            biaya_sewa: formData.biaya_sewa ? Number(formData.biaya_sewa) : null, 
            biaya_deposit: formData.biaya_deposit ? Number(formData.biaya_deposit) : null,
            no_rek_pembayaran: formData.no_rek_pembayaran || null, 
            nama_rek_pembayaran: formData.nama_rek_pembayaran || null, 
            is_profile_complete: false,
            status_akun: 'belum_aktif'
        }]);
        
        if (userError) throw userError;
        
        toast.success('Akun penghuni berhasil dibuat!');
        return { success: true };
        } catch (error: any) { 
        console.error('Create account error:', error);
        toast.error(`Gagal membuat akun: ${error.message}`);
        return { success: false, message: error.message }; 
        } finally { 
        setIsCreating(false); 
        }
    };

    return { createAccount, isCreating };
};