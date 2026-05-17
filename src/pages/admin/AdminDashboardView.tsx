import { useAdminData } from '../../hooks/useAdminData';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardView() {
  const { penghuni, rooms, reports, loading } = useAdminData();
  const navigate = useNavigate();

  // Menghitung kamar terisi (berdasarkan user yang memiliki room_id)
  const terisiCount = penghuni.filter(p => p.room_id).length;
  const kosongCount = rooms.length - terisiCount;

  // Mengambil maksimal 3 laporan teratas untuk ditampilkan di halaman depan
  const laporanTerbaru = reports.slice(0, 3);

  return (
    <div className="px-5 mt-6 space-y-6">
      <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">Ringkasan Kos</h3>

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate('/admin/kamar')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(13,47,92,0.02)] active:scale-95 transition-all cursor-pointer">
          <p className="text-[10px] font-bold text-[#7A93B5] uppercase tracking-widest mb-1">Total Unit Kamar</p>
          <p className="text-3xl font-black text-blue-600">{rooms.length}</p>
          <span className="text-[9px] font-black text-blue-400 uppercase mt-2 block">Kelola Kamar →</span>
        </div>
        <div onClick={() => navigate('/admin/penghuni')} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(13,47,92,0.02)] active:scale-95 transition-all cursor-pointer">
          <p className="text-[10px] font-bold text-[#7A93B5] uppercase tracking-widest mb-1">Total Penghuni</p>
          <p className="text-3xl font-black text-emerald-600">{penghuni.length}</p>
          <span className="text-[9px] font-black text-emerald-400 uppercase mt-2 block">Kelola Penghuni →</span>
        </div>
      </div>

      {/* Info Status Kamar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(13,47,92,0.02)] space-y-3">
        <p className="text-[10px] font-bold text-[#7A93B5] uppercase tracking-widest">Okupansi Kamar</p>
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Terisi</p>
            <p className="text-lg font-black text-[#0D2F5C]">{loading ? '--' : terisiCount} Unit</p>
          </div>
          <div className="w-px bg-slate-100 my-1"></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tersedia</p>
            <p className="text-lg font-black text-[#0D2F5C]">{loading ? '--' : kosongCount < 0 ? 0 : kosongCount} Unit</p>
          </div>
        </div>
      </div>

      {/* WIDGET DINAMIS: Komplain / Laporan Terbaru */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pl-1">
          <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight">Laporan Terbaru</h3>
          <button onClick={() => navigate('/admin/laporan')} className="text-[10px] font-black text-blue-600 uppercase tracking-wider hover:underline">
            Lihat Semua →
          </button>
        </div>

        {loading ? (
          <p className="text-center text-xs py-4 text-slate-400">Memuat komplain...</p>
        ) : laporanTerbaru.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center shadow-sm">
            <p className="text-xs font-bold text-slate-400">Tidak ada laporan aktif dari penghuni.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {laporanTerbaru.map((report: any) => {
              const kamar = rooms.find(r => r.id === report.room_id);
              return (
                <div key={report.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black text-xs">
                      {kamar?.room_number || '??'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0D2F5C] line-clamp-1 max-w-[180px]">{report.description}</p>
                      <span className="text-[9px] font-bold text-[#7A93B5] uppercase tracking-wider block mt-0.5">{report.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                    report.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {report.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}