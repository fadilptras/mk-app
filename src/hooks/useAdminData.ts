import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminData() {
  const [penghuni, setPenghuni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPenghuni = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*') // Mengambil semua kolom
        .eq('role', 'penghuni')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPenghuni(data || []);
    } catch (err) {
      console.error('Error fetching residents:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (payload: {
    nama_lengkap: string;
    email: string;
    role: string;
    kamar: string;
    tanggal_masuk: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Default password sementara
      const defaultPassword = 'Mutiara123'; 

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: defaultPassword,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert data ke tabel users
        const { error: dbError } = await supabase.from('users').insert([{
          id: authData.user.id,
          email: payload.email,
          nama_lengkap: payload.nama_lengkap,
          role: payload.role,
          kamar: payload.kamar,
          tanggal_masuk: payload.tanggal_masuk,
          // PERUBAHAN PENTING: Dibuat false agar penghuni wajib melengkapi data KTP dll
          is_profile_complete: false 
        }]);
        
        if (dbError) throw dbError;
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
    fetchPenghuni();
  }, []);

  return { penghuni, loading, isSubmitting, createAccount };
}