import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKontrak } from '../../hooks/useKontrak';
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
  const { activeContract, getRemainingDays } = useKontrak();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [sisaHari, setSisaHari] = useState<number | null>(null);

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

  useEffect(() => {
    if (activeContract && activeContract.status === 'aktif') {
      const hari = getRemainingDays(activeContract.akhir_sewa);
      setSisaHari(hari);
    }
  }, [activeContract, getRemainingDays]);

  return (
    <div className="space-y-4">
      {/* 1. BANNER PERINGATAN PERPANJANGAN (Tambahan khusus H-3) */}
      {sisaHari !== null && sisaHari <= 3 && sisaHari >= 0 && (
        <div className="bg-rose-600 rounded-[24px] p-5 shadow-lg shadow-rose-200 border border-rose-400 relative overflow-hidden animate-pulse">
          <div className="absolute right-0 top-0 opacity-20">
            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h2 className="text-sm font-black uppercase tracking-widest">Kontrak Akan Berakhir!</h2>
            </div>
            <p className="text-[11px] font-bold text-rose-50 leading-relaxed">
              Sisa durasi hunian Anda tinggal <strong>{sisaHari} hari lagi</strong>. Segera ajukan perpanjangan kontrak.
            </p>
            <button 
              onClick={() => navigate('/kontrak/perpanjang')}
              className="w-full bg-white text-rose-600 font-black text-xs py-3 rounded-xl shadow-md active:scale-95 transition-all uppercase tracking-widest"
            >
              PERPANJANG SEKARANG
            </button>
          </div>
        </div>
      )}

      {/* 2. LIST PENGUMUMAN (Tetap Tampil Semua) */}
      {!isLoadingAnnouncements && announcements.length > 0 ? (
        announcements.map((item) => {
          const isInfo = item.type === 'info';
          return (
            <div key={item.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isInfo ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
              <div className="flex items-center justify-between mb-2 pl-2">
                <div className={`${isInfo ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1.5 uppercase`}>
                  {item.type}
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
      ) : !isLoadingAnnouncements && (
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