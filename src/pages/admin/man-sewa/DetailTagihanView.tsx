import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminTagihan } from "../../../hooks/useAdminTagihan";
import { formatDate, formatCurrency } from "../../../utils/formatters";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react";

export default function DetailTagihanView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tagihan, loading, isUpdating, verifikasiTagihan } = useAdminTagihan();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const selectedTagihan = tagihan.find((t) => t.id === id);

  useEffect(() => {
    if (!loading && !selectedTagihan) {
      toast.error("Data tagihan tidak ditemukan!");
      navigate("/admin/tagihan");
    }
  }, [loading, selectedTagihan, navigate]);

  const handleApprove = async () => {
    if (!selectedTagihan) return;
    const confirmApprove = window.confirm(
      "Konfirmasi pembayaran ini sudah lunas?",
    );
    if (confirmApprove) {
      await verifikasiTagihan(selectedTagihan.id, true);
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
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Memuat Detail Tagihan...
        </p>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid":
        return { label: "Lunas", color: "text-emerald-500" };
      case "pending":
        return {
          label: "Dibayar (Menunggu Verifikasi)",
          color: "text-amber-500",
        };
      case "unpaid":
        return { label: "Belum Bayar", color: "text-rose-500" };
      default:
        return { label: status, color: "text-slate-500" };
    }
  };

  const statusInfo = getStatusDisplay(selectedTagihan.status);

  return (
    <div className="px-5 mt-6 space-y-5 pb-10">
      <Toaster position="top-center" />

      <div className="flex items-center gap-3">
        <button
          title="Kembali ke daftar tagihan"
          aria-label="Kembali"
          onClick={() => navigate("/admin/tagihan")}
          className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#0D2F5C]" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#0D2F5C] uppercase tracking-widest">
            Detail Tagihan
          </h1>
          <p className="text-[#7A93B5] text-xs font-medium mt-0.5">
            Kamar {selectedTagihan.user?.room?.room_number}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 space-y-6">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Status Saat Ini
          </p>
          <p
            className={`text-sm font-black uppercase tracking-widest ${statusInfo.color}`}
          >
            {statusInfo.label}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#0D2F5C] border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">
              Informasi Tagihan
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Penghuni
              </p>
              <p className="font-bold text-[#0D2F5C] text-sm">
                {selectedTagihan.user?.profile?.nama_lengkap || "-"}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Periode
              </p>
              <p className="font-bold text-[#0D2F5C] text-sm">
                {selectedTagihan.periode_tagihan}
              </p>
            </div>
            <div className="col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Jatuh Tempo
                </p>
                <p className="font-bold text-rose-600 text-sm">
                  {formatDate(selectedTagihan.jatuh_tempo)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Total Tagihan
                </p>
                <p className="font-black text-blue-600 text-lg">
                  {formatCurrency(selectedTagihan.nominal_tagihan)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
            Bukti Transfer Penghuni
          </p>
          <div className="bg-slate-100 rounded-2xl p-2 border border-slate-200 min-h-[250px] flex items-center justify-center overflow-hidden">
            {selectedTagihan.bukti_transfer ? (
              <a
                href={selectedTagihan.bukti_transfer}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center"
              >
                <img
                  src={selectedTagihan.bukti_transfer}
                  alt="Bukti Transfer"
                  className="max-w-full rounded-xl object-contain max-h-[400px] mx-auto hover:opacity-90 transition-opacity cursor-zoom-in"
                  onError={(e) =>
                    (e.currentTarget.src = "/placeholder-image.png")
                  }
                />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-3">
                  Klik gambar untuk memperbesar
                </p>
              </a>
            ) : (
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Belum Ada Lampiran
              </p>
            )}
          </div>
        </div>

        {selectedTagihan.keterangan && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-amber-800 text-xs font-medium leading-relaxed">
              <span className="font-black uppercase tracking-widest text-[9px] block mb-1.5">
                Catatan Penghuni saat bayar:
              </span>
              "{selectedTagihan.keterangan}"
            </p>
          </div>
        )}

        {/* Tombol Aksi (Hanya tampil jika status Pending/Dibayar) */}
        {selectedTagihan.status === "pending" && (
          <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <button
              disabled={isUpdating}
              onClick={() => setRejectModalOpen(true)}
              className="w-full bg-rose-50 text-rose-600 py-4 rounded-xl text-xs font-black tracking-widest hover:bg-rose-100 disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Tolak Bayar
            </button>
            <button
              disabled={isUpdating}
              onClick={handleApprove}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl text-xs font-black tracking-widest hover:bg-emerald-700 disabled:opacity-50 transition-all uppercase shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Konfirmasi Lunas
            </button>
          </div>
        )}
      </div>

      {/* Modal Tolak Tagihan */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#0D2F5C] text-white">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Tolak Pembayaran
              </h2>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl text-xs border border-rose-100 font-medium leading-relaxed">
                Anda akan menolak pembayaran tagihan dari{" "}
                <strong>{selectedTagihan.user?.profile?.nama_lengkap}</strong>.
                Status akan dikembalikan menjadi Belum Bayar.
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Misal: Bukti transfer buram atau nominal tidak sesuai..."
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
    </div>
  );
}
