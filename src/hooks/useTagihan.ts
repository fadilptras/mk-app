import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileCheck } from './useProfileCheck';

export const useTagihan = () => {
    const { user } = useProfileCheck();
    const [loading, setLoading] = useState(true);
    
    // Tagihan yang harus dibayar bulan ini (unpaid / pending)
    const [tagihanAktif, setTagihanAktif] = useState<any>(null);
    
    // Tagihan yang sudah lunas (paid)
    const [riwayatTagihan, setRiwayatTagihan] = useState<any[]>([]);

    const fetchTagihan = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('tagihan_sewa')
                .select('*')
                .eq('user_id', user.id)
                .order('urutan_bulan', { ascending: true }); // Urutkan dari bulan terawal

            if (error) throw error;

            if (data) {
                // Filter riwayat yang sudah lunas, lalu balik urutannya agar yang terbaru di atas
                const riwayat = data.filter(t => t.status === 'paid').reverse();
                
                // Cari 1 tagihan terawal yang belum dibayar atau sedang diverifikasi
                const aktif = data.find(t => t.status === 'unpaid' || t.status === 'pending');
                
                setRiwayatTagihan(riwayat);
                setTagihanAktif(aktif || null);
            }
        } catch (err: any) {
            console.error('Error fetching tagihan:', err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTagihan();
    }, [fetchTagihan]);

    // Fungsi mockBayarTagihan telah dihapus karena logika upload bukti 
    // transaksi sudah di-handle dengan baik oleh komponen FormBayarView.tsx

    return { 
        tagihanAktif, 
        riwayatTagihan, 
        loading, 
        refreshTagihan: fetchTagihan 
    };
}