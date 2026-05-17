import { useAdminData } from '../../hooks/useAdminData';

export default function KelolaLaporanView() {
  const { reports, penghuni, rooms, loading, isSubmitting, updateReportStatus } = useAdminData();

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (window.confirm(`Ubah status laporan ini menjadi ${newStatus}?`)) {
      const result = await updateReportStatus(id, newStatus);
      if (result.success) alert('Status laporan berhasil diperbarui!');
      else alert(`Gagal: ${result.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="px-5 mt-6 space-y-4">
      <h3 className="font-black text-sm text-[#0D2F5C] uppercase tracking-tight pl-1">
        Laporan Penghuni ({reports.length})
      </h3>

      {loading ? (
        <p className="text-center text-xs py-10 text-slate-400">Memuat data laporan...</p>
      ) : reports.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-sm font-bold">Belum ada laporan masuk.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const pelapor = penghuni.find(p => p.id === report.user_id);
            const kamar = rooms.find(r => r.id === report.room_id);

            return (
              <div key={report.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-4">
                {/* Header Laporan */}
                <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                  <div>
                    <span className="text-[9px] font-black text-[#7A93B5] uppercase tracking-widest block mb-1">
                      Kamar {kamar?.room_number || '--'}
                    </span>
                    <p className="text-sm font-black text-[#0D2F5C] truncate max-w-[180px]">
                      {pelapor?.email || 'User Tidak Ditemukan'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusColor(report.status)}`}>
                    {report.status || 'PENDING'}
                  </span>
                </div>

                {/* Konten Laporan */}
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[#7A93B5] text-[9px] font-black uppercase tracking-wider">
                    {report.category}
                  </span>
                  <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                    {report.description}
                  </p>
                  {report.image_url && (
                    <div className="mt-3">
                      <a href={report.image_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Lihat Lampiran Foto
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-50">
                  <button 
                    disabled={isSubmitting || report.status === 'IN_PROGRESS'}
                    onClick={() => handleUpdateStatus(report.id, 'IN_PROGRESS')} 
                    className="bg-blue-50 text-blue-600 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-100 disabled:opacity-50 transition-all"
                  >
                    PROSES
                  </button>
                  <button 
                    disabled={isSubmitting || report.status === 'RESOLVED'}
                    onClick={() => handleUpdateStatus(report.id, 'RESOLVED')} 
                    className="bg-emerald-50 text-emerald-600 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-100 disabled:opacity-50 transition-all"
                  >
                    SELESAI
                  </button>
                  <button 
                    disabled={isSubmitting || report.status === 'REJECTED'}
                    onClick={() => handleUpdateStatus(report.id, 'REJECTED')} 
                    className="bg-rose-50 text-rose-600 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-rose-100 disabled:opacity-50 transition-all"
                  >
                    TOLAK
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}