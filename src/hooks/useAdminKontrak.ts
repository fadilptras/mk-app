import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface KontrakAdmin {
  id: string;
  jenis_kontrak: string;
  mulai_sewa: string;
  akhir_sewa: string;
  lama_sewa: number;
  harga_per_bulan: number;
  status: string;
  created_at: string;
  user_id: string;
  user: {
    room: { room_number: string } | null;
    profile: { nama_lengkap: string } | null;
  };
}

export const useAdminKontrak = () => {
  const [kontrak, setKontrak] = useState<KontrakAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchKontrak = useCallback(async () => {
    setLoading(true);
    try {
      // SOLUSI: Menggunakan foreign key eksplisit (!contract_user_id_fkey) untuk menghilangkan ambiguitas
      const { data, error } = await supabase
        .from('contract')
        .select(`
          id, jenis_kontrak, mulai_sewa, akhir_sewa, lama_sewa, harga_per_bulan, status, created_at, user_id,
          users!contract_user_id_fkey (
            rooms (room_number),
            user_profiles (nama_lengkap)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Fetch Error:", error);
        throw error;
      }
      
      const formattedData: KontrakAdmin[] = (data as any[]).map((item) => {
        // Handling struktur balikan array/object dari Supabase
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

      setKontrak(formattedData);
    } catch (error: any) {
      console.error('Error catching kontrak:', error);
      toast.error(`Gagal: ${error?.message || 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const setujuiKontrak = async (id: string, userId: string) => {
    setIsUpdating(true);
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      const adminId = currentUser?.id;

      // 1. Update status contract & isi approver_id
      const { error: errContract } = await supabase
        .from('contract')
        .update({ 
          status: 'aktif', 
          approved_at: new Date().toISOString(),
          approver_id: adminId 
        })
        .eq('id', id);

      if (errContract) throw errContract;

      // 2. Update is_contract_complete di users
      const { error: errUser } = await supabase
        .from('users')
        .update({ is_contract_complete: true })
        .eq('id', userId);

      if (errUser) throw errUser;

      toast.success('Kontrak berhasil disetujui!');
      await fetchKontrak();
    } catch (error: any) {
      console.error('Error approving kontrak:', error);
      toast.error(`Gagal Menyetujui: ${error?.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const tolakKontrak = async (id: string, alasan: string) => {
    setIsUpdating(true);
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      const adminId = currentUser?.id;

      const { error } = await supabase
        .from('contract')
        .update({ 
          status: 'ditolak', 
          catatan_admin: alasan,
          approver_id: adminId 
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Kontrak berhasil ditolak.');
      await fetchKontrak();
    } catch (error: any) {
      console.error('Error rejecting kontrak:', error);
      toast.error(`Gagal Menolak: ${error?.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchKontrak();
  }, [fetchKontrak]);

  return {
    kontrak,
    loading,
    isUpdating,
    setujuiKontrak,
    tolakKontrak,
    refreshKontrak: fetchKontrak
  };
};