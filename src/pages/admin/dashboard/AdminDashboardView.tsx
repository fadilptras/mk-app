import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../../../hooks/admin/dashboard/useDashboardData";
import { Users, Home, AlertCircle, Receipt, Clock, ArrowRight } from "lucide-react";

export default function AdminDashboardView() {
  const { stats, loading } = useDashboardData();
  const navigate = useNavigate();

  // Pattern SVG untuk motif kartu
  const dotPattern = "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E\")";

  const primaryCards = [
    { title: "Kamar Terisi", val: `${stats.kamarTerisi} / ${stats.totalKamar}`, icon: Home, bg: "bg-blue-600", link: "/admin/kamar" },
    { title: "Total Penghuni", val: stats.totalPenghuni, icon: Users, bg: "bg-emerald-600", link: "/admin/penghuni" }
  ];

  const actionCards = [
    { title: "Verifikasi", val: stats.verifikasi, icon: Clock, color: "text-amber-600", bg: "bg-amber-100", link: "/admin/tagihan" },
    { title: "Tunggakan", val: stats.tunggakan, icon: Receipt, color: "text-rose-600", bg: "bg-rose-100", link: "/admin/tagihan" },
    { title: "Laporan Baru", val: stats.laporanBaru, icon: AlertCircle, color: "text-purple-600", bg: "bg-purple-100", link: "/admin/laporan" }
  ];

  return (
    <div className="px-5 mt-6 space-y-8 pb-10 bg-[#f1f5f9] min-h-screen">
      <div>
        <h1 className="text-2xl font-black text-[#0D2F5C] tracking-tight">DASHBOARD</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Management Panel Mutiara Kost</p>
      </div>

      {/* Grid Utama dengan Motif */}
      <div className="grid grid-cols-2 gap-4">
        {primaryCards.map((c, i) => (
          <div 
            key={i} 
            onClick={() => navigate(c.link)} 
            style={{ backgroundImage: dotPattern }}
            className={`${c.bg} p-6 rounded-3xl text-white shadow-lg shadow-slate-300 cursor-pointer active:scale-95 transition-all`}
          >
            <c.icon className="w-8 h-8 mb-6" />
            <p className="text-2xl font-black">{loading ? "..." : c.val}</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-90 mt-1">{c.title}</p>
          </div>
        ))}
      </div>

      {/* Monitoring Section dengan Background Colorfull */}
      <div>
        <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-4 pl-1">Monitoring & Aksi</h3>
        <div className="space-y-3">
          {actionCards.map((c, i) => (
            <div key={i} onClick={() => navigate(c.link)} 
              className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-300 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4">
                <div className={`${c.bg} ${c.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-black text-[#0D2F5C] uppercase tracking-widest">{c.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-black ${c.color} bg-slate-100 px-4 py-1.5 rounded-full`}>
                  {loading ? "..." : c.val}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}