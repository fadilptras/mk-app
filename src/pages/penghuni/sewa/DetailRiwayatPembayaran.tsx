import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileCheck } from "../../../hooks/useProfileCheck";
import { supabase } from "../../../lib/supabase";
import html2canvas from "html2canvas";

import InvoiceTemplate from "../../../components/penghuni/InvoiceTemplate";

export default function DetailBayarView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { loading: profileLoading } = useProfileCheck();

  const [loadingTagihan, setLoadingTagihan] = useState(true);
  const [detailTagihan, setDetailTagihan] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchSingleTagihan = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("tagihan_sewa")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setDetailTagihan(data);
      } catch (err: any) {
        alert("Gagal memuat arsip detail riwayat transaksi.");
        navigate("/sewa");
      } finally {
        setLoadingTagihan(false);
      }
    };

    fetchSingleTagihan();
  }, [id, navigate]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatFullDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return (
      new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  const handleDownloadInvoice = async () => {
    if (!detailTagihan) return;
    setIsExporting(true);

    setTimeout(async () => {
      const element = document.getElementById("invoice-capture-area");
      if (!element) {
        setIsExporting(false);
        return;
      }

      try {
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `Invoice_MK_${detailTagihan.id.split("-")[0].toUpperCase()}.png`;
        link.click();
      } catch (error) {
        console.error("PNG Export Error:", error);
        alert("Gagal mengunduh gambar invoice.");
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  if (profileLoading || loadingTagihan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isPaid = detailTagihan?.status === "paid";
  const isPending = detailTagihan?.status === "pending";

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 overflow-x-hidden relative">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0] flex flex-col pb-6">
        
        {isExporting && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white mb-3"></div>
            <h2 className="text-sm font-bold tracking-wide">
              Menyiapkan Gambar Struk...
            </h2>
          </div>
        )}

        {/* STICKY NAVBAR */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          {/* FIX AXE: Menambah aria-label pada tombol navigasi kembali */}
          <button
            onClick={() => navigate("/sewa")}
            aria-label="Kembali ke Tagihan Sewa"
            title="Kembali ke Tagihan Sewa"
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">
            Detail Transaksi
          </h1>
        </div>

        <div className="px-5 pt-8 pb-6 flex-1">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-indigo-900/10 overflow-hidden mx-auto w-full max-w-[360px]">
            {/* BAGIAN ATAS TIKET */}
            <div className="px-6 pt-8 pb-6 text-center bg-white relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-[4px] border-white shadow-md z-10 relative ${
                  isPaid
                    ? "bg-emerald-500 text-white"
                    : isPending
                      ? "bg-amber-400 text-white"
                      : "bg-rose-500 text-white"
                }`}
              >
                {isPaid ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : isPending ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                Total Pembayaran
              </h2>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {formatRupiah(detailTagihan?.nominal_tagihan || 0)}
              </h1>

              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isPaid
                      ? "bg-emerald-50 text-emerald-600"
                      : isPending
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {isPaid
                    ? "Pembayaran Berhasil"
                    : isPending
                      ? "Sedang Diproses"
                      : "Pembayaran Gagal"}
                </span>
              </div>
            </div>

            {/* GARIS PUTUS-PUTUS & POTONGAN TIKET */}
            <div className="relative flex items-center justify-between z-10">
              <div className="w-6 h-6 bg-[#BFDDF0] rounded-full absolute -left-3 shadow-inner"></div>
              <div className="w-full border-t-[2.5px] border-dashed border-gray-200 mx-5"></div>
              <div className="w-6 h-6 bg-[#BFDDF0] rounded-full absolute -right-3 shadow-inner"></div>
            </div>

            {/* BAGIAN BAWAH TIKET */}
            <div className="px-6 pt-6 pb-8 bg-gray-50/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Nomor Referensi</span>
                  <span className="font-mono font-bold text-gray-800">
                    MK-{detailTagihan?.id.split("-")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Periode Sewa</span>
                  <span className="font-bold text-indigo-600">{detailTagihan?.periode_tagihan}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Bulan Ke-</span>
                  <span className="font-bold text-gray-800">{detailTagihan?.urutan_bulan}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Waktu Transaksi</span>
                  <span className="font-bold text-gray-800">
                    {formatFullDate(detailTagihan?.tanggal_upload).replace("WIB", "").trim()}
                  </span>
                </div>

                <div className="border-t border-gray-200/60 my-2"></div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Verifikator</span>
                  <span className="font-bold text-gray-800">Admin Mutiara Kost</span>
                </div>

                {/* Gambar Struk (Bisa Dilihat) */}
                {detailTagihan?.bukti_transfer && (
                  <div className="pt-2">
                    {/* FIX AXE: Mengubah div yang memiliki aksi onClick menjadi tag <button> */}
                    <button
                      className="w-full flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:border-indigo-400"
                      onClick={() => window.open(detailTagihan.bukti_transfer, "_blank")}
                      title="Klik untuk melihat struk asli"
                      aria-label="Lihat Bukti Transfer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-bold text-gray-600">Bukti_Transfer.jpg</span>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wide px-2">
                        Lihat
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TOMBOL DOWNLOAD INVOICE */}
        <div className="px-8 pb-8 relative z-10">
          <button
            onClick={handleDownloadInvoice}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-4 rounded-2xl shadow-lg shadow-indigo-900/20 transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Invoice (PNG)
          </button>
        </div>
      </div>

      <div className="absolute top-0 -left-[9999px] pointer-events-none">
        <InvoiceTemplate detailTagihan={detailTagihan} />
      </div>
    </div>
  );
}