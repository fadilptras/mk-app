import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useDashboardData() {
    const [stats, setStats] = useState({ 
        totalKamar: 0, 
        kamarTerisi: 0, 
        totalPenghuni: 0, 
        tunggakan: 0, 
        verifikasi: 0, 
        laporanBaru: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const today = new Date().toISOString();
            
            try {
                // OPTIMASI: Eksekusi 4 query Supabase secara BERSAMAAN (Paralel)
                const [
                    { data: roomsData },
                    { count: penghuniCount },
                    { data: bills },
                    { count: reportsCount }
                ] = await Promise.all([
                    // 1. Ambil jumlah kamar dan statusnya
                    supabase.from('rooms').select('id, status'),
                    
                    // 2. Ambil total penghuni dengan filter role = 'penghuni'
                    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'penghuni'),
                    
                    // 3. Ambil data tagihan sewa
                    supabase.from('tagihan_sewa').select('status, jatuh_tempo'),
                    
                    // 4. Ambil laporan masuk yang berstatus PENDING
                    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'PENDING')
                ]);

                // Hitung tunggakan dan verifikasi dari data tagihan yang didapat
                const unpaidOverdue = bills?.filter(b => b.status === 'unpaid' && b.jatuh_tempo < today) || [];
                const pendingVerify = bills?.filter(b => b.status === 'pending') || [];

                setStats({
                    totalKamar: roomsData?.length || 0,
                    kamarTerisi: roomsData?.filter(r => r.status === 'OCCUPIED').length || 0,
                    totalPenghuni: penghuniCount || 0,
                    tunggakan: unpaidOverdue.length,
                    verifikasi: pendingVerify.length,
                    laporanBaru: reportsCount || 0
                });
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, []);

    return { stats, loading };
}