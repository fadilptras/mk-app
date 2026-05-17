import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminData() {
  const [penghuni, setPenghuni] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPenghuni = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'penghuni')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPenghuni(data || []);
    } catch (err) {
      console.error('Error fetching residents:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      // MENGGUNAKAN TABEL 'kamar' YANG SUDAH ADA
      const { data, error } = await supabase
        .from('kamar') 
        .select('*')
        .order('nomor_kamar', { ascending: true });
      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const addRoom = async (nomorKamar: string, tipeKamar: string, harga: number) => {
    setIsSubmitting(true);
    try {
      // INSERT KE TABEL 'kamar' YANG SUDAH ADA
      const { error } = await supabase
        .from('kamar')
        .insert([{ 
            nomor_kamar: nomorKamar, 
            tipe: tipeKamar, 
            harga: harga,
            status: 'Tersedia' // Asumsi default status
        }]);
      if (error) throw error;
      await fetchRooms();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const createAccount = async (payload: {
    nama_lengkap: string;
    email: string;
    role: string;
    kamar_id: string; // Asumsi menggunakan UUID kamar
    tanggal_masuk: string;
  }) => {
    setIsSubmitting(true);
    try {
      const defaultPassword = 'Mutiara123'; 
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: defaultPassword,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: dbError } = await supabase.from('users').insert([{
          id: authData.user.id,
          email: payload.email,
          nama_lengkap: payload.nama_lengkap,
          role: payload.role,
          kamar_id: payload.kamar_id, // Menyimpan ID Kamar
          tanggal_masuk: payload.tanggal_masuk,
          is_profile_complete: false 
        }]);
        
        if (dbError) throw dbError;

        // Opsi: Update status kamar menjadi 'Terisi'
        // await supabase.from('kamar').update({ status: 'Terisi' }).eq('id', payload.kamar_id);
      }

      await fetchPenghuni();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchPenghuni(), fetchRooms()]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  return { penghuni, rooms, loading, isSubmitting, createAccount, addRoom };
}