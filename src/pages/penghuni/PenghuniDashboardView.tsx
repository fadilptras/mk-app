import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import AnnouncementSection from '../../components/penghuni/AnnouncementSection';

export default function PenghuniDashboardView() {
  const navigate = useNavigate();
  const { loading, user, profileData } = useProfileCheck();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] pb-24 font-sans text-gray-800">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0] shadow-inner">
        
        {/* HEADER */}
        <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-700 pt-6 pb-16 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/profile/edit')} className="relative group focus:outline-none">
                <div className="w-14 h-14 bg-white/20 p-1 rounded-full backdrop-blur-md border border-white/30 transform group-active:scale-95 transition-all shadow-xl">
                  <div className="w-full h-full bg-indigo-50 rounded-full overflow-hidden flex items-center justify-center border border-white/50">
                    {profileData?.foto_profile ? (
                      <img src={profileData.foto_profile} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-indigo-700 font-black text-xl uppercase">{profileData?.nama_lengkap?.charAt(0) || user?.email?.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 bg-pink-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
              </button>
              <div>
                <p className="text-indigo-200 text-sm font-semibold tracking-wide mb-0.5">Halo, Selamat Datang 👋</p>
                <h1 className="text-lg font-black text-white tracking-tight leading-tight">{profileData?.nama_lengkap || 'Penghuni'}</h1>
              </div>
            </div>
            <button 
              onClick={() => navigate('/notifications')} 
              aria-label="Notifikasi"
              className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/30 text-white shadow-lg active:scale-90 transition-all"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-indigo-700 rounded-full animate-pulse"></span>
              </div>
            </button>
          </div>
        </div>

        <div className="px-5 -mt-10 relative z-20 space-y-5">
          
          {/* SECTION PENGUMUMAN */}
          <AnnouncementSection />

          {/* GRID 4 FITUR */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Sewa', path: '/sewa', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', gradient: 'from-indigo-500 to-blue-600' },
              { label: 'WiFi', path: '/wifi', icon: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z', gradient: 'from-sky-400 to-blue-500' },
              { label: 'Listrik', path: '/listrik', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', gradient: 'from-amber-400 to-orange-500' },
              { label: 'Lapor', path: '/lapor', icon: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z', gradient: 'from-rose-400 to-pink-500' }
            ].map((menu, idx) => (
              <button 
                key={idx} 
                onClick={() => navigate(menu.path)} 
                /* Ubah bagian ini: mengganti ${menu.bg} dengan bg-white dan menyamakan border */
                className="flex flex-col items-center gap-2.5 p-3 rounded-[16px] bg-white border border-gray-100 shadow-sm group active:scale-90 transition-all"
              >
                <div className={`w-[48px] h-[48px] rounded-2xl bg-gradient-to-br ${menu.gradient} text-white shadow-lg flex items-center justify-center`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d={menu.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-tighter">{menu.label}</span>
              </button>
            ))}
          </div>

          {/* BANNER PERATURAN KOST */}
          <button 
            onClick={() => navigate('/peraturan')}
            className="w-full bg-indigo-900 rounded-[24px] p-4 flex items-center justify-between shadow-lg relative overflow-hidden group"
          >
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/5 skew-x-[-20deg] translate-x-8 group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white uppercase tracking-wider">Tata Tertib Kost</p>
                <p className="text-[10px] text-indigo-300 font-bold uppercase">Panduan & Peraturan Hunian</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* CARD TAGIHAN */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-800 p-6 rounded-[32px] shadow-xl relative overflow-hidden text-white border border-indigo-500/20">
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <div className="flex justify-between items-start mb-6 relative z-10">
               <div><p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1 flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>Tagihan Aktif</p><h4 className="text-base font-black tracking-wide uppercase">Periode Mei 2026</h4></div>
               <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white border border-white/20 shadow-sm uppercase">Kamar A-01</div>
             </div>
             <div className="flex justify-between items-end relative z-10">
               <div><p className="text-xs text-indigo-200 font-bold mb-0.5 uppercase tracking-tighter">Total Tagihan</p><p className="text-2xl font-black tracking-tighter">Rp 1.500.000</p></div>
               <button onClick={() => navigate('/sewa')} className="bg-white text-indigo-700 text-[11px] font-black px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-all">BAYAR SEKARANG</button>
             </div>
          </div>

          {/* AKTIVITAS TERAKHIR */}
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">Aktivitas Terakhir</h3>
              <button onClick={() => navigate('/sewa')} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">Semua</button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Sewa Kamar April', date: '05 Mei 2026', amount: 'Rp 1.500.000', status: 'Lunas', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { title: 'Pembelian Token', date: '02 Mei 2026', amount: 'Rp 100.000', status: 'Lunas', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-transparent transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={item.icon} /></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-800 uppercase">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-800">{item.amount}</p>
                    <p className="text-[9px] font-black uppercase text-emerald-500 tracking-wider mt-0.5">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}