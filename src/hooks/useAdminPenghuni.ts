import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface PenghuniAdmin {
    id: string;
    email: string;
    status_akun: string;
    is_profile_complete: boolean;
    tanggal_masuk: string | null;
    tanggal_tagihan: string | null;
    no_rek_pembayaran: string | null;
    nama_rek_pembayaran: string | null;
    room_id: string | null;
    profile: {
        nama_lengkap: string | null;
        no_whatsapp: string | null;
        nik: string | null;
        foto_ktp: string | null;
        foto_diri: string | null;
        jenis_kelamin: string | null;
        pekerjaan_instansi: string | null;
    } | null;
    room: { room_number: string } | null;
    active_contract: boolean;
    unpaid_bills: number;
    }

    export const useAdminPenghuni = () => {
    const [penghuni, setPenghuni] = useState<PenghuniAdmin[]>([]);
    const [rooms, setRooms] = useState<{id: string, room_number: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchPenghuni = useCallback(async () => {
        setLoading(true);
        try {
        // FIX: Menambahkan relasi eksplisit untuk menghindari ambiguitas 'contract'
        const { data, error } = await supabase
            .from('users')
            .select(`
            id, email, status_akun, is_profile_complete, tanggal_masuk, tanggal_tagihan, no_rek_pembayaran, nama_rek_pembayaran, room_id,
            user_profiles (nama_lengkap, no_whatsapp, nik, foto_ktp, foto_diri, jenis_kelamin, pekerjaan_instansi),
            rooms (room_number),
            contract!contract_user_id_fkey (status),
            tagihan_sewa (status)
            `)
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedData: PenghuniAdmin[] = (data || []).map((item: any) => {
            const profileData = Array.isArray(item.user_profiles) ? item.user_profiles[0] : item.user_profiles;
            const roomData = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms;
            
            const contracts = Array.isArray(item.contract) ? item.contract : [];
            const hasActiveContract = contracts.some((c: any) => c.status === 'aktif');

            const bills = Array.isArray(item.tagihan_sewa) ? item.tagihan_sewa : [];
            const unpaidCount = bills.filter((b: any) => b.status === 'unpaid').length;

            return {
            id: item.id,
            email: item.email,
            status_akun: item.status_akun,
            is_profile_complete: item.is_profile_complete,
            tanggal_masuk: item.tanggal_masuk,
            tanggal_tagihan: item.tanggal_tagihan,
            no_rek_pembayaran: item.no_rek_pembayaran,
            nama_rek_pembayaran: item.nama_rek_pembayaran,
            room_id: item.room_id,
            profile: profileData || null,
            room: roomData || null,
            active_contract: hasActiveContract,
            unpaid_bills: unpaidCount
            };
        });

        setPenghuni(formattedData);
        } catch (error: any) {
        console.error('Fetch penghuni error:', error);
        toast.error(`Gagal memuat data penghuni: ${error.message}`);
        } finally {
        setLoading(false);
        }
    }, []);

    const fetchRooms = useCallback(async () => {
        try {
        const { data, error } = await supabase.from('rooms').select('id, room_number').order('room_number');
        if (!error && data) setRooms(data);
        } catch (err) {}
    }, []);

    const updatePenghuni = async (id: string, payload: any) => {
        setIsUpdating(true);
        try {
        const { error } = await supabase.from('users').update(payload).eq('id', id);
        if (error) throw error;
        toast.success('Data penghuni berhasil diperbarui!');
        await fetchPenghuni();
        return true;
        } catch (error: any) {
        toast.error(`Gagal update: ${error.message}`);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchPenghuni();
        fetchRooms();
    }, [fetchPenghuni, fetchRooms]);

    return { penghuni, rooms, loading, isUpdating, updatePenghuni, refresh: fetchPenghuni };
};