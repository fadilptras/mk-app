import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileCheck } from './useProfileCheck';

export const useKontrak = () => {
    const { user, profileData } = useProfileCheck();
    const [loading, setLoading] = useState(false);
    const [activeContract, setActiveContract] = useState<any>(null);

    // LOGIC OTOMATIS PENENTUAN JENIS KONTRAK
    const jenisKontrakOtomatis = profileData?.is_contract_complete ? 'perpanjang' : 'baru';

    // Cek apakah user sudah punya kontrak yang sedang aktif atau menunggu persetujuan
    const fetchCurrentContract = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('contract')
                .select(`
                    *,
                    approver:approver_id ( full_name )
                `)
                .eq('user_id', user.id)
                .in('status', ['menunggu_persetujuan', 'aktif'])
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            // Abaikan error jika tidak ada baris (PGRST116)
            if (error && error.code !== 'PGRST116') throw error;
            if (data) setActiveContract(data);
        } catch (err) {
            console.log('Belum ada kontrak aktif');
        }
    };

    useEffect(() => {
        fetchCurrentContract();
    }, [user]);

    const ajukanKontrak = async (
        mulaiSewa: string,
        lamaSewa: number,
        akhirSewa: string,
        hargaPerBulan: number,
        deposit: number
    ) => {
        if (!user) return false;
        setLoading(true);
        
        try {
            const { error } = await supabase.from('contract').insert({
                user_id: user.id,
                jenis_kontrak: jenisKontrakOtomatis,
                mulai_sewa: mulaiSewa,
                lama_sewa: lamaSewa,
                akhir_sewa: akhirSewa,
                harga_per_bulan: hargaPerBulan,
                deposit: deposit,
                status: 'menunggu_persetujuan',
                is_agreed: true
            });

            if (error) throw error;
            await fetchCurrentContract(); // Refresh view
            return true;
        } catch (err: any) {
            console.error('Gagal mengajukan kontrak:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { 
        activeContract, 
        jenisKontrakOtomatis, 
        ajukanKontrak, 
        loading 
    };
};