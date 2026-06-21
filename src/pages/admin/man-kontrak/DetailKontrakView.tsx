import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManageKontrak } from "../../../hooks/admin/kontrak/useManageKontrak";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Clock
} from "lucide-react";
import html2pdf from "html2pdf.js";

// Mengimpor komponen PDF Template
import ContractPDFTemplate from "../../../components/penghuni/ContractPDFTemplate";

export default function DetailKontrakView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { kontrak, loading, isUpdating, setujuiKontrak, tolakKontrak } = useManageKontrak();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const selectedKontrak = kontrak.find((c) => c.id === id);

  useEffect(() => {
    if (!loading && !selectedKontrak) {
      toast.error("Data kontrak tidak ditemukan!");
      navigate("/admin/kontrak");
    }
  }, [loading, selectedKontrak, navigate]);

  const handleApprove = async () => {
    if (!selectedKontrak) return;
    const confirmApprove = window.confirm(
      "Setujui kontrak ini? Sistem akan otomatis membuat tagihan."
    );
    if (confirmApprove) {
      await setujuiKontrak(selectedKontrak);
      navigate("/admin/kontrak");
    }
  };

  const submitReject = async () => {
    if (!selectedKontrak) return;
    if (!rejectReason.trim()) {
      toast.error("Harap isi alasan penolakan");
      return;
    }
    await tolakKontrak(selectedKontrak.id, rejectReason);
    setRejectModalOpen(false);
    navigate("/admin/kontrak");
  };

  const exportPDF = () => {
    const element = document.getElementById("contract-pdf-content");
    if (!element || !selectedKontrak) return;

    setIsExporting(true);
    toast.loading("Menyiapkan dokumen PDF...", { id: "pdf-toast" });

    // FIX TS 2345: Menambahkan as assertions untuk menyesuaikan tipe data ketat Html2PdfOptions
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Kontrak_${selectedKontrak.user?.room?.room_number}_${selectedKontrak.user?.profile?.nama_lengkap}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.success("PDF berhasil diunduh!", { id: "pdf-toast" });
        setIsExporting(false);
      })
      .catch((err: any) => {
        console.error("PDF Export Error:", err);
        toast.error("Gagal mengunduh PDF.", { id: "pdf-toast" });
        setIsExporting(false);
      });
  };

  if (loading || !selectedKontrak) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Memuat Detail...
        </p>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "aktif":
        return { label: "Aktif", bg: "bg-emerald-100", color: "text-emerald-700" };
      case "menunggu_persetujuan":
        return { label: "Menunggu Persetujuan", bg: "bg-amber-100", color: "text-amber-700" };
      case "ditolak":
        return { label: "Ditolak", bg: "bg-rose-100", color: "text-rose-700" };
      case "selesai":
        return { label: "Selesai", bg: "bg-blue-100", color: "text-blue-700" };
      default:
        return { label: status, bg: "bg-slate-100", color: "text-slate-700" };
    }
  };

  const statusInfo = getStatusDisplay(selectedKontrak.status);

  // FIX TS 2322: Mengembalikan mappedProfileData untuk props PDF Template
  const mappedProfileData = {
    nama_lengkap: selectedKontrak.user?.profile?.nama_lengkap,
    room_number: selectedKontrak.user?.room?.room_number,
  };

  return (
    <div className="px-5 mt-6 space-y-5 pb-10 max-w-2xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* FIX AXE: Tambah title dan aria-label */}
          <button
            title="Kembali ke daftar kontrak"
            aria-label="Kembali"
            onClick={() => navigate("/admin/kontrak")}
            className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0D2F5C]" />
          </button>
          <div>
            <h1 className="text-lg font-black text-[#0D2F5C] uppercase tracking-widest">
              Detail Kontrak
            </h1>
            <p className="text-[#7A93B5] text-xs font-bold mt-0.5">
              Kamar {selectedKontrak.user?.room?.room_number}
            </p>
          </div>
        </div>

        <button
          onClick={exportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-[#0D2F5C] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-colors disabled:opacity-50 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Unduh PDF</span>
        </button>
      </div>

      {/* Action Panel: Hanya muncul jika menunggu persetujuan */}
      {selectedKontrak.status === "menunggu_persetujuan" && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-blue-200 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">
              Persetujuan Kontrak
            </h3>
          </div>
          <p className="text-xs font-medium text-blue-800 mb-5">
            Penghuni ini mengajukan kontrak sewa. Periksa detail di bawah sebelum menyetujui. Tagihan akan otomatis dibuat setelah disetujui.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isUpdating}
              onClick={() => setRejectModalOpen(true)}
              className="w-full bg-white border-2 border-rose-200 text-rose-600 py-3.5 rounded-2xl text-xs font-black tracking-widest hover:bg-rose-50 transition-all uppercase flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Tolak
            </button>
            <button
              disabled={isUpdating}
              onClick={handleApprove}
              className="w-full bg-[#0D2F5C] text-white py-3.5 rounded-2xl text-xs font-black tracking-widest hover:bg-blue-900 transition-all uppercase shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Setujui
            </button>
          </div>
        </div>
      )}

      {/* Informasi Dasar */}
      <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 space-y-6">
        
        {/* Status Badge */}
        <div className={`p-4 rounded-2xl flex justify-between items-center ${statusInfo.bg}`}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Status Kontrak
          </p>
          <p className={`text-xs font-black uppercase tracking-widest ${statusInfo.color}`}>
            {statusInfo.label}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#0D2F5C] border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">
              Informasi Pengajuan
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Penghuni
              </p>
              <p className="font-bold text-[#0D2F5C] text-sm truncate">
                {selectedKontrak.user?.profile?.nama_lengkap || "-"}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Jenis Kontrak
              </p>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${selectedKontrak.jenis_kontrak === 'baru' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {selectedKontrak.jenis_kontrak}
              </span>
            </div>
            
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Biaya / Bulan
              </p>
              <p className="font-black text-emerald-600 text-sm">
                {formatCurrency(selectedKontrak.harga_per_bulan)}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Uang Deposit
              </p>
              <p className="font-black text-amber-600 text-sm">
                {(selectedKontrak as any).deposit && (selectedKontrak as any).deposit > 0 
                  ? formatCurrency((selectedKontrak as any).deposit) 
                  : "Tanpa Deposit"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="col-span-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Durasi</p>
                <p className="font-black text-[#0D2F5C] text-sm">{selectedKontrak.lama_sewa} Bulan</p>
             </div>
             <div className="col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 flex justify-between items-center px-4">
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Mulai</p>
                   <p className="font-bold text-[#0D2F5C] text-xs">{formatDate(selectedKontrak.mulai_sewa)}</p>
                </div>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Berakhir</p>
                   <p className="font-bold text-rose-600 text-xs">{formatDate(selectedKontrak.akhir_sewa)}</p>
                </div>
             </div>
          </div>

          {selectedKontrak.status === "ditolak" && selectedKontrak.catatan_admin && (
             <div className="mt-4 bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3">
               <XCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
               <div>
                 <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Alasan Penolakan</h4>
                 <p className="text-sm font-medium text-rose-800 leading-relaxed">{selectedKontrak.catatan_admin}</p>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Modal Tolak Kontrak */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#0D2F5C] text-white">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Tolak Kontrak
              </h2>
              {/* FIX AXE: Tambah title dan aria-label */}
              <button
                title="Tutup Modal"
                aria-label="Tutup"
                onClick={() => setRejectModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Misal: Foto KTP tidak jelas..."
                  className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none resize-none text-sm font-medium"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-black text-slate-500 hover:bg-slate-200 transition-colors uppercase tracking-widest text-[10px]"
              >
                Batal
              </button>
              <button
                disabled={isUpdating || !rejectReason.trim()}
                onClick={submitReject}
                className="px-5 py-2.5 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition-all uppercase tracking-widest text-[10px] disabled:opacity-50"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KOMPONEN TEMPLATE RENDER TERSEMBUNYI UNTUK HTML2PDF */}
      <div className="absolute top-0 -left-[9999px] w-[760px] bg-white text-black p-8">
        <div id="contract-pdf-content">
          <ContractPDFTemplate
            profileData={mappedProfileData}
            contract={selectedKontrak}
          />
        </div>
      </div>
    </div>
  );
}