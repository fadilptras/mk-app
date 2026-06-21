import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";

export interface Pengumuman {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
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
    const { error } = await supabase.from("announcements").insert([data]);
    if (error) {
      toast.error("Gagal share pengumuman");
      return false;
    }
    toast.success("Pengumuman terpasang!");
    fetchAnnouncements();
    return true;
  };

  const deleteAnnounce = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus pengumuman");
    } else {
      toast.success("Pengumuman dihapus");
      fetchAnnouncements();
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { announcements, loading, sendAnnounce, deleteAnnounce };
}