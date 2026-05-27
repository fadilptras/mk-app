import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileCheck } from './useProfileCheck';

export const useKontrak = () => {
    const { user, profileData, refreshProfile } = useProfileCheck();
    const [loading, setLoading] = useState(true);
    const [activeContract, setActiveContract] = useState<any>(null);
    const [contractHistory, setContractHistory] = useState<any[]>([]);

    const jenisKontrakOtomatis = profileData?.is_contract_complete ? 'perpanjang' : 'baru';

    const fetchCurrentContract = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('contract')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                // Ambil tanggal hari ini dan reset jamnya ke 00:00:00 untuk akurasi perbandingan
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // 1. CARI KONTRAK AKTIF
                const active = data.find(c => {
                    if (c.status === 'menunggu_persetujuan') return true;
                    if (c.status === 'aktif') {
                        const akhirSewa = new Date(c.akhir_sewa);
                        akhirSewa.setHours(0, 0, 0, 0);
                        // Masih aktif jika tanggal akhir sewa >= hari ini
                        return akhirSewa >= today;
                    }
                    return false;
                });

                // 2. KUMPULKAN RIWAYAT ARSIP (Dan override status jika kadaluarsa)
                const history = data.filter(c => {
                    // Masukkan ke arsip jika status eksplisit dari Admin adalah ini:
                    if (['selesai', 'ditolak', 'dibatalkan', 'berakhir'].includes(c.status)) return true;
                    
                    // ATAU, jika statusnya aktif TAPI tanggalnya sudah kadaluarsa (otomatis masuk arsip)
                    if (c.status === 'aktif') {
                        const akhirSewa = new Date(c.akhir_sewa);
                        akhirSewa.setHours(0, 0, 0, 0);
                        return akhirSewa < today;
                    }
                    return false;
                }).map(c => {
                    // (Opsional) Jika masuk arsip gara-gara tanggal lewat, ubah label statusnya jadi 'selesai' di UI
                    if (c.status === 'aktif') {
                        return { ...c, status: 'selesai' };
                    }
                    return c;
                });
                
                setActiveContract(active || null);
                setContractHistory(history);
            } else {
                setActiveContract(null);
                setContractHistory([]);
            }
        } catch (err: any) {
            console.error('Error fetching contract:', err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCurrentContract();
    }, [fetchCurrentContract]);

    const getRemainingDays = (endDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        
        const diffTime = end.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const ajukanKontrak = async (lamaSewa: number, mulaiSewa: string, akhirSewa: string, hargaPerBulan: number, deposit: number) => {
        if (!user) return false;
        setLoading(true);
        
        try {
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

            // Update status profil jika ini kontrak pertama
            if (!profileData?.is_contract_complete) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ is_contract_complete: true })
                    .eq('id', user.id);

                if (updateError) throw updateError;
            }
            
            await fetchCurrentContract(); 
            if (refreshProfile) await refreshProfile(); 
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
        getRemainingDays, 
        loading,
        refreshContract: fetchCurrentContract 
    };
};