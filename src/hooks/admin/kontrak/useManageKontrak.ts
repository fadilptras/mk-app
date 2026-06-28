import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
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
  catatan_admin?: string;
  user: {
    room: { room_number: string } | null;
    profile: { nama_lengkap: string } | null;
  };
}

export const useManageKontrak = () => {
  const [kontrak, setKontrak] = useState<KontrakAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchKontrak = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contract')
        .select(`
          id, jenis_kontrak, mulai_sewa, akhir_sewa, lama_sewa, harga_per_bulan, status, created_at, user_id, catatan_admin,
          users!contract_user_id_fkey (
            rooms (room_number),
            user_profiles (nama_lengkap)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData: KontrakAdmin[] = (data as any[]).map((item) => {
        const profiles = item.users?.user_profiles;
        const profileData = Array.isArray(profiles) ? profiles[0] : profiles;
        const roomData = Array.isArray(item.users?.rooms) ? item.users?.rooms[0] : item.users?.rooms;

        return {
          ...item,
          user: {
            room: roomData || null,
            profile: profileData || null
          }
        };
      });

      setKontrak(formattedData);
    } catch (error: any) {
      console.error('Error fetching kontrak:', error);
      toast.error(`Gagal memuat kontrak: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const setujuiKontrak = async (kontrakData: KontrakAdmin) => {
    setIsUpdating(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const adminId = authData.user?.id;

      // 1. Update status kontrak menjadi aktif
      // NOTE: Begitu ini tereksekusi, PostgreSQL Trigger 'trigger_generate_tagihan' 
      // akan otomatis menyala dan membuatkan data di tabel 'tagihan_sewa'!
      const { error: errContract } = await supabase
        .from('contract')
        .update({ 
          status: 'aktif', 
          approved_at: new Date().toISOString(),
          approver_id: adminId 
        })
        .eq('id', kontrakData.id);
      
      if (errContract) throw errContract;

      // 2. Update is_contract_complete di profil users
      const { error: errUser } = await supabase
        .from('users')
        .update({ is_contract_complete: true })
        .eq('id', kontrakData.user_id);
        
      if (errUser) throw errUser;

      // ==========================================
      // [TAMBAHAN]: TRIGGER NOTIFIKASI START
      // ==========================================
      const isPerpanjang = kontrakData.jenis_kontrak === 'perpanjang';
      const title = isPerpanjang ? 'Perpanjangan Sewa Disetujui' : 'Kontrak Baru Disetujui';
      const message = isPerpanjang
        ? `Pengajuan perpanjangan sewa kamu selama ${kontrakData.lama_sewa} bulan telah disetujui admin. Tagihan bulan ini sudah diterbitkan.`
        : `Selamat datang! Pengajuan sewa baru kamu selama ${kontrakData.lama_sewa} bulan telah disetujui. Tagihan pertamamu sudah otomatis diterbitkan.`;

      await supabase.from('notifications').insert({
        user_id: kontrakData.user_id,
        type: 'kontrak',
        title: title,
        message: message,
      });
      // ==========================================
      // [TAMBAHAN]: TRIGGER NOTIFIKASI END
      // ==========================================

      toast.success('Kontrak disetujui! Tagihan otomatis dibuat oleh sistem.');
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

    // [TAMBAHAN]: Cari data kontrak yang ditolak untuk mendapatkan user_id dan jenis_kontrak
    const targetKontrak = kontrak.find((k) => k.id === id);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const adminId = authData.user?.id;

      const { error } = await supabase
        .from('contract')
        .update({ 
          status: 'ditolak', 
          catatan_admin: alasan,
          approver_id: adminId 
        })
        .eq('id', id);

      if (error) throw error;

      // ==========================================
      // [TAMBAHAN]: TRIGGER NOTIFIKASI START
      // ==========================================
      if (targetKontrak) {
        const title = 'Pengajuan Kontrak Ditolak';
        const message = `Maaf, pengajuan kontrak ${targetKontrak.jenis_kontrak} kamu ditolak oleh admin. Alasan: ${alasan}. Silakan hubungi admin atau ajukan ulang.`;

        await supabase.from('notifications').insert({
          user_id: targetKontrak.user_id,
          type: 'kontrak',
          title: title,
          message: message,
        });
      }
      // ==========================================
      // [TAMBAHAN]: TRIGGER NOTIFIKASI END
      // ==========================================

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
    kontrak, loading, isUpdating, setujuiKontrak, tolakKontrak, refreshKontrak: fetchKontrak
  };
};