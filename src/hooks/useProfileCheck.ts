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

        // 2. Cek status di tabel users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_profile_complete')
          .eq('id', authUser.id)
          .single();

        if (userError) throw userError;

        setIsProfileComplete(userData?.is_profile_complete || false);

        // 3. Jika profil sudah lengkap, ambil datanya dari user_profiles
        if (userData?.is_profile_complete) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();
            
          if (profile) setProfileData(profile);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  return { loading, user, isProfileComplete, profileData };
}