import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminKontrak } from "../../../hooks/useAdminKontrak";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Download,
  FileText,
} from "lucide-react";
import html2pdf from "html2pdf.js";

// Mengimpor komponen PDF Template dari folder penghuni
import ContractPDFTemplate from "../../../components/penghuni/ContractPDFTemplate";

export default function DetailKontrakView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kontrak, loading, isUpdating, setujuiKontrak, tolakKontrak } =
    useAdminKontrak();

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
      "Setujui kontrak ini? Status penghuni akan diubah menjadi Aktif.",
    );
    if (confirmApprove) {
      await setujuiKontrak(selectedKontrak.id, selectedKontrak.user_id);
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

  // Fungsi Export PDF menggunakan html2pdf.js seperti di halaman penghuni
  const handleExportPDF = () => {
    if (!selectedKontrak) return;
    setIsExporting(true);

    setTimeout(() => {
      const element = document.getElementById("pdf-document-content");
      if (!element) {
        setIsExporting(false);
        toast.error("Gagal menyiapkan dokumen PDF");
        return;
      }

      const opt = {
        margin: [12, 12, 12, 12] as [number, number, number, number],
        filename: `Kontrak_Kamar_${selectedKontrak.user?.room?.room_number}_${selectedKontrak.user?.profile?.nama_lengkap}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          setIsExporting(false);
          toast.success("PDF berhasil diunduh");
        })
        .catch((err: any) => {
          console.error("Export Error:", err);
          setIsExporting(false);
          toast.error("Terjadi kesalahan saat mengunduh PDF");
        });
    }, 400); // Memberi waktu React untuk merender DOM tersembunyi
  };

  if (loading || !selectedKontrak) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Memuat Detail Kontrak...
        </p>
      </div>
    );
  }

  // Mapping data profile dari tabel admin untuk dimasukkan ke template penghuni
  const mappedProfileData = {
    nama_lengkap: selectedKontrak.user?.profile?.nama_lengkap,
    room_number: selectedKontrak.user?.room?.room_number,
    // Info NIK, Alamat, Email mungkin kosong jika query admin tidak mengambilnya
    // Namun format PDF sudah memiliki fallback ("-") di template-nya
  };

  return (
    <div className="px-5 mt-6 space-y-5 pb-10 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Loading Overlay saat Export PDF */}
      {isExporting && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white mb-3"></div>
          <h2 className="text-sm font-bold tracking-wide">
            Menyiapkan Dokumen PDF...
          </h2>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          title="Kembali ke daftar kontrak"
          aria-label="Kembali"
          onClick={() => navigate("/admin/kontrak")}
          className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#0D2F5C]" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#0D2F5C] uppercase tracking-widest">
            Detail Kontrak
          </h1>
          <p className="text-[#7A93B5] text-xs font-medium mt-0.5">
            Kamar {selectedKontrak.user?.room?.room_number}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 space-y-6">
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Status Kontrak
            </p>
            <p
              className={`text-sm font-black uppercase tracking-widest ${selectedKontrak.status === "menunggu_persetujuan" ? "text-orange-500" : selectedKontrak.status === "aktif" ? "text-emerald-500" : "text-rose-500"}`}
            >
              {selectedKontrak.status.replace("_", " ")}
            </p>
          </div>

          {/* TOMBOL EXPORT MENGGUNAKAN HTML2PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
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
              <p className="font-bold text-[#0D2F5C] text-sm">
                {selectedKontrak.user?.profile?.nama_lengkap || "-"}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Jenis Kontrak
              </p>
              <p className="font-bold text-blue-600 text-sm capitalize">
                {selectedKontrak.jenis_kontrak}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Durasi Sewa
              </p>
              <p className="font-bold text-slate-700 text-sm">
                {selectedKontrak.lama_sewa} Bulan
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Biaya / Bulan
              </p>
              <p className="font-black text-emerald-600 text-sm">
                {formatCurrency(selectedKontrak.harga_per_bulan)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
                Mulai Masuk
              </p>
              <p className="font-bold text-blue-800 text-sm">
                {formatDate(selectedKontrak.mulai_sewa)}
              </p>
            </div>
            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-100">
              <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">
                Akhir Kontrak
              </p>
              <p className="font-bold text-rose-800 text-sm">
                {formatDate(selectedKontrak.akhir_sewa)}
              </p>
            </div>
          </div>
        </div>

        {selectedKontrak.status === "menunggu_persetujuan" && (
          <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <button
              disabled={isUpdating}
              onClick={() => setRejectModalOpen(true)}
              className="w-full bg-rose-50 text-rose-600 py-4 rounded-xl text-xs font-black tracking-widest hover:bg-rose-100 disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Tolak Kontrak
            </button>
            <button
              disabled={isUpdating}
              onClick={handleApprove}
              className="w-full bg-blue-600 text-white py-4 rounded-xl text-xs font-black tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all uppercase shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Setujui Kontrak
            </button>
          </div>
        )}
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#0D2F5C] text-white">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Tolak Kontrak
              </h2>
              <button
                title="Tutup Modal"
                aria-label="Tutup modal penolakan"
                onClick={() => setRejectModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl text-xs border border-rose-100 font-medium leading-relaxed">
                Penolakan kontrak atas nama{" "}
                <strong>{selectedKontrak.user?.profile?.nama_lengkap}</strong>.
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tulis alasan..."
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
      <div className="absolute top-0 -left-[9999px] w-[760px] bg-white text-black p-2 pointer-events-none">
        <ContractPDFTemplate
          contract={selectedKontrak}
          profileData={mappedProfileData}
        />
      </div>
    </div>
  );
}
