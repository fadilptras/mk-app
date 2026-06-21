import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export interface TagihanAdmin {
  id: string;
  nominal_tagihan: number;
  periode_tagihan: string;
  jatuh_tempo: string;
  status: 'unpaid' | 'pending' | 'paid';
  bukti_transfer: string | null;
  keterangan: string | null;
  user_id: string;
  user: {
    room: { room_number: string } | null;
    profile: { nama_lengkap: string } | null;
  };
}

export interface ActiveTenant {
  kontrak_id: string;
  user_id: string;
  nama_lengkap: string;
  room_number: string;
  harga_per_bulan: number;
}

export const useAdminTagihan = () => {
  const [tagihan, setTagihan] = useState<TagihanAdmin[]>([]);
  const [activeTenants, setActiveTenants] = useState<ActiveTenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchTagihan = useCallback(async () => {
    setLoading(true);
    try {
      // FIX: Hapus penggunaan alias 'user:users' dan gunakan format join native
      const { data, error } = await supabase
        .from('tagihan_sewa')
        .select(`
          id, nominal_tagihan, periode_tagihan, jatuh_tempo, status, bukti_transfer, keterangan, user_id,
          users (
            rooms (room_number),
            user_profiles (nama_lengkap)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Fetch Error:", error);
        throw error;
      }
      
      const formattedData: TagihanAdmin[] = (data as any[]).map((item) => {
        const profiles = item.users?.user_profiles;
        const profileData = Array.isArray(profiles) ? profiles[0] : profiles;

        return {
          ...item,
          user: {
            room: item.users?.rooms ? item.users.rooms : null,
            profile: profileData ? profileData : null
          }
        };
      });

      setTagihan(formattedData);
    } catch (error: any) {
      console.error('Error fetching tagihan:', error);
      toast.error(`Gagal memuat tagihan: ${error?.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveTenants = useCallback(async () => {
    try {
      // FIX: Gunakan foreign key eksplisit seperti di modul kontrak
      const { data, error } = await supabase
        .from('contract')
        .select(`
          id, user_id, harga_per_bulan,
          users!contract_user_id_fkey (
            rooms (room_number),
            user_profiles (nama_lengkap)
          )
        `)
        .eq('status', 'aktif');

      if (error) throw error;

      const formattedTenants: ActiveTenant[] = (data as any[]).map((item) => {
        const profiles = item.users?.user_profiles;
        const profileData = Array.isArray(profiles) ? profiles[0] : profiles;

        return {
          kontrak_id: item.id,
          user_id: item.user_id,
          harga_per_bulan: item.harga_per_bulan,
          room_number: item.users?.rooms?.room_number || '-',
          nama_lengkap: profileData?.nama_lengkap || 'Tanpa Nama'
        };
      });

      setActiveTenants(formattedTenants);
    } catch (error: any) {
      console.error('Error fetching active tenants:', error);
    }
  }, []);

  const verifikasiTagihan = async (id: string, isApproved: boolean, alasan?: string) => {
    setIsUpdating(true);
    try {
      const updateData = isApproved 
        ? { status: 'paid', verified_at: new Date().toISOString() } 
        : { status: 'unpaid', keterangan: alasan || 'Pembayaran ditolak admin' };

      const { error } = await supabase
        .from('tagihan_sewa')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success(isApproved ? 'Pembayaran berhasil dikonfirmasi!' : 'Pembayaran ditolak.');
      await fetchTagihan();
    } catch (error: any) {
      console.error('Error verifying tagihan:', error);
      toast.error(`Gagal verifikasi: ${error?.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const createTagihan = async (payload: {
    kontrak_id: string;
    user_id: string;
    urutan_bulan: number;
    periode_tagihan: string;
    jatuh_tempo: string;
    nominal_tagihan: number;
  }) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('tagihan_sewa')
        .insert([{ ...payload, status: 'unpaid' }]);

      if (error) throw error;

      toast.success('Tagihan baru berhasil dibuat!');
      await fetchTagihan();
      return true;
    } catch (error: any) {
      console.error('Error creating tagihan:', error);
      toast.error(`Gagal membuat tagihan: ${error?.message}`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchTagihan();
    fetchActiveTenants();
  }, [fetchTagihan, fetchActiveTenants]);

  return {
    tagihan,
    activeTenants,
    loading,
    isUpdating,
    verifikasiTagihan,
    createTagihan,
    refreshTagihan: fetchTagihan
  };
};