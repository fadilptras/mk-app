import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications'; // Pastikan path ini sesuai dengan lokasi hook-mu

export default function NotificationView() {
  const navigate = useNavigate();
  // Mengambil data dan fungsi dari hook In-App Notification
  const { notifications, isLoading, markAsRead } = useNotifications();

  // Fungsi untuk menentukan warna dan ikon berdasarkan tipe notifikasi
  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'tagihan':
        return {
          icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
          color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        };
      case 'kontrak':
        return {
          icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
          color: "bg-blue-50 text-blue-600 border-blue-100"
        };
      case 'laporan':
        return {
          icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
          color: "bg-orange-50 text-orange-600 border-orange-100"
        };
      default: // 'info' atau pengumuman
        return {
          icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
          color: "bg-indigo-50 text-indigo-600 border-indigo-100"
        };
    }
  };

  // Fungsi memformat tanggal Supabase ke format lokal Indonesia
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  // Aksi saat notifikasi di-klik (tandai dibaca & arahkan halaman)
  const handleNotificationClick = (notif: any) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    
    // Opsional: Arahkan otomatis ke halaman terkait berdasarkan tipe
    if (notif.type === 'tagihan') navigate('/sewa');
    if (notif.type === 'kontrak') navigate('/kontrak');
    if (notif.type === 'laporan') navigate('/lapor');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            title='button' 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">Notifikasi</h1>
            <p className="text-xs font-bold text-gray-400">Pembaruan & Informasi Kost</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map((notif) => {
              const style = getIconAndColor(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`relative p-4 rounded-3xl flex gap-4 transition-all duration-300 active:scale-95 cursor-pointer border ${
                    notif.is_read ? 'bg-white border-gray-100 opacity-70' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Indikator Titik Merah (Belum Dibaca) */}
                  {!notif.is_read && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${style.color}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={style.icon} />
                    </svg>
                  </div>
                  
                  <div className="flex-1 pt-1 pr-4">
                    <h3 className={`font-black text-sm uppercase tracking-tight ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notif.title}
                    </h3>
                    <p className={`text-[12px] font-medium leading-relaxed mt-1 ${notif.is_read ? 'text-gray-400' : 'text-gray-600'}`}>
                      {notif.message}
                    </p>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mt-3">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State jika tidak ada notifikasi */}
        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-24 px-10 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 border-2 border-gray-100">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.022 6.022 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">Belum Ada Notifikasi</h3>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
              Semua pemberitahuan tentang tagihan, kontrak, dan pengumuman kost akan muncul di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}