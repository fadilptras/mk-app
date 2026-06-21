import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useManageKontrak } from '../../../hooks/admin/kontrak/useManageKontrak';
import { Search, Clock, FileText, Archive, ChevronRight } from 'lucide-react';

type TabType = 'menunggu_persetujuan' | 'aktif' | 'arsip';

export default function KelolaKontrakView() {
    const { kontrak, loading } = useManageKontrak();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState<TabType>('menunggu_persetujuan');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredKontrak = useMemo(() => {
        return kontrak.filter((item) => {
            const isMatchTab = 
                activeTab === 'arsip' 
                ? ['selesai', 'ditolak', 'dibatalkan'].includes(item.status)
                : item.status === activeTab;
                
            const userName = item.user?.profile?.nama_lengkap?.toLowerCase() || '';
            const roomNum = item.user?.room?.room_number?.toLowerCase() || '';
            const matchSearch = userName.includes(searchQuery.toLowerCase()) || roomNum.includes(searchQuery.toLowerCase());
            
            return isMatchTab && matchSearch;
        });
    }, [kontrak, activeTab, searchQuery]);

    // Format Tanggal Singkat Helper
    const formatTanggalSingkat = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    return (
        <div className="px-5 mt-6 space-y-5 pb-10">
            <div>
                <h1 className="text-xl font-black text-[#0D2F5C] uppercase tracking-widest">
                    Kelola Kontrak
                </h1>
                <p className="text-[#7A93B5] text-xs font-medium mt-1">
                    Manajemen penyewaan dan masa aktif penghuni
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar">
                <button
                    onClick={() => setActiveTab('menunggu_persetujuan')}
                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === 'menunggu_persetujuan' ? 'bg-[#0D2F5C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    <Clock className="w-3.5 h-3.5" /> 
                    Menunggu
                    {kontrak.filter(k => k.status === 'menunggu_persetujuan').length > 0 && (
                        <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">
                            {kontrak.filter(k => k.status === 'menunggu_persetujuan').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('aktif')}
                    className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === 'aktif' ? 'bg-[#0D2F5C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    <FileText className="w-3.5 h-3.5" /> Aktif
                </button>
                <button
                    onClick={() => setActiveTab('arsip')}
                    className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === 'arsip' ? 'bg-[#0D2F5C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
                    }`}
                >
                    <Archive className="w-3.5 h-3.5" /> Arsip
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Cari nama penghuni atau no. kamar..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border-none shadow-[0_4px_20px_rgba(13,47,92,0.05)] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D2F5C] mx-auto mb-3"></div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Memuat Data...
                        </p>
                    </div>
                ) : filteredKontrak.length === 0 ? (
                    <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <p className="text-slate-400 text-sm font-bold">
                            Tidak ada kontrak pada kategori ini.
                        </p>
                    </div>
                ) : (
                    filteredKontrak.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => navigate(`/admin/kontrak/${item.id}`)}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-3 relative overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                        >
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.jenis_kontrak === 'baru' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                            
                            <div className="flex justify-between items-start pl-2">
                                <div>
                                    <span className="text-[10px] font-black text-[#7A93B5] uppercase tracking-widest block mb-1">
                                        Kamar {item.user?.room?.room_number || '--'}
                                    </span>
                                    <p className="text-sm font-black text-[#0D2F5C] truncate max-w-[200px] group-hover:text-blue-600 transition-colors">
                                        {item.user?.profile?.nama_lengkap || 'Tanpa Nama'}
                                    </p>
                                    
                                    {/* TAMBAHAN FITUR: Konteks Waktu di Card */}
                                    <div className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-1.5">
                                      <Clock className="w-3 h-3 text-slate-300" />
                                      {item.status === 'aktif' 
                                        ? <span>Berakhir: <span className="text-rose-500">{formatTanggalSingkat(item.akhir_sewa)}</span></span> 
                                        : item.status === 'menunggu_persetujuan'
                                        ? <span>Diajukan: <span className="text-[#0D2F5C]">{formatTanggalSingkat(item.created_at)}</span></span>
                                        : <span>Status: <span className="text-slate-500">{item.status}</span></span>
                                      }
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${item.jenis_kontrak === 'baru' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                        {item.jenis_kontrak}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}