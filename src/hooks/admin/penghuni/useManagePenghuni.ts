import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export interface PenghuniAdmin {
    id: string;
    email: string;
    status_akun: string;
    is_profile_complete: boolean;
    is_contract_complete: boolean | null;
    tanggal_masuk: string | null;
    tanggal_tagihan: string | null;
    no_rek_pembayaran: string | null;
    nama_rek_pembayaran: string | null;
    room_id: string | null;
    profile: any | null;
    room: { room_number: string } | null;
    active_contract: boolean;
    unpaid_bills: number;
    }

    export const useManagePenghuni = () => {
    const [penghuni, setPenghuni] = useState<PenghuniAdmin[]>([]);
    const [rooms, setRooms] = useState<{id: string, room_number: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // FETCH PENGHUNI
    const fetchPenghuni = useCallback(async () => {
        setLoading(true);
        try {
        const { data, error } = await supabase
            .from('users')
            .select(`
            id, email, status_akun, is_profile_complete, is_contract_complete, 
            tanggal_masuk, tanggal_tagihan, no_rek_pembayaran, nama_rek_pembayaran, room_id,
            user_profiles (nama_lengkap, no_whatsapp, nik, foto_ktp, foto_diri, jenis_kelamin, pekerjaan_instansi),
            rooms (room_number)
            `)
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedData: PenghuniAdmin[] = (data || []).map((item: any) => {
            const profileData = Array.isArray(item.user_profiles) ? item.user_profiles[0] : item.user_profiles;
            const roomData = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms;

            return {
            ...item,
            profile: profileData || null,
            room: roomData || null,
            active_contract: item.is_contract_complete === true, 
            unpaid_bills: 0 
            };
        });

        setPenghuni(formattedData);
        } catch (error: any) {
        toast.error(`Gagal memuat data: ${error.message}`);
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

    // --- HAPUS PENGHUNI (Via RPC Supabase) ---
    const deletePenghuni = async (id: string) => {
        setIsUpdating(true);
        try {
        // Memanggil fungsi SQL yang baru saja kita buat di Supabase
        const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });

        if (error) throw error;

        toast.success('Akun penghuni berhasil dihapus permanen!');
        await fetchPenghuni();
        return true;
        } catch (error: any) {
        toast.error(`Gagal menghapus: ${error.message}`);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    // --- RESET PASSWORD (Via RPC Supabase) ---
    const resetPassword = async (userId: string) => {
        setIsUpdating(true);
        try {
        const defaultPassword = '@Mtr1225';

        // 1. Memanggil fungsi SQL untuk mereset password secara internal
        const { error: rpcError } = await supabase.rpc('admin_reset_password', { 
            target_user_id: userId, 
            new_password: defaultPassword 
        });

        if (rpcError) throw rpcError;

        // 2. Kembalikan status_akun menjadi belum_aktif agar mereka dicegat saat login
        const { error: updateStatusError } = await supabase
            .from('users')
            .update({ status_akun: 'belum_aktif' })
            .eq('id', userId);

        if (updateStatusError) throw updateStatusError;

        toast.success(`Password direset menjadi: ${defaultPassword}`);
        await fetchPenghuni();
        return true;
        } catch (error: any) {
        console.error('Reset password error:', error);
        toast.error(`Gagal reset password: ${error.message}`);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchPenghuni();
        fetchRooms();
    }, [fetchPenghuni, fetchRooms]);

    return { 
        penghuni, rooms, loading, isUpdating, 
        updatePenghuni, deletePenghuni, resetPassword, refresh: fetchPenghuni 
    };
};