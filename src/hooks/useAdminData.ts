import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminData() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [penghuni, setPenghuni] = useState<any[]>([]);
  const [wifiSettings, setWifiSettings] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Kamar
      const { data: roomsData, error: roomsError } = await supabase.from('rooms').select('*').order('room_number', { ascending: true });
      if (roomsError) console.error('Error rooms:', roomsError.message);
      else setRooms(roomsData || []);

      // 2. Fetch Users
      const { data: usersData, error: usersError } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (usersError) console.error('Error users:', usersError.message);
      else setPenghuni(usersData || []);

      // 3. Fetch WiFi (Pakai maybeSingle agar aman walau tabel kosong)
      const { data: wifiData, error: wifiError } = await supabase.from('wifi_networks').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (wifiError) console.error('Error wifi:', wifiError.message);
      else if (wifiData) setWifiSettings(wifiData);

      // 4. Fetch Laporan (Dengan Radar Console Log)
      const { data: reportsData, error: reportsError } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      
      // Buka Inspect > Console di Browser untuk melihat ini!
      console.log('--- DEBUG LAPORAN ---');
      console.log('Error dari Supabase:', reportsError?.message || 'Aman tidak ada error DB');
      console.log('Data yang ditarik:', reportsData);
      console.log('---------------------');

      if (reportsError) {
        console.error('Gagal fetch laporan:', reportsError.message);
      } else {
        setReports(reportsData || []);
      }

    } catch (error: any) {
      console.error('Fatal error fetching admin data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- CRUD KAMAR ---
  const addRoom = async (nomor: string, meterNumber: string, meterName: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('rooms').insert([{ room_number: nomor, status: 'AVAILABLE', meter_number: meterNumber || null, meter_name: meterName || null }]);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  const updateRoom = async (id: string, data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('rooms').update(data).eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  const deleteRoom = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  // --- CRUD PENGHUNI ---
  const createAccount = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: 'Mutiara123', options: { data: { role: formData.role } } });
      if (authError) throw authError;

      if (authData?.user) {
        const { error: userError } = await supabase.from('users').insert([{
          id: authData.user.id, email: formData.email, role: formData.role, room_id: formData.kamar_id || null,
          tanggal_masuk: formData.tanggal_masuk || null, tanggal_tagihan: formData.tanggal_tagihan || null,
          biaya_sewa: formData.biaya_sewa ? Number(formData.biaya_sewa) : null, biaya_deposit: formData.biaya_deposit ? Number(formData.biaya_deposit) : null,
          no_rek_pembayaran: formData.no_rek_pembayaran || null, nama_rek_pembayaran: formData.nama_rek_pembayaran || null, is_profile_complete: false
        }]);
        if (userError) throw userError;
      }
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  const updateUser = async (id: string, data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('users').update(data).eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  const deleteUser = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  // --- LAINNYA ---
  const updateRoomElectricity = async (roomId: string, token: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('rooms').update({ meter_number: token }).eq('id', roomId);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  const updateWifiSettings = async (ssid: string, password: string) => {
    setIsSubmitting(true);
    try {
      await supabase.from('wifi_networks').update({ is_active: false }).eq('is_active', true);
      const { error } = await supabase.from('wifi_networks').insert([{ ssid, password, is_active: true }]);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  // --- UPDATE LAPORAN ---
  const updateReportStatus = async (id: string, status: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').update({ status }).eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (error: any) { return { success: false, message: error.message }; } finally { setIsSubmitting(false); }
  };

  return {
    rooms, penghuni, wifiSettings, reports, loading, isSubmitting,
    addRoom, updateRoom, deleteRoom,
    createAccount, updateUser, deleteUser,
    updateRoomElectricity, updateWifiSettings, updateReportStatus, refreshData: fetchData
  };
}