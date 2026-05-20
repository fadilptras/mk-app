import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProfileCheck() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setLoading(true);
        // 1. Ambil Sesi User Login
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          setLoading(false);
          return;
        }
        
        setUser(authUser);

        // 2. Ambil data dari tabel users, LAKUKAN JOIN ke tabel rooms untuk nama kamar
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            is_profile_complete, 
            is_contract_complete, 
            biaya_sewa, 
            biaya_deposit, 
            room_id, 
            email,
            rooms ( room_number )
          `)
          .eq('id', authUser.id)
          .single();

        if (userError && userError.code !== 'PGRST116') throw userError;

        setIsProfileComplete(userData?.is_profile_complete || false);

        // 3. Ambil data profil dari user_profiles (nama, alamat, nik)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();
            
        // 4. GABUNGKAN SEMUA DATA 
        setProfileData({
          email: authUser.email, 
          room_number: userData?.rooms?.room_number || null, // Ambil nomor kamar dari join tabel
          ...profile,           
          ...userData            
        });

      } catch (error) {
        console.error("Gagal memeriksa profil user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  return { loading, user, isProfileComplete, profileData };
}