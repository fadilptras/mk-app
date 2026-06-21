import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase"; 
import toast from "react-hot-toast";

export interface Tagihan {
  id: string;
  kontrak_id: string;
  user_id: string;
  urutan_bulan: number;
  status: "paid" | "pending" | "unpaid";
  periode_tagihan: string;
  jatuh_tempo: string;
  nominal_tagihan: number;
  bukti_transfer: string | null;
  keterangan: string | null;
  tanggal_upload: string | null;
  verified_at: string | null;
  user?: {
    profile?: { nama_lengkap: string };
    room?: { room_number: string };
  };
}

export function useAdminTagihan() {
  const [tagihan, setTagihan] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchTagihan = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tagihan_sewa")
        .select(`
          *,
          user:users (
            profile:user_profiles (nama_lengkap),
            room:rooms (room_number)
          )
        `)
        .order("jatuh_tempo", { ascending: true });

      if (error) throw error;

      const formattedData = data?.map((item: any) => ({
        ...item,
        user: {
          profile: Array.isArray(item.user?.profile) ? item.user.profile[0] : item.user?.profile,
          room: Array.isArray(item.user?.room) ? item.user.room[0] : item.user?.room,
        },
      })) as Tagihan[];

      setTagihan(formattedData || []);
    } catch (error: any) {
      console.error("Error fetching tagihan:", error.message);
      toast.error("Gagal memuat data tagihan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTagihan();
  }, [fetchTagihan]);

  const verifikasiTagihan = async (id: string, isApproved: boolean, rejectReason?: string) => {
    setIsUpdating(true);
    
    const updatePromise = async () => {
      const updateData: any = {
        status: isApproved ? "paid" : "unpaid",
        verified_at: isApproved ? new Date().toISOString() : null,
      };

      // Jika ditolak, hapus bukti dan beri keterangan agar penghuni tahu alasannya
      if (!isApproved) {
        updateData.bukti_transfer = null;
        if (rejectReason) updateData.keterangan = `Ditolak Admin: ${rejectReason}`;
      } else {
        // Jika diterima, bersihkan pesan error sebelumnya jika ada
        updateData.keterangan = null;
      }

      const { error } = await supabase
        .from("tagihan_sewa")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setTagihan((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updateData } : t))
      );
    };

    try {
      await toast.promise(updatePromise(), {
        loading: isApproved ? "Memverifikasi pembayaran..." : "Menolak pembayaran...",
        success: isApproved ? "Pembayaran berhasil disetujui!" : "Pembayaran ditolak!",
        error: "Terjadi kesalahan sistem.",
      });
    } catch (error) {
      console.error("Error updating tagihan:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    tagihan, loading, isUpdating, fetchTagihan, verifikasiTagihan,
  };
}