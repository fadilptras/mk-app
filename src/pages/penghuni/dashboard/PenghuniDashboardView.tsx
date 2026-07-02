import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { useProfileCheck } from "../../../hooks/useProfileCheck";
import { useTagihan } from "../../../hooks/useTagihan";
import AnnouncementSection from "../../../components/penghuni/AnnouncementSection";

export default function PenghuniDashboardView() {
  const navigate = useNavigate();

  const { loading: profileLoading, user, profileData } = useProfileCheck();
  const {
    tagihanAktif,
    riwayatTagihan,
    loading: tagihanLoading,
  } = useTagihan();

  const [riwayatLaporan, setRiwayatLaporan] = useState<any[]>([]);
  const [loadingLaporan, setLoadingLaporan] = useState(true);

  const isContractComplete = profileData?.is_contract_complete === true;

  // Fetch riwayat laporan
  useEffect(() => {
    const fetchLaporan = async () => {
      if (!user) {
        setLoadingLaporan(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("id, category, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setRiwayatLaporan(data || []);
      } catch (error) {
        console.error("Gagal mengambil laporan:", error);
      } finally {
        setLoadingLaporan(false);
      }
    };

    fetchLaporan();
  }, [user]);

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

  const getAllActivities = () => {
    const mappedTagihan = riwayatTagihan.map((t) => ({
      ...t,
      activity_type: "tagihan",
      sort_date: new Date(t.updated_at || t.created_at).getTime(),
    }));

    const mappedLaporan = riwayatLaporan.map((l) => ({
      ...l,
      activity_type: "laporan",
      sort_date: new Date(l.created_at).getTime(),
    }));

    const combined = [...mappedTagihan, ...mappedLaporan];
    return combined.sort((a, b) => b.sort_date - a.sort_date).slice(0, 3);
  };

  const activities = getAllActivities();

  const getReportStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return { text: "Menunggu", color: "text-amber-500" };
      case "PROCESSING":
      case "IN_PROGRESS": return { text: "Diproses", color: "text-blue-500" };
      case "RESOLVED": return { text: "Selesai", color: "text-emerald-500" };
      case "REJECTED": return { text: "Ditolak", color: "text-rose-500" };
      default: return { text: status, color: "text-gray-500" };
    }
  };

  if (profileLoading || tagihanLoading || loadingLaporan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] pb-24 font-sans text-gray-800">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0] shadow-inner">
        {/* HEADER */}
        <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-700 pt-6 pb-16 px-5 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/profile/edit")} className="relative group focus:outline-none">
                <div className="w-12 h-12 bg-white/20 p-1 rounded-full backdrop-blur-md border border-white/30 transform group-active:scale-95 transition-all shadow-xl">
                  <div className="w-full h-full bg-indigo-50 rounded-full overflow-hidden flex items-center justify-center border border-white/50">
                    {profileData?.foto_profile ? (
                      <img src={profileData.foto_profile} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-indigo-700 font-black text-lg uppercase">{profileData?.nama_lengkap?.charAt(0) || user?.email?.charAt(0)}</span>
                    )}
                  </div>
                </div>
              </button>
              <div>
                <p className="text-indigo-200 text-xs font-semibold tracking-wide mb-0.5">Halo, Selamat Datang 👋</p>
                <h1 className="text-xl font-black text-white tracking-tight leading-tight line-clamp-2 max-w-[170px]">{profileData?.nama_lengkap || "Penghuni"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/notifications")} className="bg-white/20 p-2.5 rounded-[16px] backdrop-blur-md border border-white/30 text-white shadow-lg active:scale-90 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              </button>
              <button onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }} className="flex items-center justify-center p-2.5 bg-rose-100/90 backdrop-blur-md border border-rose-200 rounded-[16px] text-rose-600 shadow-lg active:scale-90 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 -mt-10 relative z-20 space-y-5">
          <AnnouncementSection />

          {/* GRID 4 FITUR */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Sewa",
                path: "/sewa",
                icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
                gradient: "from-indigo-500 to-blue-600",
              },
              {
                label: "WiFi",
                path: "/wifi",
                icon: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
                gradient: "from-sky-400 to-blue-500",
              },
              {
                label: "Listrik",
                path: "/listrik",
                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                gradient: "from-amber-400 to-orange-500",
              },
              {
                label: "Lapor",
                path: "/lapor",
                icon: "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z",
                gradient: "from-rose-400 to-pink-500",
              },
            ].map((menu, idx) => (
              <button
                key={idx}
                onClick={() => navigate(menu.path)}
                className="flex flex-col items-center gap-2.5 p-3 rounded-[16px] bg-white border border-gray-100 shadow-sm group active:scale-90 transition-all"
              >
                <div
                  className={`w-[48px] h-[48px] rounded-2xl bg-gradient-to-br ${menu.gradient} text-white shadow-lg flex items-center justify-center`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d={menu.icon}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-black text-black uppercase tracking-tighter">
                  {menu.label}
                </span>
              </button>
            ))}
          </div>

          {/* BANNER PERATURAN KOST */}
          <button
            onClick={() => navigate("/peraturan")}
            className="w-full bg-indigo-900 rounded-[24px] p-4 flex items-center justify-between shadow-lg relative overflow-hidden group"
          >
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/5 skew-x-[-20deg] translate-x-8 group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white uppercase tracking-wider">
                  Tata Tertib Kost
                </p>
                <p className="text-[10px] text-indigo-300 font-bold uppercase">
                  Panduan & Peraturan Hunian
                </p>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-indigo-400 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* CARD TAGIHAN DINAMIS */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-800 p-6 rounded-[32px] shadow-xl relative overflow-hidden text-white border border-indigo-500/20">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            {!isContractComplete ? (
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-300 tracking-widest mb-1">
                      Perhatian
                    </p>
                    <h4 className="text-base font-black tracking-wide uppercase">
                      Kontrak Belum Aktif
                    </h4>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-indigo-200 font-bold mb-0.5 leading-relaxed">
                      Selesaikan kontrak sewa
                      <br />
                      untuk melihat tagihan.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/kontrak/perpanjang")}
                    className="bg-amber-400 text-amber-900 text-[11px] font-black px-5 py-2.5 rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    BUAT KONTRAK
                  </button>
                </div>
              </div>
            ) : tagihanAktif ? (
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${tagihanAktif.status === "pending" ? "bg-amber-400" : "bg-rose-400 animate-pulse"}`}
                      ></span>
                      {tagihanAktif.status === "pending"
                        ? "Menunggu Verifikasi"
                        : "Tagihan Aktif"}
                    </p>
                    <h4 className="text-base font-black tracking-wide uppercase">
                      Periode {tagihanAktif.periode_tagihan}
                    </h4>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white border border-white/20 shadow-sm uppercase">
                    {profileData?.nomor_kamar || "KAMAR KOST"}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-indigo-200 font-bold mb-0.5 uppercase tracking-tighter">
                      Total Tagihan
                    </p>
                    <p className="text-2xl font-black tracking-tighter">
                      {formatRupiah(tagihanAktif.nominal_tagihan)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/sewa")}
                    className={`${tagihanAktif.status === "pending" ? "bg-white/20 text-white" : "bg-white text-indigo-700"} text-[11px] font-black px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-all uppercase`}
                  >
                    {tagihanAktif.status === "pending"
                      ? "CEK STATUS"
                      : "BAYAR SEKARANG"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 text-center py-2">
                <div className="w-12 h-12 bg-white/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
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
                <h4 className="text-sm font-black tracking-wide uppercase text-white mb-1">
                  Semua Tagihan Lunas
                </h4>
                <p className="text-xs text-indigo-200 font-bold">
                  Tidak ada tagihan yang perlu dibayar saat ini.
                </p>
              </div>
            )}
          </div>

          {/* AKTIVITAS TERAKHIR GABUNGAN DINAMIS */}
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 space-y-4">
            <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">
              Aktivitas Terakhir
            </h3>

            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.map((item, index) => (
                  <div key={index}>
                    {item.activity_type === "tagihan" ? (
                      // DESAIN AKTIVITAS TAGIHAN
                      <div
                        onClick={() => navigate(`/sewa/detail/${item.id}`)}
                        className="flex items-center justify-between p-3 rounded-2xl border border-transparent transition-colors hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-gray-800 uppercase">
                              Sewa {item.periode_tagihan}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                              {formatDate(item.updated_at || item.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-gray-800">
                            {formatRupiah(item.nominal_tagihan)}
                          </p>
                          <p className="text-[9px] font-black uppercase text-emerald-500 tracking-wider mt-1">
                            Lunas
                          </p>
                        </div>
                      </div>
                    ) : (
                      // DESAIN AKTIVITAS LAPORAN
                      <div
                        onClick={() => navigate("/lapor")}
                        className="flex items-center justify-between p-3 rounded-2xl border border-transparent transition-colors hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-gray-800 uppercase max-w-[120px] truncate">
                              Lap. {item.category}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                              {formatDate(item.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-gray-800">
                            Pengaduan
                          </p>
                          <p
                            className={`text-[9px] font-black uppercase tracking-wider mt-1 ${getReportStatusText(item.status).color}`}
                          >
                            {getReportStatusText(item.status).text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-[11px] text-gray-400 italic">
                    Belum ada riwayat aktivitas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
