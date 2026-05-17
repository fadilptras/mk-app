import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Report {
  id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

export default function LaporView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [formData, setFormData] = useState({
    kategori: 'Kerusakan Fasilitas',
    deskripsi: ''
  });
  
  const [history, setHistory] = useState<Report[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportHistory = async (userId: string) => {
    try {
      setLoadingHistory(true);
      const { data, error: historyError } = await supabase
        .from('reports')
        .select('id, category, description, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;
      setHistory(data || []);
    } catch (err) {
      console.error('Gagal memuat riwayat laporan:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;

        if (userId) {
          const { data: roomData } = await supabase
            .from('rooms')
            .select('id')
            .eq('current_tenant_id', userId)
            .maybeSingle();
          
          if (roomData) {
            setRoomId(roomData.id);
          }

          await fetchReportHistory(userId);
        }
      } catch (err) {
        console.error('Gagal inisialisasi data:', err);
      }
    };

    initializeData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deskripsi.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');

      const { error: insertError } = await supabase
        .from('reports')
        .insert([
          {
            user_id: userId,
            room_id: roomId,
            category: formData.kategori,
            description: formData.deskripsi,
            status: 'PENDING'
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ kategori: 'Kerusakan Fasilitas', deskripsi: '' });
      await fetchReportHistory(userId);

      setTimeout(() => {
        setSuccess(false);
        setActiveTab('history');
      }, 1500);

    } catch (err: any) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Gagal mengirim laporan. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PROCESSING':
      case 'IN_PROGRESS':
        return <span className="text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Diproses</span>;
      case 'RESOLVED':
        return <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Selesai</span>;
      case 'REJECTED':
        return <span className="text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Ditolak</span>;
      default:
        return <span className="text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Menunggu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-16">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        
        {/* Header Biru Premium */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          {/* Diperbaiki: Ditambahkan aria-label */}
          <button 
            onClick={() => navigate('/dashboard')} 
            aria-label="Kembali ke Dashboard"
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Layanan Pengaduan</h1>
        </div>

        <div className="p-6">
          
          {/* Banner Penjelasan - Elegan & Kontras Tinggi */}
          <div className="bg-indigo-50/80 border border-indigo-100/80 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex gap-3.5 items-start mb-6">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-[11px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                Pusat Bantuan Kosan
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              </h2>
              <p className="text-[10px] font-bold text-indigo-900/80 leading-normal uppercase">
                Sampaikan kendala fasilitas kamar atau area bersama agar segera ditindaklanjuti secara langsung oleh Admin.
              </p>
            </div>
          </div>

          {/* Navigasi Menu Tab */}
          <div className="bg-gray-100/80 p-1 rounded-2xl flex items-center mb-6">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 text-center py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Buat Laporan
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 text-center py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Riwayat Keluhan
              {history.length > 0 && (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-white'}`}>
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'form' ? (
            <>
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center mb-4 animate-fade-in">
                  <p className="text-[11px] font-black text-emerald-900 leading-relaxed uppercase">
                    Laporan dikirim! Mengalihkan ke halaman riwayat...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-center mb-4">
                  <p className="text-[11px] font-black text-red-900 leading-relaxed uppercase">
                    ⚠️ {error}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                  <div>
                    {/* Diperbaiki: Ditambahkan htmlFor */}
                    <label htmlFor="kategori_laporan" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Pilih Kategori Masalah
                    </label>
                    <div className="relative">
                      {/* Diperbaiki: Ditambahkan id */}
                      <select
                        id="kategori_laporan"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black text-gray-800 tracking-tight focus:border-indigo-400 outline-none appearance-none cursor-pointer"
                        value={formData.kategori}
                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      >
                        <option value="Kerusakan Fasilitas">Kerusakan Fasilitas</option>
                        <option value="Masalah Air / Plambing">Masalah Air / Plambing</option>
                        <option value="Gangguan Jaringan WiFi">Gangguan Jaringan WiFi</option>
                        <option value="Masalah Kebersihan">Masalah Kebersihan</option>
                        <option value="Keluhan Lainnya">Keluhan Lainnya</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Diperbaiki: Ditambahkan htmlFor */}
                    <label htmlFor="deskripsi_laporan" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Deskripsi Kendala secara Detail
                    </label>
                    {/* Diperbaiki: Ditambahkan id */}
                    <textarea
                      id="deskripsi_laporan"
                      required
                      rows={4}
                      placeholder="Contoh: Lampu utama kamar mandi berkedip terus menerus lalu mati sejak tadi pagi..."
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 leading-relaxed placeholder-gray-400 focus:border-indigo-400 outline-none resize-none"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Lampiran Foto Bukti
                    </label>
                    <div className="w-full p-5 border-2 border-dashed border-gray-200 rounded-[20px] bg-gray-50/50 flex flex-col items-center justify-center hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-not-allowed group">
                      <div className="w-10 h-10 mb-2 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-black text-gray-600 group-hover:text-indigo-600 uppercase tracking-wider">Unggah Foto Kendala</span>
                      <span className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase">(Segera Hadir)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none transition-all flex items-center justify-center text-xs uppercase tracking-wider"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'KIRIM LAPORAN'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              {loadingHistory ? (
                <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Sinkronisasi Data...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <span className="text-2xl mb-2 block">📋</span>
                  <p className="text-[11px] font-black text-gray-400 uppercase leading-normal">Belum ada riwayat pengaduan keluhan.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {history.map((report) => (
                    <div 
                      key={report.id} 
                      className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-[0_6px_25px_rgba(0,0,0,0.01)] flex flex-col space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight truncate max-w-[70%]">
                          {report.category}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>
                      
                      <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase">
                        {report.description}
                      </p>
                      
                      <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-wider">
                        <span>Tanggal Pengajuan</span>
                        <span className="text-gray-500 font-bold">{formatDate(report.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}