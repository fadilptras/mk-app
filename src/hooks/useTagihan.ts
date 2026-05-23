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

    // Fungsi dummy untuk mock bayar (nantinya dihubungkan ke fitur upload struk)
    const mockBayarTagihan = async (tagihanId: string) => {
        try {
            const { error } = await supabase
                .from('tagihan_sewa')
                .update({ 
                    status: 'pending', // Berubah jadi pending nunggu Admin ACC
                    tanggal_upload: new Date().toISOString()
                })
                .eq('id', tagihanId);
            
            if (error) throw error;
            await fetchTagihan(); // Refresh UI
            alert("Pembayaran berhasil disubmit. Menunggu verifikasi Admin.");
        } catch (err: any) {
            alert("Gagal memproses pembayaran.");
        }
    }

    return { tagihanAktif, riwayatTagihan, loading, mockBayarTagihan };
};