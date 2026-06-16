import { useNavigate } from 'react-router-dom';

export default function NotificationView() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Tagihan Sewa Terbit",
      desc: "Tagihan bulan Mei 2026 sudah tersedia. Silakan cek rincian dan lakukan pembayaran sebelum tanggal 5.",
      time: "2 Jam yang lalu",
      icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
      color: "bg-emerald-50 text-emerald-600 border border-emerald-100"
    },
    {
      id: 2,
      title: "Pemeliharaan WiFi",
      desc: "Koneksi akan terputus sementara pukul 23.00 WIB untuk peningkatan kualitas jaringan kost.",
      time: "5 Jam yang lalu",
      icon: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
      color: "bg-blue-50 text-blue-600 border border-blue-100"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC]">
        {/* Header Biru Selaras */}
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm border-b-2 border-indigo-50">
          <button onClick={() => navigate('/dashboard')} title='Kembali ke Dashboard' className="p-2 bg-indigo-50 rounded-full text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Notifikasi</h1>
        </div>

        <div className="p-5 space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex gap-4 items-start active:bg-gray-50 transition-colors cursor-pointer">
              <div className={`w-12 h-12 rounded-2xl flex flex-shrink-0 items-center justify-center shadow-sm ${notif.color}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={notif.icon} />
                </svg>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">{notif.title}</h3>
                </div>
                <p className="text-[11px] font-bold text-gray-500 leading-relaxed">{notif.desc}</p>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-wider mt-3">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State jika tidak ada notifikasi */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-24 px-10 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 border-2 border-gray-100">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Belum Ada Notifikasi</p>
          </div>
        )}
      </div>
    </div>
  );
}