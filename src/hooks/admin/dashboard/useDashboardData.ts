import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useDashboardData() {
    const [stats, setStats] = useState({ 
        totalKamar: 0, 
        kamarTerisi: 0, 
        totalPenghuni: 0, // Hanya role 'penghuni'
        tunggakan: 0, 
        verifikasi: 0, 
        laporanBaru: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
        const today = new Date().toISOString();
        
        // 1. Ambil jumlah kamar dan okupansi
        const { data: roomsData } = await supabase.from('rooms').select('id, is_occupied');
        
        // 2. Ambil total penghuni dengan filter role = 'penghuni'
        const { count: penghuniCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'penghuni'); // Sesuaikan nama kolom role-mu di sini

        // 3. Ambil data tagihan dan laporan
        const [bills, reports] = await Promise.all([
            supabase.from('tagihan_sewa').select('status, jatuh_tempo'),
            supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'PENDING')
        ]);

        const unpaidOverdue = bills.data?.filter(b => b.status === 'unpaid' && b.jatuh_tempo < today) || [];
        const pendingVerify = bills.data?.filter(b => b.status === 'pending') || [];

        setStats({
            totalKamar: roomsData?.length || 0,
            kamarTerisi: roomsData?.filter(r => r.is_occupied).length || 0,
            totalPenghuni: penghuniCount || 0,
            tunggakan: unpaidOverdue.length,
            verifikasi: pendingVerify.length,
            laporanBaru: reports.count || 0
        });
        setLoading(false);
        }
        fetchData();
    }, []);

    return { stats, loading };
}