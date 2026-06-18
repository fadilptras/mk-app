import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export interface RoomAdmin {
    id: string;
    room_number: string;
    status: string;
    meter_number: string | null;
    meter_name: string | null;
    penghuni_count: number; // Tambahan untuk mengecek apakah kamar kosong/berisi
    }

    export const useManageKamar = () => {
    const [rooms, setRooms] = useState<RoomAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. READ: Ambil Data Kamar beserta jumlah penghuninya
    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*, users(id)')
            .order('room_number', { ascending: true });

        if (error) throw error;

        const formattedRooms: RoomAdmin[] = (data || []).map((room: any) => ({
            ...room,
            penghuni_count: room.users ? room.users.length : 0
        }));

        setRooms(formattedRooms);
        } catch (error: any) {
        toast.error(`Gagal memuat kamar: ${error.message}`);
        } finally {
        setLoading(false);
        }
    }, []);

    // 2. CREATE: Tambah Kamar dengan Validasi Duplikat
    const addRoom = async (nomor: string, meter_num: string, meter_name: string) => {
        setIsUpdating(true);
        try {
        const cleanNum = nomor.trim().toUpperCase();
        
        // Cek Duplikat
        const { data: existing } = await supabase
            .from('rooms')
            .select('id')
            .eq('room_number', cleanNum)
            .single();
            
        if (existing) throw new Error(`Kamar dengan nomor ${cleanNum} sudah ada!`);

        const { error } = await supabase.from('rooms').insert([{
            room_number: cleanNum,
            meter_number: meter_num.trim() || null,
            meter_name: meter_name.trim() || null,
            status: 'AVAILABLE'
        }]);

        if (error) throw error;
        
        toast.success(`Kamar ${cleanNum} berhasil ditambahkan!`);
        await fetchRooms();
        return true;
        } catch (error: any) {
        toast.error(error.message);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    // 3. UPDATE: Edit Kamar
    const updateRoom = async (id: string, payload: any, currentNum: string) => {
        setIsUpdating(true);
        try {
        const cleanNum = payload.room_number.trim().toUpperCase();

        // Cek Duplikat jika nomor diubah
        if (cleanNum !== currentNum) {
            const { data: existing } = await supabase
            .from('rooms')
            .select('id')
            .eq('room_number', cleanNum)
            .single();
            if (existing) throw new Error(`Nomor ${cleanNum} sudah terpakai kamar lain!`);
        }

        const { error } = await supabase.from('rooms').update({
            room_number: cleanNum,
            status: payload.status,
            meter_number: payload.meter_number.trim() || null,
            meter_name: payload.meter_name.trim() || null,
        }).eq('id', id);

        if (error) throw error;

        toast.success('Data kamar diperbarui!');
        await fetchRooms();
        return true;
        } catch (error: any) {
        toast.error(error.message);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    // 4. DELETE: Hapus Kamar dengan Proteksi
    const deleteRoom = async (id: string, roomNum: string, penghuniCount: number) => {
        // PROTEKSI: Jangan hapus jika ada orangnya
        if (penghuniCount > 0) {
        toast.error(`Akses Ditolak: Kamar ${roomNum} masih diisi oleh ${penghuniCount} penghuni! Pindahkan/hapus penghuni terlebih dahulu.`);
        return false;
        }

        setIsUpdating(true);
        try {
        const { error } = await supabase.from('rooms').delete().eq('id', id);
        if (error) throw error;

        toast.success(`Kamar ${roomNum} berhasil dihapus.`);
        await fetchRooms();
        return true;
        } catch (error: any) {
        toast.error(`Gagal menghapus: ${error.message}`);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return { rooms, loading, isUpdating, addRoom, updateRoom, deleteRoom };
};