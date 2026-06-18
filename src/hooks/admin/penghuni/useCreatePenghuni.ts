import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY; 

// Dibuat di luar agar tidak muncul warning "Multiple GoTrueClient instances"
const signupClient = createClient(supabaseUrl, anonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

export const useCreatePenghuni = () => {
    const [isCreating, setIsCreating] = useState(false);

    const createAccount = async (formData: any) => {
        setIsCreating(true);
        try {
            if (!supabaseUrl || !anonKey) {
                throw new Error("Supabase URL atau Publishable Key tidak ditemukan di .env");
            }

            // DIKEMBALIKAN KE FORMAT ASLI (TIDAK AKAN DIUBAH LAGI)
            const defaultPassword = '@Mtr1225';

            const { data: authData, error: authError } = await signupClient.auth.signUp({
                email: formData.email,
                password: defaultPassword,
            });

            if (authError) throw authError;

            const newUserId = authData.user?.id;
            if (!newUserId) throw new Error('Gagal mendapatkan ID User dari sistem.');

            // 1. Masukkan data ke tabel public.users
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

            // 2. OTOMATISASI KAMAR (Kamar yang dipilih otomatis OCCUPIED)
            if (formData.kamar_id) {
                const { error: roomError } = await supabase
                    .from('rooms')
                    .update({ status: 'OCCUPIED' })
                    .eq('id', formData.kamar_id);
                
                if (roomError) console.error("Gagal otomatisasi status kamar:", roomError);
            }
            
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