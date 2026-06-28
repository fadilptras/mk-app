import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";

export interface Pengumuman {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
  expires_at?: string | null;
  is_active?: boolean;
}

export function useManagePengumuman() {
  const [announcements, setAnnouncements] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setAnnouncements(data);
    if (error) toast.error("Gagal memuat pengumuman");
    setLoading(false);
  }, []);

  const sendAnnounce = async (data: Omit<Pengumuman, 'id' | 'created_at'>) => {
    const { error } = await supabase.from("announcements").insert([{ ...data, is_active: true }]);
    if (error) {
      toast.error(`Gagal share: ${error.message}`);
      return false;
    }

    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users').select('id').neq('role', 'admin');

      if (!usersError && usersData && usersData.length > 0) {
        const bulkNotifications = usersData.map((u) => ({
          user_id: u.id,
          type: 'info',
          title: data.type.toLowerCase().includes('maintenance') ? 'Info Maintenance' : 'Pengumuman Baru',
          message: data.title, 
        }));
        await supabase.from('notifications').insert(bulkNotifications);
      }
    } catch (err) {
      console.error("Gagal broadcast:", err);
    }

    toast.success("Pengumuman terpasang!");
    fetchAnnouncements();
    return true;
  };

  // FUNGSI BARU: Menghentikan pengumuman
  const stopAnnounce = async (id: string) => {
    const { error } = await supabase.from("announcements").update({ is_active: false }).eq("id", id);
    if (error) {
      toast.error(`Gagal menghentikan: ${error.message}`);
      return false;
    }
    toast.success("Pengumuman dihentikan!");
    fetchAnnouncements();
    return true;
  };

  const deleteAnnounce = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast.error(`Gagal menghapus: ${error.message}`);
      return false;
    }
    toast.success("Pengumuman dihapus!");
    fetchAnnouncements();
    return true;
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { announcements, loading, sendAnnounce, stopAnnounce, deleteAnnounce, refreshAnnouncements: fetchAnnouncements };
}