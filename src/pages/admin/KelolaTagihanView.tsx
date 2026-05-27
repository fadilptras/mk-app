import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTagihan } from '../../hooks/useAdminTagihan';
import { formatCurrency } from '../../utils/formatters'; 
import { Search, CheckSquare, XSquare, List, ChevronRight } from 'lucide-react';

export default function KelolaTagihanView() {
  const { tagihan, loading } = useAdminTagihan();
  const navigate = useNavigate();
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTagihan = useMemo(() => {
    return tagihan.filter((item) => {
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      const userName = item.user?.profile?.nama_lengkap?.toLowerCase() || '';
      const roomNum = item.user?.room?.room_number?.toLowerCase() || '';
      const matchSearch = userName.includes(searchQuery.toLowerCase()) || roomNum.includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [tagihan, filterStatus, searchQuery]);

  // Helper untuk label UI status disesuaikan dengan permintaan baru
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'paid': return { label: 'Lunas', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      // Status 'pending' kita map ke 'Belum Bayar' secara visual berdasarkan instruksi terbaru
      case 'pending': 
      case 'unpaid': return { label: 'Belum Bayar', color: 'bg-rose-50 text-rose-600 border-rose-100' };
      default: return { label: status, color: 'bg-slate-50 text-slate-600' };
    }
  };

  return (
    <div className="px-5 mt-6 space-y-5 pb-10">
      <div>
        <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">Kelola Tagihan</h1>
        <p className="text-[#7A93B5] text-xs font-medium mt-1">Pantau pembayaran sewa penghuni</p>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(13,47,92,0.05)] border border-slate-100 flex flex-col gap-4">
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl w-full overflow-x-auto custom-scrollbar">
            <button 
                onClick={() => setFilterStatus('all')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === 'all' ? 'bg-[#0D2F5C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
            >
                <List className="w-3.5 h-3.5" /> Semua
            </button>
            <button 
                onClick={() => setFilterStatus('unpaid')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === 'unpaid' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
            >
                <XSquare className="w-3.5 h-3.5" /> Belum Bayar
            </button>
            <button 
                onClick={() => setFilterStatus('paid')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === 'paid' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
            >
                <CheckSquare className="w-3.5 h-3.5" /> Lunas
            </button>
        </div>

        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Cari penghuni atau no. kamar..." 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Daftar Tagihan (Compact Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
            <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mx-auto mb-3"></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Memuat Tagihan...</p>
            </div>
        ) : filteredTagihan.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-slate-400 text-sm font-bold">Tidak ada tagihan di kategori ini.</p>
            </div>
        ) : (
            filteredTagihan.map((item) => {
                const statusInfo = getStatusDisplay(item.status);
                return (
                    <div 
                        key={item.id} 
                        onClick={() => navigate(`/admin/tagihan/${item.id}`)}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-3 relative overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                    >
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${item.status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        
                        <div className="flex justify-between items-center pl-2">
                            <div>
                                <span className="text-[10px] font-black text-[#7A93B5] uppercase tracking-widest block mb-1">
                                    Kamar {item.user?.room?.room_number || '--'}
                                </span>
                                <p className="text-sm font-black text-[#0D2F5C] truncate max-w-[180px] group-hover:text-blue-600 transition-colors">
                                    {item.user?.profile?.nama_lengkap || 'Tanpa Nama'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${statusInfo.color}`}>
                                    {statusInfo.label}
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>

                        <div className="pl-2 flex justify-between items-end border-t border-slate-50 pt-2">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Periode</p>
                                <p className="font-bold text-slate-700 text-xs">{item.periode_tagihan}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-blue-600 text-sm">{formatCurrency(item.nominal_tagihan)}</p>
                            </div>
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}