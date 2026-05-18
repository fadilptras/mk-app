import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { supabase } from '../../lib/supabase';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  created_at: string;
}

export default function AnnouncementSection() {
  const navigate = useNavigate();
  const { loading: isProfileLoading, isProfileComplete: profileComplete } = useProfileCheck();
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, title, content, type, created_at')
          .eq('is_active', true)
          .or(`expires_at.gte.${new Date().toISOString()},expires_at.is.null`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (isProfileLoading || isLoadingAnnouncements) {
    return (
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 animate-pulse h-24"></div>
    );
  }

  // PRIORITAS 1: Profil belum lengkap (Warna MERAH)
  if (!profileComplete) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 rounded-2xl shadow-lg flex items-center gap-4 border border-red-400">
        <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div className="flex-1">
          <p className="text-xs font-black text-white tracking-wide">Aktivasi Akun!</p>
          <p className="text-[10px] font-medium text-red-100 mt-0.5">Lengkapi data diri Anda segera.</p>
        </div>
        <button onClick={() => navigate('/profile/edit')} className="bg-white text-red-600 text-[10px] font-black px-4 py-2 rounded-lg shadow-sm">ISI DATA</button>
      </div>
    );
  }

  // PRIORITAS 2 & 3: Ada Pengumuman Aktif atau Sistem Normal
  return (
    <div className="space-y-4">
      {announcements.length > 0 ? (
        announcements.map((item) => {
          // Pengumuman dinamis: Warna dasar KUNING/ORANGE
          let gradientBorder = 'from-amber-400 to-orange-500';
          let tagBg = 'bg-orange-50';
          let tagText = 'text-orange-600';
          let tagLabel = 'PENGUMUMAN';

          if (item.type === 'warning') {
            tagLabel = 'PENTING';
          } else if (item.type === 'success') {
            tagLabel = 'SUKSES';
          }

          return (
            <div key={item.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gradientBorder}`}></div>
              <div className="flex items-center justify-between mb-2 pl-2">
                <div className={`${tagBg} ${tagText} px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1.5 uppercase`}>
                  {tagLabel}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="pl-2">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{item.content}</p>
              </div>
            </div>
          );
        })
      ) : (
        // DEFAULT WELCOME (Warna HIJAU - Jika tidak ada pengumuman sama sekali)
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-green-500"></div>
          <div className="flex items-center justify-between mb-2 pl-2">
            <div className="bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1.5 uppercase">INFO SISTEM</div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">HARI INI</span>
          </div>
          <div className="pl-2">
            <h3 className="font-bold text-gray-800 text-sm mb-1">Semua Layanan Berjalan Baik</h3>
            <p className="text-[11px] text-gray-500 leading-snug">Selamat beraktivitas! Tidak ada pemeliharaan sistem hari ini.</p>
          </div>
        </div>
      )}
    </div>
  );
}