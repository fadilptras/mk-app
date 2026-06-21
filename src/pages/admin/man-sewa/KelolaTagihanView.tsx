import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTagihan } from "../../../hooks/admin/tagihan/useManageTagihan";
import { formatCurrency } from "../../../utils/formatters";
import { Search, CheckSquare, XSquare, List, ChevronRight, Clock, CalendarDays, ShieldCheck, AlertTriangle, Archive } from "lucide-react";

export default function KelolaTagihanView() {
  const { tagihan, loading } = useAdminTagihan();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"verifikasi" | "daftar" | "riwayat">("verifikasi");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPeriode, setFilterPeriode] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const cleanPeriodeText = (text: string) => {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : text;
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const getBulanMenunggak = (dueDateString: string) => {
    const due = new Date(dueDateString);
    const today = new Date();
    const diffMonths = (today.getFullYear() - due.getFullYear()) * 12 + (today.getMonth() - due.getMonth());
    return diffMonths > 0 ? diffMonths : 0;
  };

  const thresholdDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 2);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { pendingList, aktifList, riwayatList } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const pending: typeof tagihan = [];
    const aktif: typeof tagihan = [];
    const riwayat: typeof tagihan = [];

    tagihan.forEach((t) => {
      if (t.status === "pending") {
        pending.push(t);
        return;
      }

      const dueDate = new Date(t.jatuh_tempo);
      const isPastOrCurrentMonth = 
        dueDate.getFullYear() < currentYear || 
        (dueDate.getFullYear() === currentYear && dueDate.getMonth() <= currentMonth);

      if (isPastOrCurrentMonth) {
        if (t.status === "paid" && dueDate < thresholdDate) {
          riwayat.push(t);
        } else {
          aktif.push(t);
        }
      }
    });

    return { 
      pendingList: pending, 
      aktifList: aktif, 
      riwayatList: riwayat.sort((a, b) => new Date(b.jatuh_tempo).getTime() - new Date(a.jatuh_tempo).getTime()), 
    };
  }, [tagihan, thresholdDate]);

  const availablePeriods = useMemo(() => {
    const sourceData = activeTab === "riwayat" ? riwayatList : aktifList;
    const periodsSet = new Set<string>();
    sourceData.forEach(t => periodsSet.add(cleanPeriodeText(t.periode_tagihan)));
    return Array.from(periodsSet);
  }, [activeTab, aktifList, riwayatList]);

  const filteredTagihan = useMemo(() => {
    const sourceData = activeTab === "riwayat" ? riwayatList : aktifList;

    return sourceData.filter((item) => {
      const matchStatus = 
        filterStatus === "all" || 
        (filterStatus === "unpaid" && item.status === "unpaid") || 
        item.status === filterStatus;

      const cleanPeriode = cleanPeriodeText(item.periode_tagihan);
      const matchPeriode = filterPeriode === "all" || cleanPeriode === filterPeriode;
      
      const userName = item.user?.profile?.nama_lengkap?.toLowerCase() || "";
      const roomNum = item.user?.room?.room_number?.toLowerCase() || "";
      const matchSearch = userName.includes(searchQuery.toLowerCase()) || roomNum.includes(searchQuery.toLowerCase());
      
      return matchStatus && matchPeriode && matchSearch;
    });
  }, [activeTab, aktifList, riwayatList, filterStatus, filterPeriode, searchQuery]);

  return (
    <div className="px-5 mt-6 space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">Kelola Tagihan</h1>
        <p className="text-[#7A93B5] text-xs font-medium mt-1">Pantau pembayaran dan kelola tunggakan penghuni</p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 relative overflow-x-auto custom-scrollbar">
        <button onClick={() => { setActiveTab("verifikasi"); setFilterPeriode("all"); }} className={`flex-1 min-w-[110px] flex justify-center items-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${activeTab === "verifikasi" ? "bg-white text-amber-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
          <Clock className="w-4 h-4" /> Verifikasi
          {pendingList.length > 0 && <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">{pendingList.length}</span>}
        </button>
        <button onClick={() => { setActiveTab("daftar"); setFilterStatus("all"); setFilterPeriode("all"); }} className={`flex-1 min-w-[110px] flex justify-center items-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${activeTab === "daftar" ? "bg-white text-[#0D2F5C] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
          <List className="w-4 h-4" /> Aktif
        </button>
        <button onClick={() => { setActiveTab("riwayat"); setFilterStatus("all"); setFilterPeriode("all"); }} className={`flex-1 min-w-[110px] flex justify-center items-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 ${activeTab === "riwayat" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
          <Archive className="w-4 h-4" /> Arsip
        </button>
      </div>
      
      {/* KONTEN VERIFIKASI */}
      {activeTab === "verifikasi" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          {loading ? (
             <div className="animate-pulse space-y-3">
                 {[1, 2].map(i => <div key={i} className="bg-slate-100 h-24 w-full rounded-2xl"></div>)}
             </div>
          ) : pendingList.length === 0 ? (
             <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-center">
                 <ShieldCheck className="w-10 h-10 text-emerald-400 mb-2" />
                 <p className="text-emerald-700 text-xs font-black uppercase tracking-widest">KOSONG!</p>
                 <p className="text-emerald-600/70 text-[10px] font-medium max-w-[200px]">Tidak ada tagihan yang perlu diverifikasi saat ini.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {pendingList.map((item) => (
                <div key={item.id} onClick={() => navigate(`/admin/tagihan/${item.id}`)} className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kamar {item.user?.room?.room_number || "--"}</p>
                      <p className="text-sm font-black text-[#0D2F5C] truncate">{item.user?.profile?.nama_lengkap || "Tanpa Nama"}</p>
                      <p className="font-bold text-amber-600 text-xs mt-0.5">{formatCurrency(item.nominal_tagihan)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* KONTEN DAFTAR AKTIF & RIWAYAT */}
      {(activeTab === "daftar" || activeTab === "riwayat") && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          
          <div className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 flex flex-col gap-4">
            
            {activeTab === "daftar" && (
              <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl w-full overflow-x-auto custom-scrollbar">
                <button onClick={() => setFilterStatus("all")} className={`flex-1 min-w-[80px] flex items-center justify-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === "all" ? "bg-[#0D2F5C] text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}>
                  Semua
                </button>
                <button onClick={() => setFilterStatus("unpaid")} className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === "unpaid" ? "bg-rose-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}>
                  <XSquare className="w-3.5 h-3.5" /> Belum/Telat
                </button>
                <button onClick={() => setFilterStatus("paid")} className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === "paid" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-200"}`}>
                  <CheckSquare className="w-3.5 h-3.5" /> Lunas
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative md:w-1/3">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select 
                      title="Filter Periode Bulan"
                      aria-label="Pilih Periode Bulan"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-slate-700" 
                      value={filterPeriode} 
                      onChange={(e) => setFilterPeriode(e.target.value)}
                    >
                        <option value="all">SEMUA BULAN</option>
                        {availablePeriods.map(period => (
                            <option key={period} value={period} className="uppercase">{period}</option>
                        ))}
                    </select>
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" placeholder="Cari nama penghuni atau kamar..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading && filteredTagihan.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-100 text-center shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tidak ada data yang sesuai filter.</p>
              </div>
            ) : (
              filteredTagihan.map((item) => {
                const overdue = item.status === "unpaid" && isOverdue(item.jatuh_tempo);
                const tunggakanBulan = getBulanMenunggak(item.jatuh_tempo);
                
                return (
                <div key={item.id} onClick={() => navigate(`/admin/tagihan/${item.id}`)} className={`bg-white p-4 rounded-2xl border ${overdue ? 'border-rose-300 shadow-rose-100' : 'border-slate-100 shadow-sm'} flex flex-col space-y-3 relative overflow-hidden hover:shadow-md transition-all cursor-pointer group`}>
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${item.status === "paid" ? "bg-emerald-400" : overdue ? "bg-rose-600" : "bg-rose-300"}`}></div>
                    <div className="flex justify-between items-start pl-2">
                      <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-black text-[#7A93B5] uppercase tracking-widest block mb-1">Kamar {item.user?.room?.room_number || "--"}</span>
                          <p className="text-sm font-black text-[#0D2F5C] truncate group-hover:text-blue-600 transition-colors">{item.user?.profile?.nama_lengkap || "Tanpa Nama"}</p>
                      </div>
                      
                      {overdue && (
                        <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase flex items-center gap-1 shrink-0 ${tunggakanBulan > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-100 text-rose-700'}`}>
                          <AlertTriangle className="w-3 h-3" /> 
                          {tunggakanBulan > 0 ? `Nunggak ${tunggakanBulan} Bln` : "Telat"}
                        </span>
                      )}

                      {activeTab === "riwayat" && (
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black px-2 py-1 rounded-md uppercase shrink-0">
                          Selesai
                        </span>
                      )}
                    </div>
                    <div className="pl-2 flex justify-between items-end border-t border-slate-50 pt-3">
                      <p className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">{cleanPeriodeText(item.periode_tagihan)}</p>
                      <p className="font-black text-[#0D2F5C] text-sm bg-slate-50 px-2 py-1 rounded-lg">{formatCurrency(item.nominal_tagihan)}</p>
                    </div>
                </div>
              )})
            )}
          </div>
        </div>
      )}
    </div>
  );
}