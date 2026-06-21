import { useState, useMemo } from "react";
import { useManageLaporan } from "../../../hooks/admin/laporan/useManageLaporan";
import { Clock, CheckCircle, Wrench, XCircle, Image as ImageIcon, Inbox } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function KelolaLaporanView() {
  const { reports, rooms, penghuni, loading, isUpdating, updateReportStatus } = useManageLaporan();
  const [activeTab, setActiveTab] = useState<"PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED">("PENDING");

  const filteredReports = useMemo(() => {
    return reports.filter((r) => r.status === activeTab);
  }, [reports, activeTab]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (window.confirm(`Yakin ingin mengubah status laporan ini menjadi ${newStatus}?`)) {
      await updateReportStatus(id, newStatus);
    }
  };

  // Logika pewarnaan dinamis untuk empty state
  const getEmptyStateStyle = () => {
    switch (activeTab) {
      case "PENDING": return { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", icon: "text-amber-400", sub: "text-amber-600/70" };
      case "IN_PROGRESS": return { bg: "bg-blue-50 border-blue-100", text: "text-blue-700", icon: "text-blue-400", sub: "text-blue-600/70" };
      case "RESOLVED": return { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", icon: "text-emerald-400", sub: "text-emerald-600/70" };
      case "REJECTED": return { bg: "bg-rose-50 border-rose-100", text: "text-rose-700", icon: "text-rose-400", sub: "text-rose-600/70" };
      default: return { bg: "bg-slate-50 border-slate-100", text: "text-slate-700", icon: "text-slate-400", sub: "text-slate-600/70" };
    }
  };
  const emptyStyle = getEmptyStateStyle();

  return (
    <div className="px-5 mt-6 space-y-5 pb-10">
      <Toaster position="top-center" />
      <div>
        <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">Kelola Laporan</h1>
        <p className="text-[#7A93B5] text-xs font-medium mt-1">
          Tanggapi keluhan dan perbaikan fasilitas penghuni ({reports.length} Total)
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab("PENDING")} className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "PENDING" ? "bg-amber-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}>
          <Clock className="w-3.5 h-3.5" /> Menunggu
          {reports.filter((r) => r.status === "PENDING").length > 0 && (
            <span className="bg-white text-amber-600 px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">
              {reports.filter((r) => r.status === "PENDING").length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab("IN_PROGRESS")} className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "IN_PROGRESS" ? "bg-blue-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}>
          <Wrench className="w-3.5 h-3.5" /> Diproses
        </button>
        <button onClick={() => setActiveTab("RESOLVED")} className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "RESOLVED" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}>
          <CheckCircle className="w-3.5 h-3.5" /> Selesai
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C]"></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className={`${emptyStyle.bg} border rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-center shadow-sm transition-colors duration-300`}>
          <Inbox className={`w-10 h-10 ${emptyStyle.icon} mb-2`} />
          <p className={`${emptyStyle.text} text-xs font-black uppercase tracking-widest`}>KOSONG!</p>
          <p className={`${emptyStyle.sub} text-[10px] font-medium max-w-[200px]`}>
            Tidak ada laporan di kategori ini saat ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => {
            const pelapor = penghuni.find((p) => p.id === report.user_id);
            const kamar = rooms.find((r) => r.id === report.room_id);

            return (
              <div key={report.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(13,47,92,0.05)] flex flex-col space-y-4">
                {/* Header Laporan */}
                <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                  <div>
                    <span className="text-[10px] font-black text-[#7A93B5] uppercase tracking-widest block mb-1">
                      Kamar {kamar?.room_number || "--"}
                    </span>
                    <p className="text-sm font-black text-[#0D2F5C] truncate">
                      {pelapor?.email || pelapor?.profile?.nama_lengkap || "User Tidak Ditemukan"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {new Date(report.created_at).toLocaleDateString("id-ID", { 
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>

                {/* Body Laporan */}
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[#0D2F5C] text-[9px] font-black uppercase tracking-wider">
                    {report.category}
                  </span>
                  <p className="text-sm text-slate-600 font-medium mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{report.description}"
                  </p>
                  {report.image_url && (
                    <a href={report.image_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-xl">
                      <ImageIcon className="w-4 h-4" /> Lihat Lampiran Foto
                    </a>
                  )}
                </div>

                {/* Tombol Aksi berdasarkan Tab */}
                {activeTab === "PENDING" && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button disabled={isUpdating} onClick={() => handleUpdateStatus(report.id, "REJECTED")} className="bg-rose-50 text-rose-600 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-rose-100 disabled:opacity-50 uppercase flex justify-center items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Tolak
                    </button>
                    <button disabled={isUpdating} onClick={() => handleUpdateStatus(report.id, "IN_PROGRESS")} className="bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-700 disabled:opacity-50 uppercase shadow-md flex justify-center items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Proses
                    </button>
                  </div>
                )}

                {activeTab === "IN_PROGRESS" && (
                  <div className="pt-2">
                    <button disabled={isUpdating} onClick={() => handleUpdateStatus(report.id, "RESOLVED")} className="w-full bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-600 disabled:opacity-50 uppercase shadow-md flex justify-center items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Tandai Selesai
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}