import { useNavigate } from "react-router-dom";
import { useProfileCheck } from "../../../hooks/useProfileCheck";
import { useKontrak } from "../../../hooks/useKontrak";
import { useTagihan } from "../../../hooks/useTagihan";

export default function SewaView() {
  const navigate = useNavigate();
  const { profileData, loading: profileLoading } = useProfileCheck();
  const {
    activeContract,
    getRemainingDays,
    loading: contractLoading,
  } = useKontrak();

  const {
    tagihanAktif,
    riwayatTagihan,
    loading: tagihanLoading,
  } = useTagihan();

  const isContractComplete = profileData?.is_contract_complete === true;

  const sisaHari = activeContract
    ? getRemainingDays(activeContract.akhir_sewa)
    : 0;
  const contractEndDate = activeContract
    ? new Date(activeContract.akhir_sewa).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const isUserBaru = !activeContract;
  const isSisaHariValid = activeContract?.status === "aktif" && sisaHari <= 14;
  const canRenew = isUserBaru || isSisaHariValid;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (profileLoading || contractLoading || tagihanLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0] shadow-inner">
        {/* Header */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button
            onClick={() => navigate("/dashboard")}
            title="Kembali ke Dashboard"
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
            Tagihan Sewa
          </h1>
        </div>

        <div className="p-5 space-y-6">
          {/* SECTION STATUS KONTRAK */}
          {!isContractComplete ? (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[20px] p-4 shadow-lg shadow-orange-200 relative overflow-hidden flex items-center justify-between">
              <div className="absolute right-0 top-0 opacity-10">
                <svg
                  className="w-24 h-24 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                </svg>
              </div>
              <div className="relative z-10 text-white flex-1 pr-4">
                <h2 className="text-sm font-black mb-1">
                  Aktivasi Kontrak Sewa
                </h2>
                <p className="text-[10px] text-orange-50 font-medium leading-snug">
                  Anda wajib mengisi kontrak sebelum melakukan pembayaran sewa
                  kamar.
                </p>
              </div>
              <button
                onClick={() => navigate("/kontrak/perpanjang")}
                className="relative z-10 bg-white text-orange-600 text-[10px] font-black px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap"
              >
                BUAT KONTRAK
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
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
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                    Masa Aktif Sewa
                  </p>
                  <p className="text-xs font-black text-gray-800">
                    {contractEndDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => navigate("/kontrak")}
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center shrink-0"
                  title="Dashboard Kontrak"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </button>
                <button
                  disabled={!canRenew}
                  onClick={() => navigate("/kontrak/perpanjang")}
                  className={`${canRenew ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : "bg-gray-100 text-gray-400 cursor-not-allowed"} text-[10px] font-black px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  {isUserBaru ? "BUAT KONTRAK" : "PERPANJANG"}
                </button>
              </div>
            </div>
          )}

          {/* CARD TAGIHAN BULAN INI */}
          <div className="bg-white rounded-[24px] p-5 shadow-lg shadow-indigo-100/50 border border-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none"></div>

            {!isContractComplete ? (
              <div className="text-center py-6 relative z-10">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-black text-gray-800 uppercase mb-1">
                  Belum Ada Kontrak Aktif
                </h3>
                <p className="text-xs text-gray-500 px-4 leading-relaxed">
                  Silakan ajukan atau selesaikan pengisian kontrak terlebih
                  dahulu untuk dapat menerbitkan tagihan kamar Anda.
                </p>
                <div className="w-full bg-gray-100 text-gray-400 text-xs font-bold py-3.5 rounded-xl text-center border border-gray-200 mt-5">
                  Isi Kontrak Untuk Membayar
                </div>
              </div>
            ) : tagihanAktif ? (
              <>
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div>
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                      Tagihan Bulan Ke-{tagihanAktif.urutan_bulan}
                    </span>
                    <h3 className="text-gray-500 text-xs font-medium">
                      Periode: {tagihanAktif.periode_tagihan}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border shadow-sm ${tagihanAktif.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-red-50 text-red-600 border-red-100"}`}
                  >
                    {tagihanAktif.status === "pending"
                      ? "Diproses"
                      : "Belum Bayar"}
                  </span>
                </div>

                <div className="mb-6 relative z-10">
                  <p className="text-3xl font-black text-gray-800 tracking-tight">
                    {formatRupiah(tagihanAktif.nominal_tagihan)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-[11px] font-bold">
                      Jatuh Tempo:{" "}
                      <span className="text-gray-700">
                        {formatDate(tagihanAktif.jatuh_tempo)}
                      </span>
                    </p>
                  </div>
                </div>

                {tagihanAktif.status === "pending" ? (
                  <div className="w-full bg-amber-50 text-amber-600 text-xs font-bold py-3.5 rounded-xl text-center border border-amber-200">
                    Menunggu Verifikasi Admin
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      navigate("/sewa/bayar", {
                        state: { tagihan: tagihanAktif },
                      })
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                  >
                    Bayar Sekarang
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
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-6 relative z-10">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-black text-gray-800 uppercase mb-1">
                  Semua Tagihan Lunas
                </h3>
                <p className="text-xs text-gray-500">
                  Saat ini tidak ada beban tagihan yang harus dibayar.
                </p>
              </div>
            )}
          </div>

          {/* RIWAYAT TRANSAKSI DINAMIS (DENGAN KLIK DETAIL) */}
          <div>
            <div className="flex justify-between items-center mb-4 pl-1">
              <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">
                Riwayat Transaksi
              </h3>
            </div>

            {riwayatTagihan.length > 0 ? (
              <div className="space-y-3">
                {riwayatTagihan.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/sewa/detail/${item.id}`)}
                    className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 border border-emerald-100">
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
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-800">
                          Sewa {item.periode_tagihan}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">
                          {formatDate(item.updated_at || item.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xs text-gray-800">
                        {formatRupiah(item.nominal_tagihan)}
                      </p>
                      <p className="text-[9px] font-black uppercase text-emerald-500 mt-0.5 tracking-wide">
                        Lunas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic text-center py-5 bg-white/50 rounded-xl border border-dashed border-gray-300">
                Belum ada riwayat pembayaran yang lunas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
