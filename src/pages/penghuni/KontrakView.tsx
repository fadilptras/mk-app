import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';

// Asumsi harga dasar per bulan, silahkan sesuaikan dengan databasemu
const HARGA_PER_BULAN = 1500000; 

export default function KontrakView() {
  const navigate = useNavigate();
  
  // Mengambil data profile dari hook (sesuaikan field-nya dengan struktur databasemu)
  const { profileData, loading } = useProfileCheck();
  
  // State untuk form
  const [lamaSewa, setLamaSewa] = useState<number>(0);
  const [mulaiSewa, setMulaiSewa] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Kalkulasi Biaya
  const totalBiaya = lamaSewa * HARGA_PER_BULAN;

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  if (loading) {
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
        <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-700 pt-6 pb-14 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          {/* Top Bar */}
          <div className="flex items-center gap-4 relative z-10 mb-6">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/30 transform active:scale-95 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <h1 className="text-xl font-black text-white tracking-wide">Data Kontrak Sewa</h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-5 -mt-8 relative z-20 space-y-5">

          {/* SECTION 1: DATA PRIBADI & KAMAR */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-800">Informasi Penghuni</h2>
                <p className="text-[10px] text-gray-500 font-medium">Data terdaftar di sistem</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Nama Lengkap</span>
                <span className="text-xs font-black text-gray-800">{profileData?.full_name || profileData?.nama || 'Belum diatur'}</span>
              </div>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Nomor Kamar</span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Kamar {profileData?.room_number || profileData?.kamar || '-'}
                </span>
              </div>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Nomor HP</span>
                <span className="text-xs font-bold text-gray-700">{profileData?.phone || profileData?.no_hp || '-'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: FORMULIR KONTRAK & REKAPAN BIAYA */}
          <div className="bg-white rounded-[24px] p-5 shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-800">Detail Sewa</h2>
                <p className="text-[10px] text-gray-500 font-medium">Tentukan durasi dan mulai sewa</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-700 uppercase ml-1">Mulai Sewa</label>
                <input 
                  type="date" 
                  value={mulaiSewa}
                  onChange={(e) => setMulaiSewa(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium transition-all outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-700 uppercase ml-1">Lama Sewa</label>
                <select 
                  value={lamaSewa}
                  onChange={(e) => setLamaSewa(Number(e.target.value))}
                  className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 font-medium transition-all outline-none"
                >
                  <option value={0} disabled>Pilih Lama Sewa</option>
                  <option value={1}>1 Bulan</option>
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={12}>1 Tahun (12 Bulan)</option>
                </select>
              </div>

              {/* REKAPAN BIAYA MUNCUL JIKA LAMA SEWA > 0 */}
              {lamaSewa > 0 && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-fade-in-up">
                  <h3 className="text-[11px] font-black text-indigo-800 uppercase mb-3">Ringkasan Pembayaran</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-indigo-600 font-medium">Biaya per Bulan</span>
                      <span className="text-xs font-bold text-indigo-900">{formatRupiah(HARGA_PER_BULAN)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-indigo-600 font-medium">Durasi Sewa</span>
                      <span className="text-xs font-bold text-indigo-900">{lamaSewa} Bulan</span>
                    </div>
                    <div className="w-full h-px bg-indigo-200/50 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-black text-indigo-900">Total Biaya</span>
                      <span className="text-sm font-black text-indigo-700">{formatRupiah(totalBiaya)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-1.5 pt-2">
                <div className="flex items-start gap-3 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl cursor-pointer" onClick={() => setIsAgreed(!isAgreed)}>
                  <input 
                    type="checkbox" 
                    checked={isAgreed}
                    readOnly
                    className="mt-0.5 w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500" 
                  />
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    Saya menyetujui seluruh peraturan dan tata tertib yang berlaku selama menyewa kamar ini, serta bersedia mematuhi ketentuan pembayaran.
                  </p>
                </div>
              </div>
            </div>

            <button 
              disabled={lamaSewa === 0 || !mulaiSewa || !isAgreed}
              className={`w-full mt-6 text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-lg
                ${(lamaSewa > 0 && mulaiSewa && isAgreed) 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-200 transform active:scale-95' 
                  : 'bg-gray-300 shadow-none cursor-not-allowed'
                }`}
            >
              SIMPAN & LANJUT PEMBAYARAN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}