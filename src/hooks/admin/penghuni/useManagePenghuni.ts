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

    // --- UPDATE DATA PENGHUNI (Dengan Auto-Status Pindah Kamar) ---
    const updatePenghuni = async (id: string, payload: any) => {
        setIsUpdating(true);
        try {
        // 1. Ambil data kamar lama sebelum diupdate
        const { data: oldUser } = await supabase.from('users').select('room_id').eq('id', id).single();
        const oldRoomId = oldUser?.room_id;

        // 2. Lakukan update data penghuni
        const { error } = await supabase.from('users').update(payload).eq('id', id);
        if (error) throw error;

        // 3. LOGIKA PINDAH KAMAR / CABUT KAMAR
        if (payload.hasOwnProperty('room_id') && payload.room_id !== oldRoomId) {
            
            // A. Kamar baru otomatis diset jadi OCCUPIED
            if (payload.room_id) {
                await supabase.from('rooms').update({ status: 'OCCUPIED' }).eq('id', payload.room_id);
            }

            // B. Kamar lama di-cek apakah sudah kosong melompong
            if (oldRoomId) {
                const { data: occupants } = await supabase.from('users').select('id').eq('room_id', oldRoomId);
                // Jika tidak ada user lain di kamar lama, ganti jadi AVAILABLE
                if (!occupants || occupants.length === 0) {
                    await supabase.from('rooms').update({ status: 'AVAILABLE' }).eq('id', oldRoomId);
                }
            }
        }

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

    // --- HAPUS PENGHUNI (Dengan Auto-Status Cabut Kamar) ---
    const deletePenghuni = async (id: string) => {
        setIsUpdating(true);
        try {
        // 1. Ambil data kamar sebelum user dihapus permanen
        const { data: oldUser } = await supabase.from('users').select('room_id').eq('id', id).single();
        const oldRoomId = oldUser?.room_id;

        // 2. Eksekusi hapus di database
        const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });
        if (error) throw error;

        // 3. Bebaskan kamar jika sudah tidak ada penghuni lain
        if (oldRoomId) {
            const { data: occupants } = await supabase.from('users').select('id').eq('room_id', oldRoomId);
            if (!occupants || occupants.length === 0) {
                await supabase.from('rooms').update({ status: 'AVAILABLE' }).eq('id', oldRoomId);
            }
        }

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

    // --- RESET PASSWORD ---
    const resetPassword = async (userId: string) => {
        setIsUpdating(true);
        try {
        // DIKEMBALIKAN KE FORMAT ASLI (TIDAK AKAN DIUBAH LAGI)
        const defaultPassword = '@Mtr1225';

        const { error: rpcError } = await supabase.rpc('admin_reset_password', { 
            target_user_id: userId, 
            new_password: defaultPassword 
        });

        if (rpcError) throw rpcError;

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