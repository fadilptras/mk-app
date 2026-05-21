import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileCheck } from './useProfileCheck';

export const useKontrak = () => {
    const { user, profileData } = useProfileCheck();
    const [loading, setLoading] = useState(true);
    const [activeContract, setActiveContract] = useState<any>(null);
    const [contractHistory, setContractHistory] = useState<any[]>([]);

    // Logika penentuan jenis sewa (Baru vs Perpanjang)
    const jenisKontrakOtomatis = profileData?.is_contract_complete ? 'perpanjang' : 'baru';

    const fetchCurrentContract = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('contract')
                .select(`
                    *,
                    approver:approver_id ( full_name )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                // Cari kontrak yang berstatus aktif atau menunggu persetujuan
                const active = data.find(c => c.status === 'menunggu_persetujuan' || c.status === 'aktif');
                // Sisa kontrak lainnya masuk ke history
                const history = data.filter(c => c.id !== active?.id);

                setActiveContract(active || null);
                setContractHistory(history);
            } else {
                setActiveContract(null);
                setContractHistory([]);
            }
        } catch (err: any) {
            console.error('Error fetching contracts:', err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCurrentContract();
    }, [user, fetchCurrentContract]);

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
            // 1. Simpan data pengajuan ke tabel contract
            const { error: insertError } = await supabase.from('contract').insert({
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

            if (insertError) throw insertError;

            // 2. UPDATE status di tabel users agar is_contract_complete jadi TRUE
            const { error: updateError } = await supabase
                .from('users')
                .update({ is_contract_complete: true })
                .eq('id', user.id);

            if (updateError) {
                console.error("Gagal update status user:", updateError.message);
                throw updateError;
            }
            
            // 3. Paksa ambil ulang data kontrak dari database untuk UI
            await fetchCurrentContract(); 
            return true;
        } catch (err: any) {
            alert(`Gagal mengajukan kontrak: ${err.message}`);
            console.error('Gagal mengajukan kontrak:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { 
        activeContract, 
        contractHistory,
        jenisKontrakOtomatis, 
        ajukanKontrak, 
        loading,
        refreshKontrak: fetchCurrentContract
    };
};