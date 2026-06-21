import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import toast from "react-hot-toast";

export function useManageLaporan() {
  const [reports, setReports] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [penghuni, setPenghuni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Menarik data secara terpisah (Frontend Join) persis seperti sistem lama
      const [reportsRes, roomsRes, usersRes] = await Promise.all([
        supabase.from("reports").select("*").order("created_at", { ascending: false }),
        supabase.from("rooms").select("*"),
        supabase.from("users").select("*") // Gunakan tabel users/penghuni yang biasa kamu pakai
      ]);

      if (reportsRes.error) throw reportsRes.error;

      setReports(reportsRes.data || []);
      setRooms(roomsRes.data || []);
      setPenghuni(usersRes.data || []);
    } catch (error: any) {
      console.error("Fetch reports error:", error);
      toast.error("Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReportStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("reports").update({ status: newStatus }).eq("id", id);
      if (error) throw error;

      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      toast.success("Status laporan berhasil diperbarui!");
      return { success: true };
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(`Gagal: ${error.message}`);
      return { success: false, message: error.message };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { reports, rooms, penghuni, loading, isUpdating, updateReportStatus };
}