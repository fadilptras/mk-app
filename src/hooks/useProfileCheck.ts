// src/hooks/useProfileCheck.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useProfileCheck() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<any>(null);

  const checkUserStatus = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Ambil Sesi User Login
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setLoading(false);
        return;
      }
      
      setUser(authUser);

      // 2. Ambil data dari tabel users (Melakukan relasi ke tabel rooms)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          is_profile_complete, 
          is_contract_complete, 
          biaya_sewa, 
          biaya_deposit, 
          room_id, 
          email,
          no_rek_pembayaran,
          nama_rek_pembayaran,
          rooms ( room_number )
        `)
        .eq('id', authUser.id)
        .single();

      if (userError && userError.code !== 'PGRST116') throw userError;

      setIsProfileComplete(userData?.is_profile_complete || false);

      // 3. Ambil data profil dari user_profiles
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
            
      const roomsData: any = userData?.rooms;
      const fetchedRoomNumber = Array.isArray(roomsData) 
          ? roomsData[0]?.room_number 
          : roomsData?.room_number;

      // 4. GABUNGKAN SEMUA DATA 
      // DIPERBAIKI: Mengubah urutan properti kustom ke baris paling bawah 
      // agar nilainya aman dari overwrite spread operator database.
      setProfileData({
        ...profile,           
        ...userData,
        email: authUser.email, 
        room_number: fetchedRoomNumber || null            
      });

    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  return { 
    user, 
    loading, 
    isProfileComplete, 
    profileData, 
    refreshProfile: checkUserStatus 
  };
}