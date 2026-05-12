import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function PenghuniDashboardView() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email || '');
        
        // Cek apakah profil sudah lengkap di tabel users
        const { data: userData } = await supabase
          .from('users')
          .select('is_profile_complete')
          .eq('id', user.id)
          .single();

        if (userData && !userData.is_profile_complete) {
          navigate('/profile/edit'); // Proteksi ekstra
          return;
        }

        // Ambil data detail profil
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (profile) setUserProfile(profile);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <div className="p-6 bg-[#f4f0ec] min-h-screen flex items-center justify-center font-bold">Memuat...</div>;

  return (
    <div className="p-6 pb-24 bg-[#f4f0ec] min-h-screen font-sans">
      
      {/* Header Profile Isometric Style */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[6px_6px_0px_#000] mb-8 mt-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-pink-400 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex items-center justify-center text-white font-black text-2xl overflow-hidden">
          {userProfile?.foto_ktp ? (
             <img src={userProfile.foto_ktp} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            userProfile?.nama_lengkap?.charAt(0).toUpperCase() || 'US'
          )}
        </div>
        <div className="overflow-hidden">
          <h1 className="text-lg font-black text-gray-900 truncate">{userProfile?.nama_lengkap || 'Penghuni'}</h1>
          <p className="text-xs text-gray-600 font-bold truncate">{userEmail}</p>
          <div className="inline-block mt-1 bg-[#a7f3d0] border border-black px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shadow-[1px_1px_0px_#000]">
            PENGHUNI AKTIF
          </div>
        </div>
      </div>

      {/* Card Info Kamar */}
      <div className="bg-blue-500 border-2 border-black rounded-2xl p-6 text-white shadow-[6px_6px_0px_#000] mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white font-bold uppercase text-xs mb-1">Status Kamar</p>
            <h2 className="text-3xl font-black">Kamar A-01</h2>
          </div>
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000]">
            🔑
          </div>
        </div>
        
        <div className="bg-white/20 border-2 border-black rounded-xl p-4 flex justify-between items-end backdrop-blur-sm">
          <div>
            <p className="text-xs text-white font-bold uppercase mb-1">Tagihan Bulan Ini</p>
            <p className="text-xl font-black">Rp 1.500.000</p>
          </div>
          <button className="bg-[#fef08a] text-black border-2 border-black px-4 py-2 rounded-xl text-sm font-black shadow-[3px_3px_0px_#000] active:translate-y-1 active:shadow-[0px_0px_0px_#000] transition-all">
            BAYAR
          </button>
        </div>
      </div>

      {/* Menu Fitur Grid */}
      <h3 className="font-black text-lg mb-4 uppercase">🚀 Fitur Mutiara</h3>
      <div className="grid grid-cols-2 gap-4">
        
        <button className="bg-[#c084fc] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-left hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-2">📜</div>
          <h4 className="font-black text-white text-sm uppercase">Riwayat Pembayaran</h4>
        </button>

        <button className="bg-[#fbcfe8] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-left hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-2">🛠️</div>
          <h4 className="font-black text-black text-sm uppercase">Lapor Keluhan</h4>
        </button>

        <button className="bg-[#93c5fd] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-left hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-2">📋</div>
          <h4 className="font-black text-black text-sm uppercase">Peraturan Kost</h4>
        </button>

        <button className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] text-left hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-2">📞</div>
          <h4 className="font-black text-black text-sm uppercase">Hubungi Admin</h4>
        </button>
        
      </div>
    </div>
  );
}