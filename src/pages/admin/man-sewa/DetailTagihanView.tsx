import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminTagihan } from "../../../hooks/admin/tagihan/useManageTagihan";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, FileText, Image as ImageIcon, ShieldAlert, History, AlertTriangle } from "lucide-react";

export default function DetailTagihanView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tagihan, loading, isUpdating, verifikasiTagihan } = useAdminTagihan();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const selectedTagihan = tagihan.find((t) => t.id === id);

  const cleanPeriodeText = (text: string) => {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : text;
  };

  const isOverdue = selectedTagihan 
    ? new Date(selectedTagihan.jatuh_tempo) < new Date(new Date().setHours(0,0,0,0)) 
    : false;

  const userTagihanHistory = useMemo(() => {
    if (!selectedTagihan) return [];
    return tagihan
      .filter(t => t.user_id === selectedTagihan.user_id)
      .sort((a, b) => new Date(a.jatuh_tempo).getTime() - new Date(b.jatuh_tempo).getTime());
  }, [tagihan, selectedTagihan]);

  useEffect(() => {
    if (!loading && !selectedTagihan) {
      toast.error("Data tagihan tidak ditemukan!");
      navigate("/admin/tagihan");
    }
  }, [loading, selectedTagihan, navigate]);

  const handleApprove = async () => {
    if (!selectedTagihan) return;
    const confirmApprove = window.confirm("Konfirmasi pembayaran ini sudah lunas?");
    if (confirmApprove) {
      await verifikasiTagihan(selectedTagihan.id, true);
      navigate("/admin/tagihan");
    }
  };

  const handleCashApprove = async () => {
    if (!selectedTagihan) return;
    const confirmApprove = window.confirm("Konfirmasi bahwa penghuni telah membayar secara tunai (Cash) dan ubah status menjadi Lunas?");
    if (confirmApprove) {
      await verifikasiTagihan(selectedTagihan.id, true);
      toast.success("Pembayaran tunai berhasil dicatat!");
      navigate("/admin/tagihan");
    }
  };

  const submitReject = async () => {
    if (!selectedTagihan) return;
    if (!rejectReason.trim()) {
      toast.error("Harap isi alasan penolakan");
      return;
    }
    await verifikasiTagihan(selectedTagihan.id, false, rejectReason);
    setRejectModalOpen(false);
    navigate("/admin/tagihan");
  };

  if (loading || !selectedTagihan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Detail...</p>
      </div>
    );
  }

  const getStatusDisplay = (status: string, overdue: boolean) => {
    if (status === "paid") return { label: "Lunas", bg: "bg-emerald-100", color: "text-emerald-700" };
    if (status === "pending") return { label: "Menunggu Verifikasi", bg: "bg-amber-100", color: "text-amber-700" };
    if (status === "unpaid" && overdue) return { label: "Telat Bayar", bg: "bg-rose-600", color: "text-white" };
    return { label: "Belum Bayar", bg: "bg-rose-100", color: "text-rose-700" };
  };

  const statusInfo = getStatusDisplay(selectedTagihan.status, isOverdue);

  return (
    <div className="px-5 mt-6 space-y-5 pb-10 max-w-2xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/admin/tagihan")} 
            title="Kembali"
            aria-label="Kembali ke halaman sebelumnya"
            className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0D2F5C]" />
          </button>
          <div>
            <h1 className="text-lg font-black text-[#0D2F5C] uppercase tracking-widest">Detail Tagihan</h1>
            <p className="text-[#7A93B5] text-xs font-bold mt-0.5">Kamar {selectedTagihan.user?.room?.room_number}</p>
          </div>
        </div>
        <button 
          onClick={() => setHistoryModalOpen(true)}
          className="bg-[#0D2F5C] text-white p-2.5 rounded-2xl shadow-sm hover:bg-blue-900 transition-colors flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Rekap Tagihan</span>
        </button>
      </div>

      {/* Panel Verifikasi Transfer */}
      {selectedTagihan.status === "pending" && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-blue-200 p-5 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Panel Verifikasi</h3>
            </div>
            <p className="text-xs font-medium text-blue-800 mb-5">Penghuni mengunggah bukti transfer. Silakan periksa lampiran di bawah.</p>
            <div className="grid grid-cols-2 gap-3">
                <button disabled={isUpdating} onClick={() => setRejectModalOpen(true)} className="w-full bg-white border-2 border-rose-200 text-rose-600 py-3.5 rounded-2xl text-xs font-black tracking-widest hover:bg-rose-50 transition-all uppercase flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" /> Tolak
                </button>
                <button disabled={isUpdating} onClick={handleApprove} className="w-full bg-emerald-500 text-white py-3.5 rounded-2xl text-xs font-black tracking-widest hover:bg-emerald-600 transition-all uppercase shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Konfirmasi
                </button>
            </div>
        </div>
      )}

      {/* Panel Pembayaran Tunai (Cash Bypass) */}
      {selectedTagihan.status === "unpaid" && (
        <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2 mb-1">
                  Pembayaran Tunai
                </h3>
                <p className="text-xs font-medium text-emerald-800">Penghuni membayar langsung ke pengurus?</p>
              </div>
              <button disabled={isUpdating} onClick={handleCashApprove} className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-700 transition-all uppercase shadow-md flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Set Lunas
              </button>
            </div>
        </div>
      )}

      {/* Informasi Dasar */}
      <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 space-y-6">
        <div className={`p-4 rounded-2xl flex justify-between items-center ${statusInfo.bg}`}>
          <p className={`text-[10px] font-black uppercase tracking-widest ${selectedTagihan.status === 'unpaid' && isOverdue ? 'text-rose-100' : 'text-slate-500'}`}>Status</p>
          <p className={`text-xs font-black uppercase tracking-widest flex items-center gap-1 ${statusInfo.color}`}>
            {isOverdue && selectedTagihan.status === 'unpaid' && <AlertTriangle className="w-4 h-4" />}
            {statusInfo.label}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#0D2F5C] border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Data Tagihan</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Penghuni</p>
              <p className="font-bold text-[#0D2F5C] text-sm truncate">{selectedTagihan.user?.profile?.nama_lengkap || "-"}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Periode</p>
              <p className="font-bold text-[#0D2F5C] text-sm">{cleanPeriodeText(selectedTagihan.periode_tagihan)}</p>
            </div>
            <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jatuh Tempo</p>
                <p className={`font-bold text-sm ${isOverdue && selectedTagihan.status === 'unpaid' ? 'text-rose-600' : 'text-slate-700'}`}>
                  {formatDate(selectedTagihan.jatuh_tempo)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                <p className="font-black text-blue-600 text-lg">{formatCurrency(selectedTagihan.nominal_tagihan)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lampiran Bukti */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-[#0D2F5C]">
            <ImageIcon className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Bukti Transfer</h3>
          </div>
          <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200 min-h-[200px] flex items-center justify-center overflow-hidden">
            {selectedTagihan.bukti_transfer ? (
              <a href={selectedTagihan.bukti_transfer} target="_blank" rel="noreferrer" className="block w-full text-center group">
                <img src={selectedTagihan.bukti_transfer} alt="Bukti Transfer" className="max-w-full rounded-xl object-contain max-h-[300px] mx-auto group-hover:scale-[1.02] transition-transform" onError={(e) => (e.currentTarget.src = "/placeholder-image.png")} />
              </a>
            ) : (
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Belum Ada Bukti</p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL REKAP KONTRAK USER */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#0D2F5C] text-white shrink-0">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">Rekap Tagihan Penghuni</h2>
                <p className="text-[10px] text-blue-200 font-medium mt-0.5">{selectedTagihan.user?.profile?.nama_lengkap}</p>
              </div>
              <button 
                onClick={() => setHistoryModalOpen(false)} 
                title="Tutup"
                aria-label="Tutup modal rekap"
                className="text-white/70 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4">
                {userTagihanHistory.map((historyItem) => {
                  const hOverdue = historyItem.status === "unpaid" && new Date(historyItem.jatuh_tempo) < new Date(new Date().setHours(0,0,0,0));
                  let dotColor = "bg-slate-300";
                  if (historyItem.status === "paid") dotColor = "bg-emerald-500 ring-emerald-100";
                  if (historyItem.status === "pending") dotColor = "bg-amber-500 ring-amber-100";
                  if (hOverdue) dotColor = "bg-rose-500 ring-rose-100";

                  return (
                    <div key={historyItem.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ${dotColor}`}></div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-black text-[#0D2F5C] uppercase">{cleanPeriodeText(historyItem.periode_tagihan)}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            historyItem.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                            historyItem.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            hOverdue ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {hOverdue && historyItem.status === 'unpaid' ? 'Telat' : historyItem.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500">Jatuh Tempo: {formatDate(historyItem.jatuh_tempo)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tolak Tagihan */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#0D2F5C] text-white flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest">Tolak Pembayaran</h2>
              <button 
                onClick={() => setRejectModalOpen(false)}
                title="Tutup"
                aria-label="Tutup modal tolak tagihan"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <textarea required rows={4} placeholder="Alasan penolakan..." className="w-full px-4 py-3 bg-slate-50 rounded-2xl border text-sm outline-none" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}></textarea>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-2">
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 font-black text-slate-500 text-xs">Batal</button>
              <button disabled={!rejectReason} onClick={submitReject} className="px-4 py-2 bg-rose-600 text-white font-black text-xs rounded-xl disabled:opacity-50">Tolak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}