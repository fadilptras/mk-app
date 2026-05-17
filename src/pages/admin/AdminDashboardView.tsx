import { useAdminData } from '../../hooks/useAdminData';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardView() {
  const { penghuni, rooms, loading } = useAdminData();
  const navigate = useNavigate();

  // Menghitung kamar terisi
  const terisiCount = penghuni.filter(p => p.kamar_id).length;
  const kosongCount = rooms.length - terisiCount;

  return (
    <div className="px-5 mt-6 space-y-6">
      <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight pl-1">Ringkasan Kos</h3>

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate('/admin/kamar')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-left active:scale-95 transition-all cursor-pointer">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Unit Kamar</p>
          <p className="text-3xl font-black text-indigo-600">{rooms.length}</p>
          <span className="text-[9px] font-black text-indigo-400 uppercase mt-2 block">Kelola Kamar →</span>
        </div>
        <div onClick={() => navigate('/admin/penghuni')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-left active:scale-95 transition-all cursor-pointer">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Penghuni</p>
          <p className="text-3xl font-black text-emerald-600">{penghuni.length}</p>
          <span className="text-[9px] font-black text-emerald-400 uppercase mt-2 block">Kelola Penghuni →</span>
        </div>
      </div>

      {/* Info Status Kamar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Okupansi Kamar</p>
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Terisi</p>
            <p className="text-lg font-black text-slate-800">{loading ? '--' : terisiCount} Unit</p>
          </div>
          <div className="w-px bg-gray-100 my-1"></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tersedia</p>
            <p className="text-lg font-black text-slate-800">{loading ? '--' : kosongCount < 0 ? 0 : kosongCount} Unit</p>
          </div>
        </div>
      </div>
    </div>
  );
}